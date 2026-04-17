const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());

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

// ФЕЙК БАЗА КОРИСТУВАЧІВ
const users = ["john", "alice"];

// LOGIN ROUTE
app.get("/login", (req, res) => {
  const username = req.query.username;

  if (!users.includes(username)) {
    return res.status(401).send("Invalid user");
  }

  const sessionID = `${username}-session-123`;

  // COOKIE
  res.setHeader("Set-Cookie", `SessionID=${sessionID}; Path=/api; HttpOnly`);

  res.send(`Logged in as ${username}`);
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