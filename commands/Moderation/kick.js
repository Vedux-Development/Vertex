const emojis = require("../../emoji.json");
const { MessageEmbed, Permissions } = require("discord.js");
const config = require("../../config.json");
const GuildSettings = require("../../models/settings");

module.exports.run = async (client, message, args) => {
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();

  if (!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS))
    return message.reply({
      content: "You need the `KICK_MEMBERS` perm to kick people!",
      allowedMentions: { repliedUser: false },
    });
  let targett = message.mentions.members.first();

  if (!targett) {
    message.channel.send(
      `You must mention a user you wish to kick ${emojis.Warning}`
    );
  }
  let target = targett.id;
  let Username = await client.users.fetch(target);
  if (target === message.author.id) {
    message.channel.send(`You cant kick yourself ${emojis.Error1}`);
    return;
  }

  if (!targett.kickable)
    return message.reply({
      content:
        "You can't kick this user because the bot has not sufficient permissions!!",
      allowedMentions: { repliedUser: false },
    });

  async function kickUser() {
    const kickMessage = new MessageEmbed()
      .setTitle("kicked")
      .setColor(config.Errorcolor)
      .addField("**Server**", message.guild.name)
      .setFooter(config.Footer);
    client.users.cache.get(target).send({ embeds: [kickMessage] });

    const kickTrue = new MessageEmbed()
      .setTitle("Success")
      .setColor(config.Maincolor)
      .setDescription(`${Username.username} has been kicked!`)
      .setFooter(config.Footer);
    message.channel.send({ embeds: [kickTrue] });

    targett.kick();
  }
  GuildSettings.findOne({ gid: message.guild.id }, (err, data) => {
    if (data) {
      if (data.logchannel) {
        let channel = data.logchannel;
        const logMessage = new MessageEmbed()
          .setTitle("kick")
          .setColor(config.Maincolor)
          .addField("**Username**", Username.tag)
          .addField("**Data**", `${month}/${day}/${year}`)
          .setFooter(`User ID: ${target}`);
        client.channels.cache.get(channel).send({ embeds: [logMessage] });
      }
    }
  });
  kickUser();
};

module.exports.data = {
  name: "kick",
  aliases: ["elim", "test"],
  description: "A command that allows you to kick a users.",
  params: "kick @user reason",
  type: "Moderation",
};
