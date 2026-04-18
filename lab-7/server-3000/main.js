const sidebar = document.getElementById("sidebar");
const content = document.getElementById("content");
const usernameDiv = document.getElementById("username");

let csrfToken = null;

// LOGIN
async function login() {
  const username = document.getElementById("loginInput").value;

  const res = await fetch(`/login?username=${username}`);
  const data = await res.json();

  csrfToken = data.csrfToken;

  usernameDiv.innerText = `Logged in as ${username}`;

  loadEmails();
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

  if (emails.length === 0) {
    content.innerHTML = "<h3>📭 No emails left</h3>";
  }

  emails.forEach(email => {
    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.justifyContent = "space-between";
    div.style.alignItems = "center";
    div.style.marginBottom = "10px";

    const title = document.createElement("span");
    title.innerText = email.subject;
    title.style.cursor = "pointer";

    title.onclick = () => {
      content.innerHTML = `
        <h3>${email.subject}</h3>
        <p><b>${email.sender}</b></p>
        <p>${email.body}</p>
      `;
    };

    const btn = document.createElement("button");
    btn.innerText = "Delete";

    btn.onclick = async (e) => {
      e.stopPropagation();

      await fetch(`/api/emails/delete/${email.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          _csrf_token: csrfToken
        })
      });

      content.innerHTML = `<h3 style="color:red;">🗑 Email ${email.id} deleted</h3>`;

      loadEmails();
    };

    div.appendChild(title);
    div.appendChild(btn);

    sidebar.appendChild(div);
  });
}

// LOGOUT
async function logout() {
  await fetch("/api/logout");

  document.cookie = "SessionID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  csrfToken = null;

  usernameDiv.innerText = "Not logged in";
  sidebar.innerHTML = "";
  content.innerHTML = "Select email";
}

// INIT
loadEmails();