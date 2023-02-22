const mongoose = require("mongoose");

const deckSchema = new mongoose.Schema({
  cards: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Card",
      required: true,
    },
  ],
});

module.exports = mongoose.model("Deck", deckSchema);
