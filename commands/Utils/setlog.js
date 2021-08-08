const emojis = require("../../emoji.json");
const { MessageEmbed, Permissions } = require("discord.js");
const config = require("../../config.json");
const GuildSettings = require("../../models/settings");

module.exports.run = async (client, message, args) => {
  if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD))
    return message.reply({
      content: "You must have the `MANAGE_GUILD` perm to use this command!",
      allowedMentions: { repliedUser: false },
    });
  const channel = message.mentions.channels.first();

  if (!channel) {
    message.channel.send(
      "Please check if you mentioned a channel I can see the channel and i can send messages in the channel!"
    );
  } else if (channel) {
    GuildSettings.findOne({ gid: message.guild.id }, (err, data) => {
      if (data) {
        if (data.logchannel === channel.id) {
          const alreadyLog = new MessageEmbed()
            .setTitle("Logs")
            .setColor(config.Errorcolor)
            .setDescription(`**${channel.name}** is already your log channel!`)
            .setFooter(config.Footer);
          message.channel.send({ embeds: [alreadyLog] });
          return;
        } else {
          data.logchannel = channel.id;
          data.save();
          const newLog = new MessageEmbed()
            .setTitle("Logs")
            .setColor(config.Maincolor)
            .setDescription(`**${channel.name}** is now your log channel!`)
            .setFooter(config.Footer);
          message.channel.send({ embeds: [newLog] });
          return;
        }
      }
    });
  }
};

module.exports.data = {
  name: "setlog",
  aliases: ["logchannel"],
  description: "Allows you to have a channel where all important mod logs go.",
  params: "setlog #channel",
  type: "Basic utilities",
};
