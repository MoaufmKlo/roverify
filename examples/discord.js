const roverify = require("roverify");

const discord = require("discord.js").Client;
const client = new Client({
    "intents": [
        "GUILDS",
        "GUILDS_MESSAGES"
    ]
});

client.once("ready", () => {
	console.log(`Connection to Discord established as ${client.user.tag}.`);
});

client.on("messageCreate", msg => {
    if (msg.content !== "!verify") return;
    
    roverify.verify(msg.author.id)    
        .then((robloxUser) => {
            msg.setNickname(robloxUser.name);
            msg.reply(`Verified as ${robloxUser.name}`);
        })
        .catch((err) => {
            if (err === "Discord user id (argument 0) is not verified") {
                msg.reply("You're not verified yet. Go to <https://blox.link/verify> to verify.")
            } else {
                throw err;
            }
        });
});

client.login();
