const mongoose = require("mongoose");

let SpamSchema = new mongoose.Schema({
  gid: String,
  enabled: { type: Boolean, default: false },
  msgLimit: Number,
  timeLimit: Number,
  resetTime: Number,
  punish1: Number,
  punish2: Number,
  punish3: Number,
});

const MessageModel = (module.exports = mongoose.model("Spam", SpamSchema));
