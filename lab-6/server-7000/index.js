const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 7000;

const configPath = path.join(__dirname, "config.json");

// CORS FIX
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// читаємо mode з config
function getMode() {
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  return config.mode;
}

// CDN SCRIPT: react-mock.js
app.get("/react-mock.js", (req, res) => {
  const mode = getMode();

  res.type("application/javascript");

  // MODE: INSECURE (без захисту)
  if (mode === "mode-insecure") {
    return res.send(`
      console.log("React loaded in INSECURE MODE (SRI NOT ENFORCED SCENARIO)");
      console.log("React v1.0.1 loaded from CDN (Port 7000)");
    `);
  }

  // MODE: SRI ACTIVE (нормальний захищений сценарій)
  if (mode === "mode-sri-active") {
    return res.send(`
      console.log("React v1.0.1 loaded from CDN (Port 7000)");
    `);
  }

  // fallback (якщо щось не так у config)
  return res.send(`
    console.log("React loaded (DEFAULT MODE)");
  `);
});

// static files (logo, css)
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`CDN Server running on http://localhost:${PORT}`);
});