const emojis = require("../../emoji.json");
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
} = require("discord.js");
const config = require("../../config.json");
const GuildSettings = require("../../models/settings");
const punishments = require("../../models/ModSchema");

module.exports.run = async (client, message, args) => {
  let user = message.mentions.members.first();
  if (!user)
    return message.channel.send(
      "Please mention the user that you want to fetch"
    );

  let data = await punishments.findOne({
    gid: message.guild.id,
    uid: user.id,
  });
  if (!data) return console.error("Error");
  let numberOfInfractions = data.Punishments.length;
  pageNum = 1;

  const components = (btn1, btn2) => [
    new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("<-")
        .setStyle("SUCCESS")
        .setLabel("<-")
        .setDisabled(btn1),
      new MessageButton()
        .setCustomId("->")
        .setStyle("DANGER")
        .setLabel("->")
        .setDisabled(btn2)
    ),
  ];
  const embed = new MessageEmbed()
    .setAuthor(
      `${user.user.username}'s infractions`,
      user.user.displayAvatarURL()
    )
    .setColor(config.Maincolor)
    .setDescription(
      `Punishment Type: ${
        data.Punishments[pageNum - 1].PunishType
      }\n----------\n${
        data.Punishments[pageNum - 1].Reason
      }\n----------\nDate: ${data.Punishments[pageNum - 1].Date}`
    )
    .setFooter(`Page: ${pageNum}/${numberOfInfractions}`);
  let btn1;
  let btn2;

  let initmessage = await message.channel.send({
    embeds: [embed],
    components: components(false, false),
  });

  const filter = (interaction) => {
    if (interaction.user.id === message.author.id) return true;
    return interaction.reply({
      content:
        "You must be the author of this interaction to use this interaction",
      ephemeral: true,
    });
  };

  let collector = message.channel.createMessageComponentCollector({
    filter,
    time: 30000,
  });

  collector.on("collect", async (i) => {
    let answer = i.customId;

    if (answer === "->") {
      i.deferUpdate();
      if (pageNum < numberOfInfractions) {
        pageNum++;
        embed.setDescription(
          `Punishment Type: ${
            data.Punishments[pageNum - 1].PunishType
          }\n----------\n${
            data.Punishments[pageNum - 1].Reason
          }\n----------\nDate: ${data.Punishments[pageNum - 1].Date}`
        );
        embed.setFooter(`Page: ${pageNum}/${numberOfInfractions}`);
        await initmessage.edit({ embeds: [embed] });
      }
    }
    if (answer === "<-") {
      i.deferUpdate();
      if (pageNum <= numberOfInfractions) {
        pageNum--;
        if (pageNum - 1 < 0) {
          return true;
        }
        embed.setDescription(
          `Punishment Type: ${
            data.Punishments[pageNum - 1].PunishType
          }\n----------\n${
            data.Punishments[pageNum - 1].Reason
          }\n----------\nDate: ${data.Punishments[pageNum - 1].Date}`
        );
        embed.setFooter(`Page: ${pageNum}/${numberOfInfractions}`);
        await initmessage.edit({ embeds: [embed] });
      }
    }
  });

  collector.on("end", async (i) => {
    initmessage.edit({ components: components(true, true) });
  });
  // let Embed = new MessageEmbed().setTitle(`${user.username}`);
  // let max = data.Punishments.length;
  // for (let i = 0; i < max; i++) {
  //   Embed.addField(
  //     `${data.Punishments[i].PunishType}`,
  //     `${data.Punishments[i].Reason}`,
  //     true
  //   );
  // }
  // message.channel.send({ embeds: [Embed] });
};

module.exports.data = {
  name: "infractions",
  aliases: ["punishments"],
  description:
    "Get a list of punisgments said user has recieved in this server!",
  params: "infractions @user",
  type: "Moderation",
};
