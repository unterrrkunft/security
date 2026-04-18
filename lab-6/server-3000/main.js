const sidebar = document.getElementById("sidebar");
const content = document.getElementById("content");
const usernameDiv = document.getElementById("username");

// LOGIN
async function login() {
  const username = document.getElementById("loginInput").value;

  const res = await fetch(`/login?username=${username}`);

  if (res.ok) {
    usernameDiv.innerText = `Logged in as ${username}`;
    loadEmails();
  } else {
    alert("Login failed");
  }
}

// LOAD EMAILS
async function loadEmails() {
  const res = await fetch("/emails");

  if (!res.ok) {
    sidebar.innerHTML = "";
    content.innerHTML = "Unauthorized / Session expired";
    return;
  }

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

// LOGOUT
async function logout() {
  await fetch("/api/logout");

  document.cookie = "SessionID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  usernameDiv.innerText = "Not logged in";
  sidebar.innerHTML = "";
  content.innerHTML = "Select email";
}

// init
loadEmails();