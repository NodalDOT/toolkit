const editor = document.querySelector(".message-editor");
const message = document.querySelector("#message");
const notification = document.querySelector(".notification");

const updateMessage = () => {
  notification.textContent = message.value;
  notification.hidden = message.value.trim() === "";
};

message.addEventListener("input", updateMessage);
updateMessage();
editor.hidden = false;
