require("dotenv").config();
const mongoose = require("../config/mongo");

const Comment = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  type: {
    type: String,
    enum: ["PUBLIC", "PRIVATE"],
    required: true,
  },
  text: { type: String, required: true },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comment", Comment);
