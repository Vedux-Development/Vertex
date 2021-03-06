const GuildSettings = require("../models/settings");
const { client, config } = require("../index");
const { MessageEmbed } = require("discord.js");
const spamSettings = require("../models/verifyMsgSchema");

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  let r = message.member;

  let data = await spamSettings.findOne({
    gid: message.guild.id,
  });
  if (!data) return;
  if (data) {
    if (data.verifyChannel) {
      if (message.channel.id === data.verifyChannel) {
        message.delete();
        if (message.content === "verify" || "Verify") {
          const embed = new MessageEmbed()
            .setTitle(message.guild.name)
            .setDescription("You have been verified!")
            .setColor(config.Maincolor);

          message.author.send({ embeds: [embed] });
          let role = message.guild.roles.cache.get(data.verifyRole);
          r.roles.add(role);
        }
      }
    }
  }
});
