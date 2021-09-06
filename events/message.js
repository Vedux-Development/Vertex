const GuildSettings = require("../models/settings");
const { client, config } = require("../index");

client.on("messageCreate", async (message) => {
  if (message.channel.type === "dm") return; // Checks if the command is run in a dm and if it is it returns nothing.
  if (message.author.bot) return; // Ignores the message if a bot sent it

  let data = await GuildSettings.findOne({
    gid: message.guild.id,
  });

  const Createguild = new GuildSettings({
    gid: message.guild.id,
    prefix: config.prefix,
  });

  /* If it cant find any guild data it will create it. */
  if (!data) {
    await Createguild.save();
  }
  let prefix = await data.prefix;
  if (!message.content.startsWith(prefix)) return; // Checks if the author is a bot return nothing and if the the command has the prefix in it.
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  let commandfile = client.commands.get(cmd.slice(prefix.length));
  if (!commandfile) commandfile = client.aliases.get(cmd.slice(prefix.length));
  if (commandfile) commandfile.run(client, message, args);
});
