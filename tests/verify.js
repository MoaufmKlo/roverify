const roverify = require("../index.js");

test("Verify an existing Discord user", () => {
    return roverify.verify("348853688179359746").then((robloxUser) => {
        expect(robloxUser).toEqual(expect.objectContaining({
            "id": 79291163,
            "verificationService": "bloxlink"
        }))
    });
});