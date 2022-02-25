require("dotenv").config();
const mongoose = require("../config/mongo");

const User = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  friends: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      status: {
        type: Number,
        enums: [1, 2, 3], // 1 - Requested, 2 - Pending, 3 - Friends
      },
    },
  ],
});

const passportLocalMongoose = require("passport-local-mongoose");

User.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", User);
