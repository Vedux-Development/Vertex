const mongoose = require("mongoose");

const { MessageEmbed, Permissions } = require("discord.js");
const emojis = require("../../emoji.json");
const config = require("../../config.json");
const GuildSettings = require("../../models/settings");

module.exports.run = async (client, message, args) => {
  if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD))
    return message.channel.send(
      "You must have the `MANAGE_GUILD` perm to use this command!"
    );
  let prefix = config.prefix;
  if (!args[0]) {
    message.channel.send(
      `You must input what you want the prefix to be ${emojis.Error1}`
    );
  }

  const newPrefix = args[0];
  if (args[0]) {
    GuildSettings.findOne({ gid: message.guild.id }, (err, data) => {
      if (err) throw err;
      if (data.prefix === newPrefix) {
        const alreadyPrefix = new MessageEmbed()
          .setTitle("Prefix")
          .setColor(config.Errorcolor)
          .setDescription(`**${newPrefix}** is already your prefix`)
          .setFooter(config.Footer);
        message.channel.send({ embeds: [alreadyPrefix] });
        return;
      }
      data.prefix = newPrefix;
      data.save();
      const newFix = new MessageEmbed()
        .setTitle("Prefix")
        .setColor(config.Maincolor)
        .setDescription(`${newPrefix} is now your prefix `)
        .setFooter(config.Footer);
      message.channel.send({ embeds: [newFix] });
      return;
    });
  }
};

module.exports.data = {
  name: "prefix",
  aliases: ["setprefix"],
  description: "A command that allows you to change your guilds prefix.",
  params: "prefix newPrefix",
  type: "Basic utilities",
};
