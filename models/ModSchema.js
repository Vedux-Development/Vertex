const mongoose = require("mongoose");

let ModSchema = new mongoose.Schema({
  gid: String,
  uid: String,
  Punishments: Array,
});

const MessageModel = (module.exports = mongoose.model("Moderation", ModSchema));
