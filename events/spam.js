const GuildSettings = require("../models/settings");
const Spamsettings = require("../models/spamSchema");
const { client, config } = require("../index");

/* Vertex's spam filter V1 is (mostley) made by Anson the Developer */
/* https://youtu.be/xzMiszeTEiI */

const usersMap = new Map();

client.on("messageCreate", async (message) => {
  let data = await Spamsettings.findOne({
    gid: message.guild.id,
  });
  if (!data) return;
  if (data.enabled == false) return;

  if (usersMap.has(message.author.id)) {
    const userData = usersMap.get(message.author.id);
    const { lastMessage, timer } = userData;
    const diffrence = message.createdTimestamp - lastMessage.createdTimestamp;
    let msgCount = userData.msgCount;
    if (diffrence > data.resetTime) {
      clearTimeout(timer);

      userData.msgCount = 0;
      userData.lastMessage = message;
      userData.timer = setTimeout(() => {
        usersMap.delete(message.author.id);
      }, data.timeLimit);
      usersMap.set(message.author.id, userData);
    } else {
      ++msgCount;
      if (parseInt(msgCount) === data.msgLimit) {
        {
          function perms(role) {
            message.guild.channels.cache.each((channel) => {
              channel.permissionOverwrites.create(role, {
                SEND_MESSAGES: false,
              });
            });
          }
          let role = message.guild.roles.cache.find((r) => r.name === "Muted");
          if (!role) {
            role = await message.guild.roles.create({
              name: "Muted",
              reason: "Created role to mute users",
              position: 1,
            });
            perms(role.id);
            message.member.roles.add(role);
            message.reply({
              content: "You have been muted for spamming",
              allowedMentions: { repliedUser: false },
            });
          } else {
            perms(role);
            role.setPosition(1);
            message.member.roles.add(role);
            message.reply({
              content: "You have been muted for spamming",
              allowedMentions: { repliedUser: false },
            });
          }
          userData.msgCount = msgCount;
          usersMap.set(message.author.guild, userData);
        }
      } else {
        userData.msgCount = msgCount;
        usersMap.set(message.author.guild, userData);
      }
    }
  } else {
    let fn = setTimeout(() => {
      usersMap.delete(message.author.id);
    }, data.timeLimit);
    usersMap.set(message.author.id, {
      msgCount: 1,
      lastMessage: message,
      timer: fn,
    });
  }
});
