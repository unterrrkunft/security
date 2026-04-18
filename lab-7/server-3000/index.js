const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = 3000;

app.use(express.json());

// MODE SWITCH
const mode = process.argv.includes("--mode=samesite-strict")
  ? "samesite-strict"
  : "samesite-lax";

console.log("Security mode:", mode);

// sessions storage with TTL
const activeSessions = [];
const csrfTokens = {};

// TTL = 2 minutes
const SESSION_TTL = 2 * 60 * 1000;

// emails
let emails = [
  { id: 1, sender: "alice@mail.com", subject: "Hello!", body: "This is first email" },
  { id: 2, sender: "bob@mail.com", subject: "Meeting", body: "Let's meet tomorrow" }
];

// cleanup function
function cleanSessions() {
  const now = Date.now();

  for (let i = activeSessions.length - 1; i >= 0; i--) {
    if (now - activeSessions[i].createdAt > SESSION_TTL) {
      delete csrfTokens[activeSessions[i].id];
      activeSessions.splice(i, 1);
    }
  }
}

// CSP middleware
app.use((req, res, next) => {
  next();
});

// users
const users = ["john", "alice"];

// LOGIN + CSRF TOKEN GENERATION
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

  // CSRF TOKEN
  const token = crypto.randomBytes(16).toString("hex");
  csrfTokens[sessionID] = token;

  let sameSite = mode === "samesite-strict" ? "Strict" : "Lax";

  res.setHeader(
    "Set-Cookie",
    `SessionID=${sessionID}; Path=/; HttpOnly; SameSite=${sameSite}`
  );

  // UI отримує токен
  res.json({
    message: `Logged in as ${username}`,
    csrfToken: token
  });
});

// EMAILS
app.get("/emails", (req, res) => {
  cleanSessions();

  const cookie = req.headers.cookie;
  if (!cookie) return res.status(401).send("Unauthorized");

  const sessionID = cookie.split("SessionID=")[1]?.split(";")[0];
  const session = activeSessions.find(s => s.id === sessionID);

  if (!session) return res.status(401).send("Unauthorized");

  res.json(emails);
});

// DELETE EMAIL (CSRF PROTECTED)
app.post("/api/emails/delete/:id", (req, res) => {
  const cookie = req.headers.cookie;

  if (!cookie) return res.status(401).send("Unauthorized");

  const sessionID = cookie.split("SessionID=")[1]?.split(";")[0];
  const session = activeSessions.find(s => s.id === sessionID);

  if (!session) return res.status(401).send("Session expired");

  const token = req.body._csrf_token;

  if (!token || csrfTokens[sessionID] !== token) {
    return res.status(403).send("Forbidden - CSRF detected");
  }

  const id = parseInt(req.params.id);

  emails = emails.filter(e => e.id !== id);

  console.log("Deleted email:", id);

  res.send("Deleted");
});

// LOGOUT
app.get("/api/logout", (req, res) => {
  res.send("Logged out");
});

// STATIC
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});