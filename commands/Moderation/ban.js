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
  if (!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS))
    return message.reply({
      content:
        "You must have the `BAN_MEMBERS` permission to use this command!",
      allowedMentions: { repliedUser: false },
    });
  let mem = await message.mentions.members.first();
  let data = await GuildSettings.findOne({
    gid: message.guild.id,
  });
  if (!mem)
    return message.channel.send(
      "Please mention the person you would like to banish."
    );
  let reason = args.slice(1).join(" ");
  if (!reason)
    return message.channel.send(
      "Please provide a reason on why you would like to banish this person."
    );
  let Username = await client.users.fetch(mem.id);
  if (message.author.id === mem.id)
    return message.channel.send("Why would you want to ban yourself?");
  if (!mem.bannable)
    return message.channel.send(
      "I do not have the permissions to ban this user."
    );
  const banembed = new MessageEmbed()
    .setTitle("Banned")
    .setColor(config.Maincolor)
    .addFields(
      {
        name: "**Server**",
        value: `${message.guild.name}`,
      },
      {
        name: "**Reason**",
        value: `${reason}`,
      },
      {
        name: "**Moderator**",
        value: `${message.author.username}`,
      }
    );
  await client.users.cache.get(mem.id).send({ embeds: [banembed] });
  yer();
  let msg = new MessageEmbed()
    .setTitle("Success")
    .setColor(config.Maincolor)
    .setDescription(`${Username.username} has been banned!`)
    .setFooter(config.Footer);
  message.channel.send({ embeds: [msg] });
  await mem.ban({ reason: reason });

  async function yer() {
    if (data) {
      if (data.logchannel) {
        const yes = new MessageEmbed()
          .setColor(config.Maincolor)
          .setTimestamp()
          .setFooter(`Victim's id: ${mem.id}`)
          .addFields(
            {
              name: "**Moderation Type**",
              value: "Ban",
            },
            {
              name: "**Victim**",
              value: Username.username,
            },
            {
              name: "**Punisher**",
              value: message.author.username,
            },
            {
              name: "**Reason**",
              value: reason,
            }
          );
        client.channels.cache.get(data.logchannel).send({ embeds: [yes] });
      }
    }
  }
};

module.exports.data = {
  name: "ban",
  aliases: [""],
  description: "Bannish a user at an instant!",
  params: "ban @user reason",
  type: "Moderation",
};
