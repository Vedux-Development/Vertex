const GuildSettings = require("../models/settings");
const discord = require("discord.js");
const { client, config } = require("../index");

client.on("guildMemberAdd", async (client, member, message) => {
  if (!member) return;
  let guild = member.guild;
  let userid = member.id;
  GuildSettings.findOne(
    {
      gid: member.guild.id,
    },
    (err, data) => {
      if (data) {
        if (data.welcomechannel) {
          var Welcomemessage = new discord.MessageEmbed()
            .setTitle(`Welcome, ${member.user.username}`)
            .setFooter(`Members: ${member.guild.memberCount}`)
            .setColor(config.Maincolor)
            .setDescription(data.welcomechannelText);
          client.channels.cache.get(data.welcomechannel).send(Welcomemessage);
        }

        if (data.onjoinrole) {
          let role = guild.roles.cache.get(data.onjoinrole);
          member.roles.add(role);
        }
      }
    }
  );
});
