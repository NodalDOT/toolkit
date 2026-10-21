import { startRun } from "@toolkit/code-trace/runtime";
import { stringify } from "./stringify";

class Cat {
  name = "Tom";
}

const cyclic = () => {
  const node: Record<string, unknown> = { a: 1 };
  node.self = node;
  return node;
};

const EXAMPLES: Record<string, () => unknown> = {
  undefined: () => undefined,
  bigint: () => 10n,
  string: () => 'say "hi"',
  function: () => function foo() {},
  date: () => new Date(0),
  error: () => new Error("boom"),
  array: () => [1, [2, "3"]],
  empty: () => ({}),
  object: () => ({ user: { name: "Ann" }, list: [1] }),
  map: () => new Map([["k", { x: 1 }]]),
  set: () => new Set([1, "2"]),
  class: () => new Cat(),
  cycle: cyclic,
};

const buttons = document.querySelectorAll<HTMLButtonElement>("[data-value]");
const resultEl = document.querySelector(".stringify__result")!;

const select = (button: HTMLButtonElement) => {
  buttons.forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
  const value = EXAMPLES[button.dataset.value!]();
  startRun();
  resultEl.textContent = stringify(value);
};

buttons.forEach((button) =>
  button.addEventListener("click", () => select(button)),
);

select(document.querySelector<HTMLButtonElement>('[data-value="object"]')!);
