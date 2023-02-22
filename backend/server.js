const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const dotenv = require("dotenv");

mongoose.set("strictQuery", true);
dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.error(err));

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// User Login and Registration
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, "mysecretkey");
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/register", async (req, res) => {
  try {
    const { username, password, walletAddress } = req.body;

    if (!username || !password || !walletAddress) {
      return res.status(400).json({
        message: "Username, password, and wallet address are required",
      });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
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

// Saving of Cards opened from packs to allow users to make decks without interacting with the contract

app.post("/card", async (req, res) => {
  try {
    const { name, attack, defense } = req.body;
    const card = new Card({
      name,
      attack,
      defense,
    });

    await card.save();
    res.json({ message: "Card added to user successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/card", async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/card/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Card.findByIdAndDelete(id);
    res.json({ message: "Card deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Saving of Decks using cards on the users account

app.post("/deck", async (req, res) => {
  try {
    const { cards } = req.body;
    const deck = new Deck({
      cards,
    });

    await deck.save();
    res.json({ message: "Deck saved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/deck", async (req, res) => {
  try {
    const decks = await Deck.find();
    res.json(decks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
