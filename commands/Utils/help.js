const { MessageEmbed, Permissions } = require("discord.js");
const emojis = require("../../emoji.json");
const config = require("../../config.json");
const GuildSettings = require("../../models/settings");

module.exports.run = async (client, message, args) => {
  let data = await GuildSettings.findOne({
    gid: message.guild.id,
  });
  let allCmds = [];
  let Join_events = [];
  let Basic_utilities = [];
  let Verification_system = [];
  let Moderation = [];

  const cmdSearch = args[0];
  const embed = new MessageEmbed();
  if (!cmdSearch) {
    embed.setTitle("Help");
    embed.setColor(config.Maincolor);
    embed.setDescription(
      `${data.prefix}help {command_name} to get information about a command.`
    );
    embed.addFields(
      {
        name: "Basic Utilities",
        value: "`prefix`, `setlog`, `modules`",
      },
      {
        name: "Moderation",
        value: "`ban`, `warn`, `kick`, `invite`",
      },
      {
        name: "Join Event Stuff",
        value: "`setwelcomerole`, `setwelcome`",
      },
      {
        name: "Verify Options",
        value: "`messageverify`",
      }
    );
    embed.setFooter(config.Footer);
    message.channel.send({ embeds: [embed] });
    return;
  }
  const commands = client.commands.get(cmdSearch);
  if (commands) {
    let yesAliases;
    if (commands.data.aliases >= 1) {
      yesAliases = commands.data.aliases.join(", ");
    } else {
      yesAliases = "None";
    }
    embed.setTitle(`${cmdSearch[0].toUpperCase() + cmdSearch.substring(1)}`);
    embed.setColor(config.Maincolor);
    embed.setFooter(config.Footer);
    embed.setDescription(`${data.prefix}${commands.data.params}`);
    embed.addFields(
      {
        name: "Description",
        value: `${commands.data.description}`,
      },
      {
        name: "Aliases",
        value: await yesAliases,
      }
    );
    message.channel.send({ embeds: [embed] });
    return;
  } else {
    embed.setTitle(`"${cmdSearch}" does not exist`);
    embed.setColor(config.Errorcolor);
    embed.setDescription("Sorry, I could not find your command.");
    embed.setFooter(config.Footer);
    message.channel.send({ embeds: [embed] });
    return;
  }
};
module.exports.data = {
  name: "help",
  aliases: [""],
  description: "Well you can get help u know?.",
  params: "help ?commandname",
  type: "Basic utilities",
};
