console.log("Support widget loaded");

window.addEventListener("DOMContentLoaded", () => {
  console.log("DOM ready");

  const btn = document.createElement("button");
  btn.innerText = "Chat with Support";

  btn.style.position = "fixed";
  btn.style.bottom = "20px";
  btn.style.right = "20px";
  btn.style.zIndex = "9999";
  btn.style.padding = "10px";

  document.body.appendChild(btn);

  console.log("Button added");

  btn.onclick = async () => {
    try {
      const res = await fetch("http://localhost:4000/messages");
      const data = await res.json();
      alert(data.message);
    } catch (e) {
      console.log(e);
      alert("Support server not reachable");
    }
  };
});