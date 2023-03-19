const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  walletAddress: {
    type: String,
    required: true,
  },
  shards: {
    type: Number,
    default: 0,
  },
  deck: [
    {
      id: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
