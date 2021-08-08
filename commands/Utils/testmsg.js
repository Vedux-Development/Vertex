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
  const rule = new MessageEmbed()
    .setTitle("Vedux Rules")
    .setColor(config.Maincolor)
    .setDescription(
      `**No spam**\nSending any amount of messages quickly this includes, pinging, chanting, etc is strictly prohibited from this server!\n**Punishment:** Warn-Ban\n\n**No NSFW**\nSending any type of content that includes any type of nudity or profanity is strictly against our rules!\n**Punishment:** Ban\n\n**No Discord TOS viloations**\nThis includes being under 13 and self botting\n**Punishment:** Ban\n\n**No Harassment**\nPlease refrain from any type of harassment that may include any of our members\n**Punishment:** Ban\n\n**No Action Evasion**\nPlease do not evade any of our bans, warns, mutes, etc as this will get you perm black listed from any of our software\n**Punishment:** Blacklist\n\n**No Viruses and IP loggers**\nSending any type of IP pullers or viruses will result in an instant ban\n**Punishment:** Ban `
    )
    .setTimestamp()
    .setFooter('To verify please type "verify" ');
  message.channel.send({ embeds: [rule] });
};

module.exports.data = {
  name: "rule",
  aliases: [""],
};
