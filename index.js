const https = require("https");

/**
 * Fetch Roblox user data from a Roblox user id.
 * @param {string} robloxId Roblox user id
 * @returns {Promise.<Object>} Roblox user data
 */
function fetchRoblox(robloxId) {
    return new Promise((promiseRes, promiseRej) => {
        if (!robloxId) promiseRej("Roblox user id (argument 0) missing or null");

        https.get(`https://users.roblox.com/v1/users/${robloxId}`, (res) => {
            var data = "";

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                if (res.statusCode === 200) {
                    promiseRes(JSON.parse(data));
                } else if (res.statusCode === 404) {
                    promiseRej("Roblox user id (argument 0) is invalid");
                } else {
                    promiseRej(`${res.statusMessage} (${res.statusCode})`);
                }
            });
        }).on("error", (err) => {
            promiseRej(err.message);
        });
    });
}

module.exports = {
    /**
     * Fetch Roblox user data from a Discord user.
     * @param {string} discordId Discord user id (snowflake)
     * @returns {Promise.<Object>} Roblox user data
     */
    "verify": (discordId) => {
        return new Promise((promiseRes, promiseRej) => {
            if (!discordId) promiseRej("Discord user id (argument 0) missing or null");

            // Attempt 1: Bloxlink
            https.get(`https://api.blox.link/v1/user/${discordId}`, (res) => {
                var data = "";

                res.on("data", (chunk) => {
                    data += chunk;
                });

                res.on("end", () => {
                    const bloxlink = JSON.parse(data);

                    if (bloxlink.status === "ok") {
                        fetchRoblox(bloxlink.primaryAccount)
                            .then((user) => {
                                user.verificationService = "bloxlink";
                                promiseRes(user);
                            })
                            .catch((err) => {
                                promiseRej(err);
                            });
                    } else if (bloxlink.status === "error") {
                        if (bloxlink.error === "This user is not linked with Bloxlink.") {
                            // Attempt 2: RoVer
                            https.get(`https://verify.eryn.io/api/user/${discordId}`, (res) => {
                                var data = "";

                                res.on("data", (chunk) => {
                                    data += chunk;
                                });

                                res.on("end", () => {
                                    const rover = JSON.parse(data);

                                    if (rover.status === "ok") {
                                        fetchRoblox(rover.robloxId)
                                            .then((user) => {
                                                user.verificationService = "rover";
                                                promiseRes(user);
                                            })
                                            .catch((err) => {
                                                promiseRej(err);
                                            });
                                    } else if (rover.status === "error") {
                                        if (rover.error === "User not found.") {
                                            promiseRej("Discord user id (argument 0) is not verified");
                                        } else {
                                            promiseRej(rover.error);
                                        }
                                    } else {
                                        promiseRej(rover.status);
                                    }
                                });
                            }).on("error", (err) => {
                                promiseRej(err.message);
                            });
                        } else {
                            promiseRej(bloxlink.error);
                        }
                    } else {
                        promiseRej(bloxlink.status);
                    }
                });
            }).on("error", (err) => {
                promiseRej(err.message);
            });
        });
    }
};