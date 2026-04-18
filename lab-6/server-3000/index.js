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

// sessions storage with TTL
const activeSessions = [];

// TTL = 2 minutes
const SESSION_TTL = 2 * 60 * 1000;

// cleanup function
function cleanSessions() {
  const now = Date.now();

  for (let i = activeSessions.length - 1; i >= 0; i--) {
    if (now - activeSessions[i].createdAt > SESSION_TTL) {
      activeSessions.splice(i, 1);
    }
  }
}

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

// users
const users = ["john", "alice"];

// LOGIN
app.get("/login", (req, res) => {
  const username = req.query.username;

  if (!username || !users.includes(username)) {
    return res.status(401).send("Invalid user");
  }

  const sessionID = `${username}-session-123`;

  activeSessions.push({
    id: sessionID,
    createdAt: Date.now()
  });

  res.setHeader("Set-Cookie", `SessionID=${sessionID}; Path=/;`);

  res.send(`Logged in as ${username}`);
});

// LOGOUT
app.get("/api/logout", (req, res) => {
  const cookie = req.headers.cookie;

  if (cookie && cookie.includes("SessionID=")) {
    const sessionID = cookie.split("SessionID=")[1].split(";")[0];

    const index = activeSessions.findIndex(s => s.id === sessionID);
    if (index !== -1) {
      activeSessions.splice(index, 1);
    }
  }

  res.send("Logged out");
});

// EMAILS (protected + TTL)
app.get("/emails", (req, res) => {
  cleanSessions();

  const cookie = req.headers.cookie;

  if (!cookie || !cookie.includes("SessionID=")) {
    return res.status(401).send("Unauthorized");
  }

  const sessionID = cookie.split("SessionID=")[1].split(";")[0];

  const session = activeSessions.find(s => s.id === sessionID);

  if (!session) {
    return res.status(401).send("Unauthorized (session expired)");
  }

  res.json([
    { id: 1, sender: "alice@mail.com", subject: "Hello!", body: "This is first email" },
    { id: 2, sender: "bob@mail.com", subject: "Meeting", body: "Let's meet tomorrow" }
  ]);
});

// static
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});