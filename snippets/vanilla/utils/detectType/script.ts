import { startRun } from "@toolkit/code-trace/runtime";
import { detectType } from "./detect-type";

class Cat {}

const EXAMPLES: Record<string, () => unknown> = {
  null: () => null,
  undefined: () => undefined,
  number: () => 42,
  string: () => "hello",
  boolean: () => true,
  array: () => [1, 2],
  object: () => ({}),
  bare: () => Object.create(null),
  date: () => new Date(),
  map: () => new Map(),
  set: () => new Set(),
  regexp: () => /regex/,
  function: () => () => {},
  class: () => new Cat(),
};

const buttons = document.querySelectorAll<HTMLButtonElement>("[data-value]");
const typeEl = document.querySelector(".type-detector__type")!;

const select = (button: HTMLButtonElement) => {
  buttons.forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
  startRun();
  typeEl.textContent = detectType(EXAMPLES[button.dataset.value!]());
};

buttons.forEach((button) =>
  button.addEventListener("click", () => select(button)),
);

select(document.querySelector<HTMLButtonElement>('[data-value="array"]')!);
