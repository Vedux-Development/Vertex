const emojis = require("../../emoji.json");
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
} = require("discord.js");
const config = require("../../config.json");
const GuildSettings = require("../../models/settings");
const SpamSchema = require("../../models/spamSchema");

module.exports.run = async (client, message, args) => {
  const embed = new MessageEmbed()
    .setTitle("Modules")
    .setColor(config.Maincolor)
    .setFooter(config.Footer2)
    .setDescription("Please select the module you would like to manage.");
  const components = (state) => [
    new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("module-select")
        .setPlaceholder("Select your module here...")
        .setDisabled(state)
        .addOptions({
          label: "✉️ Spam Protection",
          value: "Spam Protection",
          description: "Manage the spam protection module",
        })
    ),
  ];
  let initmessage = await message.channel.send({
    embeds: [embed],
    components: components(false),
  });

  const filter = (interaction) => {
    if (interaction.user.id === message.author.id) return true;
    return interaction.reply({
      content: "You must be the author of this interaction to use this command",
      ephemeral: true,
    });
  };

  let collector = message.channel.createMessageComponentCollector({
    filter,
    componentType: "SELECT_MENU",
    max: 1,
    time: 15000,
  });

  collector.on("collect", async (interaction) => {
    interaction.deferUpdate();
    let value = interaction.values[0];
    await initmessage.edit({ components: components(true) });
    if (value === "Spam Protection") {
      const components1 = (state) => [
        new MessageActionRow().addComponents(
          new MessageButton()
            .setCustomId("enable")
            .setStyle("SUCCESS")
            .setLabel("Enable")
            .setDisabled(state),
          new MessageButton()
            .setCustomId("disable")
            .setStyle("DANGER")
            .setLabel("Disable")
            .setDisabled(state)
        ),
      ];

      const Buttonembed = new MessageEmbed()
        .setTitle("Spam Protection")
        .setDescription(
          "Protect your server using Vertex's spam protection module"
        )
        .setFooter(config.Footer)
        .setColor(config.Maincolor);
      interaction.deferUpdate();
      await initmessage.edit({
        embeds: [Buttonembed],
        components: components1(false),
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
        max: 1,
        time: 15000,
      });

      collector.on("collect", async (ButtonInteraction) => {
        let name = ButtonInteraction.customId;
        await initmessage.edit({
          components: components1(true),
        });

        const limit = 5;
        const time = 5000;
        const reset = 2500;
        let data = await SpamSchema.findOne({
          gid: message.guild.id,
        });

        if (name === "enable") {
          if (data) {
            if (data.enabled === true)
              return ButtonInteraction.reply({
                content: `Your server already is protected by ${config.botname}'s spam protection module`,
              });
            data.enabled = true;
            data.save();
            const successSpam = new MessageEmbed()
              .setTitle("Spam")
              .setColor(config.Maincolor)
              .setDescription(
                `Your server is now protected by ${config.botname}'s spam module!\nFor the bot to acctully mute people please give it a high role`
              )
              .setFooter(config.Footer);
            ButtonInteraction.reply({ embeds: [successSpam] });
            return;
          } else if (!data) {
            let newData = new SpamSchema({
              gid: message.guild.id,
              enabled: true,
              msgLimit: limit,
              timeLimit: time,
              resetTime: reset,
            });
            newData.save();

            const successSpam = new MessageEmbed()
              .setTitle("Spam")
              .setColor(config.Maincolor)
              .setDescription(
                `Your server is now protected by ${config.botname}'s spam module!\nFor the bot to acctully mute people please give it a high role`
              )
              .setFooter(config.Footer);
            ButtonInteraction.reply({ embeds: [successSpam] });
            return;
          }
        } else if (name === "disable") {
          if (data) {
            if (data.enabled === false)
              return ButtonInteraction.reply({
                content: `Your bot already has ${config.botname}'s spam module disabled`,
              });
            data.enabled = false;
            data.save();
            const successSpam = new MessageEmbed()
              .setTitle("Spam")
              .setColor(config.Maincolor)
              .setDescription(
                `Your server is now unprotected by ${config.botname}'s spam protection module`
              )
              .setFooter(config.Footer);
            ButtonInteraction.reply({ embeds: [successSpam] });
            return;
          } else if (!data) {
            let newData = new SpamSchema({
              gid: message.guild.id,
              enabled: false,
            });
            newData.save();

            const successSpam = new MessageEmbed()
              .setTitle("Spam")
              .setColor(config.Maincolor)
              .setDescription(
                `Your server is now unprotected by ${config.botname}'s spam protection module`
              )
              .setFooter(config.Footer);
            ButtonInteraction.reply({ embeds: [successSpam] });
            return;
          }
        }
      });

      collector.on("end", async (i) => {
        await initmessage.edit({
          embeds: [Buttonembed],
          components: components1(true),
        });
        return;
      });

      collector.on("end", async () => {
        await initmessage.edit({
          embeds: [Buttonembed],
          components: components1(true),
        });
        return;
      });
    }
  });

  collector.on("end", async () => {
    await initmessage.edit({
      components: components(true),
    });
    return;
  });
};

module.exports.data = {
  name: "modules",
  aliases: [""],
  description: "Manage some optional functionalitys.",
  params: "modules",
  type: "Basic utilities",
};
