const https = require("https");

/**
 * @typedef {Object} RobloxUser
 * @property {String} description User description
 * @property {Date} created When the account was created
 * @property {Boolean} banned Whether user is banned
 * @property {String} [externalAppDisplayName] External app display name of the user
 * @property {Number} id User id
 * @property {String} name Username
 * @property {String} displayName Cosmetic display name, falls back to name
 * @property {("bloxlink" | "rover")} verificationService From which service the verification comes
 */

/**
 * GET a resource.
 * @param {String} url
 * @returns {Promise<Response, Object>} Request response object
 */
function get(url) {
    return new Promise((res, rej) => https.get(url, (req) => {
        let data = "";
        req.on("data", (chunk) => data += chunk);

        req.on("end", () => {
            req.json = JSON.parse(data);
            res(req);
        });
    }));
}

/**
 * Fetch Roblox user data from a Roblox user id.
 * @param {string} robloxId Roblox user id
 * @returns {Promise<RobloxUser>} Roblox user object
 */
function fetchRoblox(robloxId) {
    return new Promise((res, rej) => {
        if (!robloxId) rej("Roblox user id (argument 0) missing or null");

        get(`https://users.roblox.com/v1/users/${robloxId}`).then((req) => {
            if (req.statusCode === 200) {
                req.json.created = new Date(req.json.created);
                res(req.json);
            } else {
                rej(`${req.statusMessage} (${req.statusCode})`);
            }
        }).catch((err) => {
            if (req.statusCode === 404) {
                rej("Roblox user id (argument 0) is invalid");
            } else {
                rej(`${err.statusMessage} (${err.statusCode})`);
            }
        });
    });
}

module.exports = {

    /**
     * Get a Discord user's Roblox account.
     * @param {String} discordId Discord user id
     * @returns {Promise<RobloxUser>} Roblox user object
     */
    "verify": (discordId) => {
        return new Promise((res, rej) => {
            if (!discordId) rej("Discord user id (argument 0) missing or null");

            // Attempt 1: Bloxlink
            get(`https://api.blox.link/v1/user/${discordId}`).then((req) => {
                const bloxlink = req.json;

                if (bloxlink.status === "ok") {
                    fetchRoblox(bloxlink.primaryAccount)
                        .then((user) => {
                            user.verificationService = "bloxlink";
                            res(user);
                        })
                        .catch((err) => {
                            rej(err);
                        });
                } else if (bloxlink.status === "error") {
                    if (bloxlink.error === "This user is not linked with Bloxlink.") {
                        // Attempt 2: RoVer
                        get(`https://verify.eryn.io/api/user/${discordId}`).then((req) => {
                            const rover = req.json;

                            if (rover.status === "ok") {
                                fetchRoblox(rover.robloxId)
                                    .then((user) => {
                                        user.verificationService = "rover";
                                        res(user);
                                    })
                                    .catch((err) => {
                                        rej(`${err.statusMessage} (${err.statusCode})`);
                                    });
                            } else if (rover.status === "error") {
                                if (rover.error === "User not found.") {
                                    rej("Discord user id (argument 0) is not verified");
                                } else {
                                    rej(rover.error);
                                }
                            } else {
                                rej(rover.status);
                            }
                        }).catch((err) => {
                            rej(`${err.statusMessage} (${err.statusCode})`);
                        });;
                    } else {
                        rej(bloxlink.error);
                    }
                } else {
                    rej(bloxlink.status);
                }
            }).catch((err) => {
                rej(`${err.statusMessage} (${err.statusCode})`);
            });
        });
    }

};