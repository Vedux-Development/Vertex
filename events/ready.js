const { version } = require("../package.json");
const { client } = require("../index");

client.on("ready", async () => {
  console.log("Bot online");
  setInterval(() => {
    const statuses = [
      `Version: ${version}`,
      `${client.guilds.cache.size} servers`,
    ];

    const status = statuses[Math.floor(Math.random() * statuses.length)];
    client.user.setActivity(status, { type: "WATCHING" });
  }, 5000);
});
