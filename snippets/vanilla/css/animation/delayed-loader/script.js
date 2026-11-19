const demo = document.querySelector(".loader-demo");
const buttons = demo.querySelectorAll("button");
const status = demo.querySelector(".loader-status");

const simulateResponse = (duration) => {
  if (demo.hasAttribute("data-loading")) return;

  demo.setAttribute("data-loading", "");
  status.textContent = "Waiting for response…";
  buttons.forEach((button) => button.setAttribute("aria-disabled", "true"));

  setTimeout(() => {
    demo.removeAttribute("data-loading");
    status.textContent = `Response received · ${duration} ms`;
    buttons.forEach((button) => button.removeAttribute("aria-disabled"));
  }, duration);
};

for (const button of buttons) {
  button.addEventListener("click", () =>
    simulateResponse(Number(button.dataset.duration)),
  );
  button.disabled = false;
}
