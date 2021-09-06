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
      .setLabel("Invite")
      .setStyle("LINK")
      .setURL(
        "https://discord.com/api/oauth2/authorize?client_id=869106671627145227&permissions=8&scope=bot"
      )
  );
  const embed = new MessageEmbed()
    .setTitle("Invite")
    .setColor(config.Maincolor)
    .setDescription(
      `You can invite Vertex to your own server by clicking the button below!`
    )
    .setFooter(config.Footer);
  message.channel.send({ embeds: [embed], components: [row] });
};
module.exports.data = {
  name: "invite",
  aliases: ["inv"],
  description: "This command can get you the Vertex bot invite link.",
  params: "invite",
  type: "Basic utilities",
};
