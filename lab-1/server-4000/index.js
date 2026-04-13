const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 4000;

app.use(cors());

// API для fetch
app.get("/messages", (req, res) => {
  res.json({
    message: "No new support messages"
  });
});

// ОЦЕ ТРЕБА ДОДАТИ
app.get("/support.js", (req, res) => {
  res.sendFile(path.join(__dirname, "support.js"));
});

app.listen(PORT, () => {
  console.log(`Support server running on http://localhost:${PORT}`);
});
