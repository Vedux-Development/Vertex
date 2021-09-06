const emojis = require("../../emoji.json");
const { MessageEmbed, Permissions } = require("discord.js");
const config = require("../../config.json");
const GuildSettings = require("../../models/settings");

module.exports.run = async (client, message, args) => {
  if (!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS))
    return message.reply({
      content: "You must have the `MANAGE_GUILD` perm to use this command!",
      allowedMentions: { repliedUser: false },
    });
  let addingRole = message.mentions.roles.first();

  if (!addingRole) {
    return message.channel.send(
      "Please mention a role you wish to add to users when they join!"
    );
  } else if (addingRole) {
    GuildSettings.findOne({ gid: message.channel.guild.id }, (err, data) => {
      if (data) {
        data.onjoinrole = addingRole.id;
        data.save();
        const newLog = new MessageEmbed()
          .setTitle("On join role")
          .setColor(config.Maincolor)
          .setDescription(
            `**${addingRole}** is now the role that users will recieve when they join this server!`
          )
          .setFooter(config.Footer);
        message.channel.send({ embeds: [newLog] });
        return;
      }
    });
  }
};

module.exports.data = {
  name: "setwelcomerole",
  aliases: ["joinrole"],
  description: "This will give users a role when they join your server.",
  params: "joinrole @role",
  type: "Join events",
};
