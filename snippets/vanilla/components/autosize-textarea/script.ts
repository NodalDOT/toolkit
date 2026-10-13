import { startRun } from "@toolkit/code-trace/runtime";
import { autosize } from "./autosize";

const field = document.querySelector<HTMLTextAreaElement>(".autosize__field")!;
const buttons = document.querySelectorAll<HTMLButtonElement>("[data-mode]");

let cleanup: (() => void) | null = null;

const select = (button: HTMLButtonElement) => {
  const { mode } = button.dataset;

  buttons.forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
  field.dataset.mode = mode;

  cleanup?.();
  cleanup = null;

  if (mode === "script") {
    startRun();
    cleanup = autosize(field);
  }
};

buttons.forEach((button) =>
  button.addEventListener("click", () => select(button)),
);
field.addEventListener("input", () => {
  if (field.dataset.mode === "script") startRun();
});

select(document.querySelector<HTMLButtonElement>('[data-mode="css"]')!);
