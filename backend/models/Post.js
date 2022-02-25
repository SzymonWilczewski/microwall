require("dotenv").config();
const mongoose = require("../config/mongo");

const Post = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: ["PUBLIC", "PRIVATE", "GENERAL"],
    required: true,
  },
  text: { type: String, required: true },
  visited: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", Post);
