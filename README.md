<div align="center">
    <h1>roverify</h1>
    <img alt="npm Version" src="https://img.shields.io/npm/v/roverify?style=for-the-badge">
    <img alt="npm Downloads" src="https://img.shields.io/npm/dw/roverify?style=for-the-badge">
    <br>
</div>

## Table of contents
- [Table of contents](#table-of-contents)
- [About](#about)
- [Installation](#installation)
- [Usage](#example-usage)
- [Links](#links)
- [Contributing](#contributing)

## About

4.43kB & dependency-free [Node.js](https://nodejs.org/) module to fetch Roblox user data from a Discord user. The module prioritizes Bloxlink over RoVer.

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install roverify:

```bash
npm install roverify
```

## Usage

```javascript
const roverify = require("roverify");

roverify.verify("113691352327389188")    
    .then((robloxUser) => {
        console.log(robloxUser.name);
    })
    .catch((err) => {
        if (err === "Discord user id (argument 0) is not verified") {
            console.log("Discord user is not verified");
        } else {
            throw err;
        }
    });
```

The `robloxUser` object returned consists of the following:

```json
{
    "description": "Welcome to the Roblox profile! This is where you can check out the newest items in the catalog, and get a jumpstart on exploring and building on our Imagination Platform. If you want news on updates to the Roblox platform, or great new experiences to play with friends, check out blog.roblox.com. Please note, this is an automated account. If you need to reach Roblox for any customer service needs find help at www.roblox.com/help",
    "created": "2006-02-27T21:06:40.3Z",
    "isBanned": false,
    "externalAppDisplayName": null,
    "id": 1,
    "name": "Roblox",
    "displayName": "Roblox",
    "verificationService": "bloxlink"
}
```

## Links

- [npm](https://www.npmjs.com/package/roverify)
- [GitHub](https://github.com/MoaufmKlo/roverify)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.