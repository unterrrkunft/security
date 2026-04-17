const sidebar = document.getElementById("sidebar");
const content = document.getElementById("content");
const usernameDiv = document.getElementById("username");

// ОТРИМАННЯ КОРИСТУВАЧА З COOKIE
function getSessionUser() {
  const cookie = document.cookie;

  if (!cookie.includes("SessionID=")) return null;

  const session = cookie.split("SessionID=")[1];

  // john-session-123 → john
  return session.split("-")[0];
}

// ОНОВЛЕННЯ UI ПРИ ЗАВАНТАЖЕННІ
function updateUserUI() {
  const user = getSessionUser();

  if (user) {
    usernameDiv.innerText = `Logged in as ${user}`;
  }
}

// LOGIN FUNCTION
async function login() {
  const username = document.getElementById("loginInput").value;

  const res = await fetch(`/login?username=${username}`);

  if (res.ok) {
    usernameDiv.innerText = `Logged in as ${username}`;

    // ТРИГЕР ПІСЛЯ ЛОГІНУ
    window.dispatchEvent(new Event("userLoggedIn"));
  } else {
    alert("Login failed");
  }
}

// LOAD EMAILS
async function loadEmails() {
  const res = await fetch("/emails");
  const emails = await res.json();

  sidebar.innerHTML = "";

  emails.forEach(email => {
    const div = document.createElement("div");
    div.innerText = email.subject;
    div.style.cursor = "pointer";
    div.style.marginBottom = "10px";

    div.onclick = () => {
      content.innerHTML = `
        <h3>${email.subject}</h3>
        <p><b>${email.sender}</b></p>
        <p>${email.body}</p>
      `;
    };

    sidebar.appendChild(div);
  });
}

// виклик при старті
updateUserUI();
loadEmails();