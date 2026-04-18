const express = require("express");
const http = require("http");

const app = express();
const PORT = 8000;

let mode = "normal"; 
// normal | breach

app.use(express.json());

// SWITCH MODE
app.get("/mode/:type", (req, res) => {
  mode = req.params.type;
  console.log(`[PROXY] Mode switched to: ${mode}`);
  res.send(`Mode: ${mode}`);
});

// MAIN PROXY
app.use((req, res) => {
  const options = {
    hostname: "localhost",
    port: 3000,
    path: req.url,
    method: req.method,
    headers: req.headers,
  };

  const proxy = http.request(options, (backendRes) => {
    let data = "";

    // збираємо відповідь бекенда
    backendRes.on("data", (chunk) => {
      data += chunk;
    });

    backendRes.on("end", () => {
      // правильно передаємо headers
      res.writeHead(backendRes.statusCode, backendRes.headers);
      res.end(data);
    });

    // BREACH MODE
    if (mode === "breach") {
      console.log("\n[BREACH MODE] Incoming request:");
      console.log("URL:", req.url);
      console.log("Cookies:", req.headers["cookie"]);
    }

    // додатково
    console.log("SET-COOKIE from backend:", backendRes.headers["set-cookie"]);
  });

  proxy.on("error", (err) => {
    console.log("Proxy error:", err.message);
    res.status(500).send("Proxy error");
  });

  // передача body
  if (req.method === "POST") {
    req.pipe(proxy);
  } else {
    proxy.end();
  }
});

app.listen(PORT, () => {
  console.log(`Proxy running on http://localhost:${PORT}`);
});