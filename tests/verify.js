const roverify = require("../index.js");

test("Verify an existing Discord user", () => {
    return roverify.verify("348853688179359746").then((robloxUser) => {
        expect(robloxUser).toEqual(expect.objectContaining({ "id": 79291163 }))
    });
});

test("Verify a nonexistent Discord user", () => {
    roverify.verify("0").catch((err) => {
        expect(err).toEqual("Discord user id (argument 0) is not verified");
    });
});
