const express = require("express");
const path = require("path");

const app = express();
const PORT = 7000;

// дозволяємо доступ до файлів папки
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`CDN Server running on http://localhost:${PORT}`);
});