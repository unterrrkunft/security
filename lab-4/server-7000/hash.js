const fs = require("fs");
const crypto = require("crypto");

const file = fs.readFileSync("react-mock.js");

const hash = crypto
  .createHash("sha256")
  .update(file)
  .digest("base64");

console.log("sha256-" + hash);