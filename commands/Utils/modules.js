const emojis = require("../../emoji.json");
const { MessageEmbed, Permissions } = require("discord.js");
const config = require("../../config.json");
const GuildSettings = require("../../models/settings");
const SpamSchema = require("../../models/spamSchema");

module.exports.run = async (client, message, args) => {
  if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD))
    return message.reply({
      content: "You must have the `MANAGE_GUILD` perm to use this command!",
      allowedMentions: { repliedUser: false },
    });
  let module = args[0];
  let act = args[1];

  if (!module)
    return message.channel.send(
      "Please add what type of module you would like to enable/disable\n`spam-protection`"
    );
  if (!act)
    return message.channel.send(
      "Would you like to enable/disable/edit this module"
    );
  module = module.toLowerCase();
  act = act.toLowerCase();

  /* Spam protection */
  if (module === "spam-protection") {
    const limit = 5;
    const time = 5000;
    const reset = 2500;
    let data = await SpamSchema.findOne({
      gid: message.guild.id,
    });
    let prefix = await GuildSettings.findOne({
      gid: message.guild.id,
    });
    if (act === "enable") {
      if (data) {
        if (data.enabled === true)
          return message.channel.send(
            "Your bot is already protected by Vertex's spam protection module"
          );
        data.enabled = true;
        data.save();
        const successSpam = new MessageEmbed()
          .setTitle("Spam")
          .setColor(config.Maincolor)
          .setDescription(
            `Your server is now protected by Vertex's spam module!\nYou change the configs on this module by running ${prefix.prefix}module spam-protection edit`
          )
          .setFooter(config.Footer);
        message.channel.send({ embeds: [successSpam] });
      } else if (!data) {
        let newData = new SpamSchema({
          gid: message.guild.id,
          enabled: true,
          msgLimit: limit,
          timeLimit: time,
          resetTime: reset,
        });
        newData.save();

        const successSpam = new MessageEmbed()
          .setTitle("Spam")
          .setColor(config.Maincolor)
          .setDescription(
            `Your server is now protected by Vertex's spam module!\nYou change the configs on this module by running ${prefix.prefix}module spam-protection edit`
          )
          .setFooter(config.Footer);
        message.channel.send({ embeds: [successSpam] });
      }
    } else if (act === "disable") {
      if (data) {
        if (data.enabled === false)
          return message.channel.send(
            "Your bot already has Vertex's spam module disabled"
          );
        data.enabled = false;
        data.save();
        const successSpam = new MessageEmbed()
          .setTitle("Spam")
          .setColor(config.Maincolor)
          .setDescription(
            `Your server is now unprotected by Vertex's spam protection module`
          )
          .setFooter(config.Footer);
        message.channel.send({ embeds: [successSpam] });
      } else if (!data) {
        let newData = new SpamSchema({
          gid: message.guild.id,
          enabled: false,
        });
        newData.save();

        const successSpam = new MessageEmbed()
          .setTitle("Spam")
          .setColor(config.Maincolor)
          .setDescription(
            `Your server is now unprotected by Vertex's spam protection module`
          )
          .setFooter(config.Footer);
        message.channel.send({ embeds: [successSpam] });
      }
    } else if (act === "edit") {
      message.channel.send(
        "This feature is still in the works and will most likely be premium!\nBasic configs\n`Max messages: 5`\n`Timer: 5 Seconds`\n`Reset timer: 2.5 Seconds`"
      );

      return;
    } else
      return message.channel.send(
        "Would you like to enable or disable the spam module"
      );
  }
};

module.exports.data = {
  name: "module",
  aliases: [""],
  description:
    "This allows you to manage the modules that you can use on this server.",
  params: "module (modulename) enable/disable/edit",
  type: "Basic utilities",
};
