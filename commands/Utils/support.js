const {
  MessageEmbed,
  Permissions,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const emojis = require("../../emoji.json");
const config = require("../../config.json");
const GuildSettings = require("../../models/settings");

module.exports.run = async (client, message, args) => {
  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setLabel("Server")
      .setStyle("LINK")
      .setURL("https://discord.gg/nesgSBV2wF")
  );
  const embed = new MessageEmbed()
    .setTitle("Server")
    .setColor(config.Maincolor)
    .setDescription(`Come join the Vedux server to get help with Vertex`)
    .setFooter(config.Footer);
  message.channel.send({ embeds: [embed], components: [row] });
};
module.exports.data = {
  name: "support",
  aliases: [],
  description: "Get the Vedux server link.",
  params: "support",
  type: "Basic utilities",
};
