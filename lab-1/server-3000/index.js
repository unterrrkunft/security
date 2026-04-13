const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// шляхи до файлів
const configPath = path.join(__dirname, "config.json");
const versionPath = path.join(__dirname, "version.txt");

// читаємо config і version
const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
const version = fs.readFileSync(versionPath, "utf-8").trim();

// лог старту
console.log(`[System] Starting ${config.appName} v${version}...`);

// EMAIL ДАНІ
const emails = [
  {
    id: 1,
    sender: "alice@mail.com",
    subject: "Hello!",
    body: "This is first email"
  },
  {
    id: 2,
    sender: "bob@mail.com",
    subject: "Meeting",
    body: "Let's meet tomorrow"
  }
];

// API для email
app.get("/emails", (req, res) => {
  res.json(emails);
});

// віддавати файли (HTML, JS, CSS якщо є)
app.use(express.static(__dirname));

// старт сервера
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});