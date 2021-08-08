const { Schema, model } = require("mongoose");

// We declare new schema.
const verifyMsgSchema = new Schema({
  gid: { type: String },
  verifyChannel: { type: String },
  verifyRole: { type: String },
});

// We export it as a mongoose model.
module.exports = model("verify_msg", verifyMsgSchema);
