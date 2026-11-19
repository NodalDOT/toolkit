const trigger = document.querySelector("#open-dialog");
const dialog = document.querySelector("#modal");

if (typeof dialog.showModal === "function") {
  trigger.addEventListener("click", () => dialog.showModal());
  trigger.disabled = false;
}
