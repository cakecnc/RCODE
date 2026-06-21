const chatList = document.querySelector(".chat-list");
const messages = document.querySelector(".messages");
const composer = document.querySelector(".composer");
const input = composer.querySelector("input");
const sendBtn = composer.querySelector("button");
const chatTitle = document.querySelector(".chat-title");
const chatSubtitle = document.querySelector(".chat-subtitle");
const logoutBtn = document.getElementById("logoutBtn");

const chats = [
  { id: 1, name: "코드엑스 팀", messages: [
    { text: "회의 10시에 시작합니다", mine: false },
    { text: "네 알겠습니다", mine: true },
  ]},
  { id: 2, name: "경영 지원", messages: [
    { text: "이번 주 매출 정리 전달드립니다", mine: false },
  ]},
  { id: 3, name: "Alice", messages: [
    { text: "내일 오전에 봬요", mine: false },
    { text: "네 좋아요", mine: true },
  ]},
  { id: 4, name: "Bob", messages: [
    { text: "샘플 파일 전달드립니다", mine: false },
  ]},
];

let activeChatId = null;

function getSession() {
  try { return JSON.parse(localStorage.getItem("chat_session")); }
  catch { return null; }
}

function clearSession() {
  localStorage.removeItem("chat_session");
}

function renderChatList() {
  chatList.innerHTML = "";
  chats.forEach((chat) => {
    const li = document.createElement("li");
    li.className = chat.id === activeChatId ? "active" : "";
    const last = chat.messages[chat.messages.length - 1];
    li.innerHTML = `<div class="name">${chat.name}</div>
      <div class="preview">${last ? last.text : ""}</div>`;
    li.addEventListener("click", () => {
      activeChatId = chat.id;
      renderChatList();
      renderMessages();
    });
    chatList.appendChild(li);
  });
}

function renderMessages() {
  messages.innerHTML = "";
  const chat = chats.find((c) => c.id === activeChatId);
  if (!chat) {
    chatTitle.textContent = "선택된 채팅방";
    chatSubtitle.textContent = "0";
    return;
  }
  const session = getSession();
  chatTitle.textContent = chat.name;
  chatSubtitle.textContent = `${chat.messages.length}`;
  chat.messages.forEach((msg) => {
    const row = document.createElement("div");
    row.className = "message" + (msg.mine ? " mine" : "");
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = msg.text;
    row.appendChild(bubble);
    messages.appendChild(row);
  });
  messages.scrollTop = messages.scrollHeight;
}

function sendMessage() {
  const text = input.value.trim();
  if (!text) return;
  const chat = chats.find((c) => c.id === activeChatId);
  if (!chat) return;
  chat.messages.push({ text, mine: true });
  input.value = "";
  renderMessages();
  renderChatList();
}

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    clearSession();
    window.location.replace("login.html");
  });
}

renderChatList();
renderMessages();
