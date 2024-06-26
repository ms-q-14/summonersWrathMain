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
const { v4: uuidv4 } = require("uuid");
const lobbyId = uuidv4();
const moment = require("moment");

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

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

let waitingLobbies = [];
const gameLobbies = [];

io.on("connection", (socket) => {
  console.log(`User connected to waiting Lobby ${socket.id}`);

  const clientId = socket.id;

  socket.on("search_lobby", (username) => {
    let waitingLobby = waitingLobbies.find((lobby) => lobby.numPlayers < 2);

    if (!waitingLobby) {
      waitingLobby = { id: uuidv4(), players: [], numPlayers: 0 };
      waitingLobbies.push(waitingLobby);
    }

    waitingLobby.players.push({ id: clientId, username });
    waitingLobby.numPlayers++;

    socket.join(waitingLobby.id);

    const firstPlayer =
      waitingLobby.players.find((player) => player.username !== username)
        ?.username || "";

    const message =
      waitingLobby.numPlayers === 1
        ? `Waiting for another player to join...`
        : `Beginning game with ${firstPlayer} and ${username}`;

    io.to(waitingLobby.id).emit("player joined", {
      numPlayers: waitingLobby.numPlayers,
      message: message,
    });

    if (waitingLobby.numPlayers === 2) {
      const gameLobbyId = uuidv4();
      const gameLobby = { id: gameLobbyId, players: waitingLobby.players };

      const playerNames = waitingLobby.players.map((player) => player.username);
      io.to(waitingLobby.id).emit("game_started", {
        players: playerNames,
        gameId: gameLobbyId,
      });
      console.log(
        `Game Lobby ${gameLobbyId} started with ${playerNames.length} players`
      );
      // delete the waiting lobby after the game starts
      waitingLobbies = waitingLobbies.filter(
        (lobby) => lobby.id !== waitingLobby.id
      );
    } else if (waitingLobbies.length === 1) {
      io.to(clientId).emit("waiting for player", {
        message: "Looking for another player",
      });
    }
  });

  socket.on("disconnect", () => {
    const lobby = waitingLobbies.find((lobby) =>
      lobby.players.some((player) => player.id === clientId)
    );

    if (lobby) {
      lobby.players = lobby.players.filter((player) => player.id !== clientId);
      lobby.numPlayers--;

      io.to(lobby.id).emit("player left", {
        numPlayers: lobby.numPlayers,
        message: "A player has left the lobby",
      });

      if (lobby.numPlayers === 0) {
        waitingLobbies = waitingLobbies.filter((l) => l.id !== lobby.id);
      }
    }
  });

  socket.on("join_room", (gameId, username) => {
    const room = io.sockets.adapter.rooms.get(gameId);
    if (room && room.size >= 2) {
      socket.emit("join_room_error", {
        message: `Room ${gameId} is full`,
      });
    } else {
      socket.join(gameId);
      console.log(`Room ${gameId} created`);
      socket.emit("join_room_success", { username });
    }
  });

  socket.on("send_message", (data) => {
    const { sender, message } = data;
    const timestamp = new Date().getTime();
    const formattedTime = moment(timestamp).format("h:mm A");

    const newMessage = {
      sender,
      message,
      timestamp,
      formattedTime,
    };

    // messages.push(newMessage);
    // if (messages.length > 20) {
    //   messages.shift();
    // }

    io.emit("receive_message", newMessage);
  });

  socket.on("leave_lobby", () => {
    for (let i = 0; i < waitingLobbies.length; i++) {
      const index = waitingLobbies[i].players.findIndex(
        (player) => player.id === clientId
      );
      if (index !== -1) {
        const username = waitingLobbies[i].players[index].username;
        const socketId = waitingLobbies[i].players[index].socketId;
        waitingLobbies[i].players.splice(index, 1);
        waitingLobbies[i].numPlayers--;
        io.to(waitingLobbies[i].id).emit("player left", {
          numPlayers: waitingLobbies[i].numPlayers,
          message: `${username} has left the lobby`,
        });
        if (waitingLobbies[i].numPlayers === 0) {
          waitingLobbies.splice(i, 1);
        } else {
          io.to(socketId).emit("lobby left", {
            message: `You have left the lobby`,
          });
        }
        break;
      }
    }
  });
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

server.listen(3001, () => {
  console.log("Socket.io is running on port 3001");
});
