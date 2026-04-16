document.cookie = "SessionID=123456";

const sidebar = document.getElementById("sidebar");
const content = document.getElementById("content");

async function loadEmails() {
  const res = await fetch("/emails");
  const emails = await res.json();

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

loadEmails();