const emojis = require("../../emoji.json");
const { MessageEmbed, Permissions } = require("discord.js");
const config = require("../../config.json");
const spamSettings = require("../../models/verifyMsgSchema");

module.exports.run = async (client, message, args) => {
  if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD))
    return message.reply({
      content: "You must have the `MANAGE_GUILD` perm to use this command!",
      allowedMentions: { repliedUser: false },
    });
  let data = await spamSettings.findOne({
    gid: message.guild.id,
  });

  if (args[0] === "disable") {
    if (!data) {
      const newVerify = new MessageEmbed()
        .setTitle("Message verify method")
        .setColor(config.Errorcolor)
        .setDescription(
          `Message verification is already disabled on this server!`
        )
        .setFooter(config.Footer);
      message.channel.send({ embeds: [newVerify] });
      return;
    }
    if (data) {
      data.remove();
      const newVerify = new MessageEmbed()
        .setTitle("Message verify method")
        .setColor(config.Errorcolor)
        .setDescription(`Message verification is now disabled on this server!`)
        .setFooter(config.Footer);
      message.channel.send({ embeds: [newVerify] });
      return;
    }
  }

  const channel = message.mentions.channels.first();
  let role = message.mentions.roles.first();

  if (!channel) {
    message.channel.send(
      "Please mention a channel where you would like your verification system set too"
    );
    return;
  }
  if (!role) {
    message.channel.send(
      "Please mention a role you would like the bot to give when someone verfies"
    );
    return;
  }

  if (data) {
    if (data.verifyChannel === channel.id && data.verifyRole === role.id) {
      message.channel.send(
        "You already have both your channel and verify role set to those"
      );
      return;
    }
    data.verifyChannel = channel.id;
    data.verifyRole = role.id;
    data.save();
    const newVerify = new MessageEmbed()
      .setTitle("Message verify method")
      .setColor(config.Maincolor)
      .setDescription(`**${channel.name}** is now your verification channel!`)
      .setFooter(config.Footer);
    message.channel.send({ embeds: [newVerify] });
    client.channels.cache
      .get(channel.id)
      .send(
        `Any messages that are sent in this channel will get deleted!\nIf the message is \`verify\` the user will gain the ${role.name} role.\nIf you are a admin please delete this message`
      );
    return;
  } else if (!data) {
    let newData = new spamSettings({
      gid: message.guild.id,
      verifyChannel: channel.id,
      verifyRole: role.id,
    });
    newData.save();
    const newVerify = new MessageEmbed()
      .setTitle("Message verify method")
      .setColor(config.Maincolor)
      .setDescription(`**${channel.name}** is now your verification channel!`)
      .setFooter(config.Footer);
    message.channel.send({ embeds: [newVerify] });
    client.channels.cache
      .get(channel.id)
      .send(
        `Any messages that are sent in this channel will get deleted!\nIf the message is \`verify\` the user will gain the ${role.name} role.\nIf you are a admin please delete this message`
      );
    return;
  }
};

module.exports.data = {
  name: "messageverify",
  aliases: [],
  description:
    'Allows you to have a channel where people can type "verify" and it will delete the message and give them a role.',
  params: "messageverify #channel (rolename)",
  type: "Verification system",
};
