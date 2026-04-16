const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const configPath = path.join(__dirname, "config.json");
const versionPath = path.join(__dirname, "version.txt");

const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
const version = fs.readFileSync(versionPath, "utf-8").trim();

console.log(`[System] Starting ${config.appName} v${version}...`);

// CSP middleware
app.use((req, res, next) => {
  if (config.mode === "csp-balanced") {
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; " +
      "img-src *; " +
      "style-src *; " +
      "script-src 'self' http://localhost:7000 http://localhost:4000 http://localhost:5000; " +
      "connect-src 'self' http://localhost:4000;"
    );
  }

  next();
});

// emails API
app.get("/emails", (req, res) => {
  res.json([
    { id: 1, sender: "alice@mail.com", subject: "Hello!", body: "This is first email" },
    { id: 2, sender: "bob@mail.com", subject: "Meeting", body: "Let's meet tomorrow" }
  ]);
});

// static frontend
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});