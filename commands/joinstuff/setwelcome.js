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
  const messagee = args.slice(1).join(" ");

  if (!channel) {
    return message.channel.send(
      "Please check if you mentioned a channel I can see the channel and i can send messages in the channel!"
    );
  }
  if (!messagee) {
    return message.channel.send(
      "You must add a message to say to say in the welcome message"
    );
  } else if (channel) {
    GuildSettings.findOne({ gid: message.guild.id }, (err, data) => {
      if (data) {
        data.welcomechannel = channel.id;
        data.welcomechannelText = messagee;
        data.save();
        const newLog = new MessageEmbed()
          .setTitle("Welcome channel")
          .setColor(config.Maincolor)
          .setDescription(
            `**${channel.name}** is now your welcome channel and you have **${data.welcomechannelText}** as your welcome message!`
          )
          .setFooter(config.Footer);
        message.channel.send({ embeds: [newLog] });
        return;
      }
    });
  }
};

module.exports.data = {
  name: "setwelcome",
  aliases: ["welcomechannel"],
  description: "Allows you to have a channel to welcome new users.",
  params: "setwelcome #channel welcomemessage",
  type: "Join events",
};
