const { MessageEmbed, Permissions } = require("discord.js");
const emojis = require("../../emoji.json");
const config = require("../../config.json");
const GuildSettings = require("../../models/settings");

module.exports.run = async (client, message, args) => {
  const embed = new MessageEmbed()
    .setTitle("Support server")
    .setColor(config.Maincolor)
    .setDescription(`[Join the support server](https://discord.gg/EcdPApY8Kd)`)
    .setFooter(config.Footer);
  message.channel.send({ embeds: [embed] });
};
module.exports.data = {
  name: "support",
  aliases: ["server"],
  description: "This command can get you the Vertex bot support server.",
  params: "support",
  type: "Basic utilities",
};
