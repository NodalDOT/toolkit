import { startRun } from "@toolkit/code-trace/runtime";
import { deepClone } from "./deepClone";

class Cat {}

type Example<T> = {
  create: () => T;
  check: string;
  verify(original: T, copy: T): boolean;
};

const example = <T>(value: Example<T>) => value;

const EXAMPLES: Record<string, Example<unknown>> = {
  primitive: example({
    create: () => 42,
    check: "copy === 42",
    verify: (_, copy) => copy === 42,
  }),
  object: example({
    create: () => ({ a: [1, { b: 2 }] }),
    check: "copy.a[1] !== original.a[1]",
    verify: (original, copy) => copy.a[1] !== original.a[1],
  }),
  date: example({
    create: () => new Date(0),
    check: "copy.getTime() === 0",
    verify: (_, copy) => copy.getTime() === 0,
  }),
  regexp: example({
    create: () => /a/g,
    check: 'copy.flags === "g"',
    verify: (_, copy) => copy.flags === "g",
  }),
  map: example({
    create: () => new Map([["k", { x: 1 }]]),
    check: 'copy.get("k") !== original.get("k")',
    verify: (original, copy) => copy.get("k") !== original.get("k"),
  }),
  set: example({
    create: () => new Set([{ y: 1 }]),
    check: "[...copy][0] !== [...original][0]",
    verify: (original, copy) => [...copy][0] !== [...original][0],
  }),
  shared: example({
    create: () => {
      const obj = { z: 1 };
      return { x: obj, y: obj };
    },
    check: "copy.x === copy.y",
    verify: (_, copy) => copy.x === copy.y,
  }),
  cycle: example({
    create: () => {
      const node: Record<string, unknown> = {};
      node.self = node;
      return node;
    },
    check: "copy.self === copy",
    verify: (_, copy) => copy.self === copy,
  }),
  class: example({
    create: () => new Cat(),
    check: "copy instanceof Cat",
    verify: (_, copy) => copy instanceof Cat,
  }),
};

const buttons = document.querySelectorAll<HTMLButtonElement>("[data-example]");
const sameEl = document.querySelector(".deep-clone__same")!;
const checkEl = document.querySelector(".deep-clone__check")!;
const checkResultEl = document.querySelector(".deep-clone__check-result")!;

const select = (button: HTMLButtonElement) => {
  buttons.forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
  const { create, check, verify } = EXAMPLES[button.dataset.example!];
  const original = create();
  startRun();
  const copy = deepClone(original);
  sameEl.textContent = String(copy === original);
  checkEl.textContent = check;
  checkResultEl.textContent = String(verify(original, copy));
};

buttons.forEach((button) =>
  button.addEventListener("click", () => select(button)),
);

select(document.querySelector<HTMLButtonElement>('[data-example="cycle"]')!);
