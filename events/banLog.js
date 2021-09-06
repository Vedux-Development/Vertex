const GuildSettings = require("../models/settings");
const discord = require("discord.js");
const { client, config } = require("../index");

client.on("guildBanAdd", async (ban, client, channels) => {
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();

  let data = await GuildSettings.findOne({
    gid: ban.guild.id,
  });

  if (!data) return;
  if (!data.logchannel) return;

  const fetchedLogs = await ban.guild.fetchAuditLogs({
    limit: 1,
    type: "MEMBER_BAN_ADD",
  });
  //Do you have audio call extension
  const banLog = fetchedLogs.entries.first();
  let banReason = fetchedLogs.entries.first().reason;
  console.log(banReason);
  if (banReason === null) banReason = "No reason";
  console.log("test");

  const { executor, target } = banLog;
  if (executor.id === config.id) return;
  if (!banLog) {
    const yes = new discord.MessageEmbed()
      .setTitle("Moderation Log")
      .setColor(config.Maincolor)
      .setDescription(
        `${ban.user.tag} has been banned but I couldnt find by who.`
      );
    ban.client.channel.get(data.logchannel).send({ embeds: [yes] });
  }
  // fucking finally, my vscode crashed a couple times.
  //yes but give me a min to grab my headset, its up
  // You have 15 seconds 1 2 3 4 5 6 7 8 9 10 11 12 13 14 14.1 14.2 14.4 15 16 17 18 19 10 1-0 1- 1716181 181
  if (target.id === ban.user.id) {
    const yes = new discord.MessageEmbed()
      .setColor(config.Maincolor)
      .setTimestamp()
      .setFooter(`Victim's id: ${ban.user.id}`)
      .addFields(
        {
          name: "**Moderation Type**",
          value: "Ban",
        },
        {
          name: "**Victim**",
          value: ban.user.username,
        },
        {
          name: "**Punisher**",
          value: executor.username,
        },
        {
          name: "**Reason**",
          value: banReason,
        }
      ); //look at chat rq.
    ban.client.channels.cache.get(data.logchannel).send({ embeds: [yes] });
  } else {
    const yes = new discord.MessageEmbed()
      .setColor(config.Maincolor)
      .setTimestamp()
      .setFooter(`Victim's id: ${ban.user.id}`)
      .addFields(
        {
          name: "**Moderation Type**",
          value: "Ban",
        },
        {
          name: "**Victim**",
          value: ban.user.username,
        },
        {
          name: "**Punisher**",
          value: "*Unknown*",
        },
        {
          name: "**Reason**",
          value: banReason,
        }
      );
    ban.client.channels.cache.get(data.logchannel).send({ embeds: [yes] });
  }
});
