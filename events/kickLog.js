const GuildSettings = require("../models/settings");
const discord = require("discord.js");
const { client, config } = require("../index");

client.on("guildMemberRemove", async (member) => {
  let data = await GuildSettings.findOne({
    gid: member.guild.id,
  });

  if (!data) return;
  if (!data.logchannel) return;

  const fetchedLogs = await member.guild.fetchAuditLogs({
    limit: 1,
    type: "MEMBER_KICK",
  });
  //Do you have audio call extension
  const kickLog = fetchedLogs.entries.first();
  let kickReason = fetchedLogs.entries.first().reason;
  if (kickReason === null) kickReason = "No reason";

  const { executor, target } = kickLog;
  if (executor.id === config.id) return;
  if (!kickLog) {
    const yes = new discord.MessageEmbed()
      .setTitle("Moderation Log")
      .setColor(config.Maincolor)
      .setDescription(
        `${member.user.tag} has been kicked but I couldnt find by who.`
      );
    member.client.channel.get(data.logchannel).send({ embeds: [yes] });
  }
  // fucking finally, my vscode crashed a couple times.
  //yes but give me a min to grab my headset, its up
  // You have 15 seconds 1 2 3 4 5 6 7 8 9 10 11 12 13 14 14.1 14.2 14.4 15 16 17 18 19 10 1-0 1- 1716181 181
  if (target.id === member.user.id) {
    const yes = new discord.MessageEmbed()
      .setColor(config.Maincolor)
      .setTimestamp()
      .setFooter(`Victim's id: ${member.user.id}`)
      .addFields(
        {
          name: "**Moderation Type**",
          value: "Kick",
        },
        {
          name: "**Victim**",
          value: member.user.username,
        },
        {
          name: "**Punisher**",
          value: executor.username,
        },
        {
          name: "**Reason**",
          value: kickReason,
        }
      ); //look at chat rq.
    member.client.channels.cache.get(data.logchannel).send({ embeds: [yes] });
  } else {
    const yes = new discord.MessageEmbed()
      .setColor(config.Maincolor)
      .setTimestamp()
      .setFooter(`Victim's id: ${member.user.id}`)
      .addFields(
        {
          name: "**Moderation Type**",
          value: "Kick",
        },
        {
          name: "**Victim**",
          value: member.user.username,
        },
        {
          name: "**Punisher**",
          value: "*Unknown*",
        },
        {
          name: "**Reason**",
          value: kickReason,
        }
      );
    member.client.channels.cache.get(data.logchannel).send({ embeds: [yes] });
  }
});
