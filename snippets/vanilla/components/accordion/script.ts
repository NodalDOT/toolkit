import { startRun } from "@toolkit/code-trace/runtime";
import { accordion } from "./accordion";

const root = document.querySelector<HTMLElement>(".accordion")!;
const items = [...root.querySelectorAll("details")];
const buttons = document.querySelectorAll<HTMLButtonElement>("[data-mode]");

let cleanup: (() => void) | null = null;

const select = (button: HTMLButtonElement) => {
  const { mode } = button.dataset;

  cleanup?.();
  cleanup = null;

  buttons.forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
  root.dataset.mode = mode;
  items.forEach((d) =>
    mode === "none"
      ? d.removeAttribute("name")
      : d.setAttribute("name", "accordion"),
  );

  if (mode === "script") {
    startRun();
    cleanup = accordion(items);
  }
};

buttons.forEach((button) =>
  button.addEventListener("click", () => select(button)),
);
root.addEventListener("click", (event) => {
  const target = event.target as Element;
  if (root.dataset.mode === "script" && target.closest("summary")) startRun();
});

select(document.querySelector<HTMLButtonElement>('[data-mode="script"]')!);
