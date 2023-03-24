const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const dotenv = require("dotenv");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const app = express();

mongoose.set("strictQuery", true);
dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.error(err));

app.use(cors());

const server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// User Login and Registration
app.post("/login", async (req, res) => {
  try {
    const { username, password, walletAddress } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    if (user.walletAddress !== walletAddress) {
      return res.status(401).json({ message: "Invalid wallet address" });
    }

    const token = jwt.sign({ userId: user._id }, "mysecretkey");
    res.json({
      username: user.username,
      shards: user.shards,
      rankRating: user.rankRating,
      wins: user.wins,
      losses: user.losses,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/register", async (req, res) => {
  try {
    const { username, password, walletAddress } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const existingWallet = await User.findOne({ walletAddress });

    if (existingWallet) {
      return res
        .status(400)
        .json({ message: "Wallet is already registered with another account" });
    }

    if (!password || typeof password !== "string") {
      return res.status(400).json({ message: "Invalid password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      password: hashedPassword,
      walletAddress,
    });

    await user.save();
    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user's currency
app.post("/currency", async (req, res) => {
  try {
    const { username, amount } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add amount to user's current currency
    user.currency += amount;
    await user.save();

    res.json({
      message: "Currency updated successfully",
      currency: user.currency,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user's currency by subtracting amount
app.post("/currency/subtract", async (req, res) => {
  try {
    const { username, amount } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has enough currency to subtract
    if (user.currency < amount) {
      return res.status(400).json({ message: "Not enough currency" });
    }

    // Subtract amount from user's current currency
    user.currency -= amount;
    await user.save();

    res.json({
      message: "Currency updated successfully",
      currency: user.currency,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// // Saving of Cards opened from packs to allow users to make decks without interacting with the contract

// app.post("/card", async (req, res) => {
//   try {
//     const { name, attack, defense } = req.body;
//     const card = new Card({
//       name,
//       attack,
//       defense,
//     });

//     await card.save();
//     res.json({ message: "Card added to user successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// app.get("/card", async (req, res) => {
//   try {
//     const cards = await Card.find();
//     res.json(cards);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// app.delete("/card/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     await Card.findByIdAndDelete(id);
//     res.json({ message: "Card deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// Saving of Decks using cards on the users account

app.patch("/deck", async (req, res) => {
  try {
    const { cards, username } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.deck = cards.map((card) => ({
      id: card.id,
      image: card.image,
      name: card.name,
    }));

    await user.save();

    res.json({ message: "Deck saved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/deck", async (req, res) => {
  try {
    const { username } = req.query;
    const user = await User.findOne({ username }).populate("deck");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.deck);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Socket.io server

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);

  //creating room
  socket.on("create_room", (roomName) => {
    const newRoom = io.sockets.adapter.rooms.get(roomName);
    if (newRoom) {
      socket.emit("create_room_error", {
        message: `Room ${roomName} already exists`,
      });
    } else {
      socket.join(roomName);
      console.log(`Room ${roomName} created`);
      socket.emit("create_room_success");
    }
  });

  //joining room
  socket.on("join_room", (data) => {
    const room = io.sockets.adapter.rooms.get(data);
    if (room && room.size < 2) {
      socket.join(data);
      console.log(`User ${socket.id} joined room ${data}`);
      socket.emit("join_room_success");
    } else {
      socket.emit("join_room_error", {
        message: "Room does not exist or is full",
      });
    }
  });

  //leaving room
  socket.on("leave_room", (data) => {
    socket.disconnect(data);
  });

  //sending message
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

server.listen(3001, () => {
  console.log("Socket.io is running on port 3001");
});
