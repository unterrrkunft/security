console.log("Weather widget loaded");

(async function () {
  try {
    const res = await fetch("http://localhost:5000/mode");
    const data = await res.json();

    const mode = data.mode;

    if (mode === "breach1") {
      alert(
        "HACKED: I can see your cookies: " +
        document.cookie +
        " and User: " +
        document.getElementById("username").innerText
      );
    } else {
      const box = document.createElement("div");
      box.style.position = "fixed";
      box.style.top = "20px";
      box.style.right = "20px";
      box.style.padding = "10px";
      box.style.background = "white";
      box.innerText = "Temperature: 12°C";
      document.body.appendChild(box);
    }
  } catch (e) {
    console.log("Mode fetch failed", e);
  }
})();