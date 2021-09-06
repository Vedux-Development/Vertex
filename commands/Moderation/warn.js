const emojis = require("../../emoji.json");
const { MessageEmbed, Permissions } = require("discord.js");
const config = require("../../config.json");
const GuildSettings = require("../../models/settings");
const punishments = require("../../models/ModSchema");

module.exports.run = async (client, message, args) => {
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();

  if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))
    return message.reply({
      content: "You must have the `MANAGE_MESSAGES` perm to use this command!",
      allowedMentions: { repliedUser: false },
    });
  let targett = message.mentions.members.first();

  const reason = args.slice(1).join(" ");

  if (!targett)
    return message.channel.send("You must mention someone to warn!");

  if (!reason)
    return message.channel.send(
      "You must mention why you would like to warn this user!"
    );

  let target = targett.id;
  if (target === message.author.if)
    return message.channel.send("Why would you try to warn yourself?");
  let Username = await client.users.fetch(target);

  let data = await punishments.findOne({
    gid: message.guild.id,
    uid: target,
  });

  let data2 = await GuildSettings.findOne({
    gid: message.guild.id,
  });

  if (data) {
    data.Punishments.unshift({
      PunishType: "Warn",
      Moderator: message.author.id,
      Reason: reason,
      Date: `${month}/${day}/${year}`,
    });
    data.save();
    var successwarn = new MessageEmbed()
      .setTitle("Warn")
      .setColor(config.Maincolor)
      .setDescription(`Warned ${Username.tag}!`)
      .setFooter(config.Footer);
    message.channel.send({ embeds: [successwarn] });
    var sendtarget = new MessageEmbed()
      .setTitle("Warning")
      .setColor(config.Errorcolor)
      .addField(`**Reason**`, reason)
      .addField(`**Moderator**`, message.author.username)
      .addField(`**Date**`, `${month}/${day}/${year}`)
      .setFooter(config.Footer);
    client.users.cache.get(target).send({ embeds: [sendtarget] });
  } else if (!data) {
    let newData = new punishments({
      gid: message.guild.id,
      uid: target,
      Punishments: [
        {
          PunishType: "Warn",
          Moderator: message.author.id,
          Reason: reason,
          Date: `${month}/${day}/${year}`,
        },
      ],
    });
    newData.save();

    var successwarn = new MessageEmbed()
      .setTitle("Warn")
      .setColor(config.Maincolor)
      .setDescription(`Warned ${Username.username}!`)
      .setFooter(config.Footer);
    message.channel.send({ embeds: [successwarn] });

    var sendtarget = new MessageEmbed()
      .setTitle("Warning")
      .setColor(config.Errorcolor)
      .addField(`**Reason**`, reason)
      .addField(`**Moderator**`, message.author.username)
      .addField(`**Date**`, `${month}/${day}/${year}`)
      .setFooter(config.Footer);
    client.users.cache.get(target).send({ embeds: [sendtarget] });
  }

  if (data2) {
    if (data2.logchannel) {
      var sendlog = new MessageEmbed()
        .setColor(config.Errorcolor)
        .addField("**Moderation Type**", "Warning")
        .addField(`**User**`, Username.username)
        .addField(`**Reason**`, reason)
        .addField(`**Moderator**`, message.author.username)
        .setTimestamp();
      client.channels.cache.get(data2.logchannel).send({ embeds: [sendlog] });
    }
  }
};

module.exports.data = {
  name: "warn",
  aliases: [""],
  description:
    "Using this command you can punish users without banning or kicking them!",
  params: "warn @user reason",
  type: "Moderation",
};
