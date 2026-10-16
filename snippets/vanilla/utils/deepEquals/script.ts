import { startRun } from "@toolkit/code-trace/runtime";
import { deepEquals } from "./deepEquals";

const cyclic = () => {
  const node: Record<string, unknown> = {};
  node.self = node;
  return node;
};

const PAIRS: Record<string, () => [unknown, unknown]> = {
  nan: () => [NaN, NaN],
  object: () => [{ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] }],
  objectDiff: () => [{ a: 1 }, { a: 2 }],
  array: () => [[1, 2], { 0: 1, 1: 2 }],
  date: () => [new Date(0), new Date(1)],
  regexp: () => [/a/g, /a/i],
  map: () => [new Map([["a", 1]]), new Map([["a", 1]])],
  set: () => [new Set([{ x: 1 }]), new Set([{ x: 1 }])],
  setDiff: () => [new Set([1]), new Set([2])],
  cycle: () => [cyclic(), cyclic()],
};

const buttons = document.querySelectorAll<HTMLButtonElement>("[data-pair]");
const resultEl = document.querySelector(".deep-equals__result")!;

const select = (button: HTMLButtonElement) => {
  buttons.forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
  startRun();
  const [a, b] = PAIRS[button.dataset.pair!]();
  resultEl.textContent = String(deepEquals(a, b));
};

buttons.forEach((button) =>
  button.addEventListener("click", () => select(button)),
);

select(document.querySelector<HTMLButtonElement>('[data-pair="object"]')!);
