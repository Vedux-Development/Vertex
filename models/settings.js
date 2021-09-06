const { Schema, model } = require("mongoose");

// We declare new schema.
const guildSettingSchema = new Schema({
  gid: { type: String },
  banned: { type: Boolean, default: false },
  premium: { type: Boolean },
  prefix: { type: String },
  logchannel: { type: String },
  welcomechannel: { type: String },
  welcomechannelText: { type: String },
  onjoinrole: { type: String },
});

// We export it as a mongoose model.
module.exports = model("guild_settings", guildSettingSchema);
