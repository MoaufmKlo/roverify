// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
const roverify = require("roverify");

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGES.GUILD _MESSAGES] });

// When the client is ready, run this code (only once)
client.once("ready", () => {
	console.log("Ready");
});

client.on("messageCreate", msg => {
  if(msg.content == "verify") {
    var userId = msg.user.id
    roverify.verify(userId)    
      .then((robloxUser) => {
          msg.setNickname(robloxUser.name)
          msg.editReply(`Successfully Verified, **${robloxUser.name}!**`)
          // Assuming you're bot has permissions.
      })
      .catch((err) => {
          if (err === "Discord user id (argument 0) is not verified") {
              msg.editReply(`Hey! You're not verified. Try verifying through rover here!\n\nhttp://rover.link/verify`)
          } else {
              throw err;
          }
      });
  }
})

// Login to Discord with your client's token
client.login(token);
