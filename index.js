/* //////////////////////////////////////////////////////////////////////////////// */
/*                                                                                  */
/*                                Vedux Development                                 */
/*                       Maintained by, Ducksquaddd and bqini                       */
/*                                                                                  */
/* //////////////////////////////////////////////////////////////////////////////// */

/* Requiring packages */
const Discord = require("discord.js"); // Discord.js Yes
const mongoose = require("mongoose"); // Mongoose to manage our mongodb
const fs = require("fs-extra"); // Fs Mainly for our command handler

/* Requiring files */
const config = require("./config"); // Getting things like our token and prefix

/* Getting our mongoose/mongodb schemas */
// Not used but might use it sometime
const GuildSettings = require("./models/settings");
const Spamsettings = require("./models/spamSchema");

/* Initilizing our discord.js client / Creating our discord.js instance */
const intents = new Discord.Intents(32767);
const client = new Discord.Client({ intents });

/* Connecting to our DB */
mongoose.connect(config.mongodbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/* Creating our discord.js collections */
client.commands = new Discord.Collection(); // For command names such as invite, ban, unban
client.aliases = new Discord.Collection(); // For aliases names such as inv, b, unb

/* Command folders */
let commandFolders = [
  "Moderation",
  "Veconomy",
  "Utils",
  "joinstuff",
  "verifystuff",
]; // This bot uses mutiple folders to orginize our commands and this is how we tell the code what folders to look for commands in.

/* Ill fix this shit later */

// async function dir(path) {
//   const dir = await fs.promises.opendir(path)
//   for await (const dirent of dir) {
//     commandFolders.push(dirent.name)
//     console.log(commandFolders)
//   }
// }

// dir('./commands').catch(console.error)

/* This blob of code here uses the variable above to load all the commands from those folders and put them in the discord.js collection. */
commandFolders.forEach((m) => {
  fs.readdir(`./commands/${m}`, (err, files) => {
    if (err) throw err;

    let js = files.filter((f) => f.split(".").pop() === "js");

    js.forEach((f) => {
      let g = require(`./commands/${m}/${f}`);
      client.commands.set(g.data.name, g);
      g.data.aliases.forEach((a) => {
        client.aliases.set(a, g);
      });
    });
  });
});

/* This thing makes it so we can have events in seperate files and keep are index.js kindof clean */
fs.readdir(`./events/`, (err, files) => {
  if (err) throw err;
  let jsfiles = files.filter((f) => f.split(".").pop() === "js");

  if (jsfiles.length <= 0) return console.log("There are no events to load");
  console.log(`Loading ${jsfiles.length} events`);

  jsfiles.forEach((f, i) => {
    require(`./events/${f}`);
  });
});

/* Exporting our client so we dont have to create a new client */
module.exports = {
  client: client,
  config: config,
};

client.login(config.token); // Login to the bot
