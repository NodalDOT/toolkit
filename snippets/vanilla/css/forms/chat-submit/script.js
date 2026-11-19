const form = document.querySelector(".chat-form");
const input = form.querySelector("input");
const send = form.querySelector("button");
const history = document.querySelector(".chat-history");
const empty = history.querySelector(".chat-empty");

const updateSend = () => {
  send.disabled = input.value.trim() === "";
};

input.addEventListener("input", updateSend);
window.addEventListener("pageshow", updateSend);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const message = input.value.trim();
  if (!message) return;

  const bubble = document.createElement("p");
  bubble.className = "chat-message";
  bubble.textContent = message;
  empty.remove();
  history.append(bubble);
  history.scrollTop = history.scrollHeight;

  input.value = "";
  updateSend();
  input.focus();
});

updateSend();
