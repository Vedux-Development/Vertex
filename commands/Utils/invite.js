const { MessageEmbed, Permissions } = require("discord.js");
const emojis = require("../../emoji.json");
const config = require("../../config.json");
const GuildSettings = require("../../models/settings");

module.exports.run = async (client, message, args) => {
  const embed = new MessageEmbed()
    .setTitle("Invite")
    .setColor(config.Maincolor)
    .setDescription(
      `[Invite Vertex by clicking here](https://discord.com/api/oauth2/authorize?client_id=869106671627145227&permissions=8&scope=bot)`
    )
    .setFooter(config.Footer);
  message.channel.send({ embeds: [embed] });
};
module.exports.data = {
  name: "invite",
  aliases: ["inv"],
  description: "This command can get you the Vertex bot invite link.",
  params: "invite",
  type: "Basic utilities",
};
