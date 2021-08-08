const GuildSettings = require("../models/settings");
const { client, config } = require("../index");

client.on("messageCreate", async (message) => {
  if (message.channel.type === "dm") return; // Checks if the command is run in a dm and if it is it returns nothing.
  if (message.author.bot) return;
  var prefix = config.prefix;
  const Createguild = new GuildSettings({
    gid: message.guild.id,
    prefix: config.prefix,
  });

  /* Checks if the guild where the message has been sent doesnt have a gid in the databse */
  GuildSettings.findOne({ gid: message.guild.id }, (err, data) => {
    if (!data) {
      Createguild.save();
    }
  });

  /* Checks if the database has a prefix already set*/
  GuildSettings.findOne({ gid: message.guild.id }, (err, data) => {
    if (err) throw err;
    if (data) {
      if (data.prefix) {
        prefix = data.prefix;
        testing();
      }
    }
  });

  async function testing() {
    if (!message.content.startsWith(prefix)) return; // Checks if the author is a bot return nothing and if the the command has the prefix in it.
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    let commandfile = client.commands.get(cmd.slice(prefix.length));
    if (!commandfile)
      commandfile = client.aliases.get(cmd.slice(prefix.length));
    if (commandfile) commandfile.run(client, message, args);
  }
});
