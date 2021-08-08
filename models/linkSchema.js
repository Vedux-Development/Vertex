const mongoose = require("mongoose");

let LinkSchema = new mongoose.Schema({
  gid: String,
  enabled: { type: Boolean, default: false },
  links: Array,
});
const MessageModel = (module.exports = mongoose.model("Link", LinkSchema));
