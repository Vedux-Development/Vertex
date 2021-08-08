const emojis = require("../../emoji.json");
const { MessageEmbed, Permissions } = require("discord.js");
const config = require("../../config.json");
const GuildSettings = require("../../models/settings");

module.exports.run = async (client, message, args) => {
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();

  if (!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS))
    return message.reply({
      content: "You need the `BAN_MEMBERS` perm to ban people!",
      allowedMentions: { repliedUser: false },
    });
  let targett = message.mentions.members.first();
  let target = targett.id;
  let Username = await client.users.fetch(target);

  const reason = args.slice(1).join(" ");
  if (!targett) {
    message.channel.send(
      `You must mention a user you wish to ban ${emojis.Warning}`
    );
  }
  if (!reason) {
    message.channel.send(
      `For secruity reasons you must add a reason ${emojis.Error1}`
    );
    return;
  } else {
    if (target === message.author.id) {
      message.channel.send(`You cant ban yourself ${emojis.Error1}`);
      return;
    }
    if (!targett.bannable)
      return message.reply({
        content:
          "You can't ban this user because the bot has not sufficient permissions!!",
        allowedMentions: { repliedUser: false },
      });

    async function banUser() {
      const banMessage = new MessageEmbed()
        .setTitle("Banned")
        .setColor(config.Errorcolor)
        .addField("**Server**", message.guild.name)
        .addField("**Reason**", reason)
        .setFooter(config.Footer);
      client.users.cache.get(target).send({ embeds: [banMessage] });

      const banTrue = new MessageEmbed()
        .setTitle("Success")
        .setColor(config.Maincolor)
        .setDescription(`${Username.username} has been banned!`)
        .setFooter(config.Footer);
      message.channel.send({ embeds: [banTrue] });

      targett.ban({ reason: reason });
    }
    GuildSettings.findOne({ gid: message.guild.id }, (err, data) => {
      if (data) {
        if (data.logchannel) {
          let channel = data.logchannel;
          const logMessage = new MessageEmbed()
            .setTitle("Ban")
            .setColor(config.Maincolor)
            .addField("**Username**", Username.tag)
            .addField("**Reason**", reason)
            .addField("**Day**", `${month}/${day}/${year}`)
            .setFooter(`User ID: ${target}`);
          client.channels.cache.get(channel).send({ embeds: [logMessage] });
        }
      }
    });
    banUser();
  }
};

module.exports.data = {
  name: "ban",
  aliases: ["elim", "test"],
  description: "A command that allows you to ban a users.",
  params: "ban @user reason",
  type: "Moderation",
};
