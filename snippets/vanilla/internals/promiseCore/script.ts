import { startRun } from "@toolkit/code-trace/runtime";
import { PromiseCore } from "./promiseCore";

const DELAY = 500;

const boom = () => new Error("boom");

const EXAMPLES: Record<string, () => PromiseCore<unknown>> = {
  value: () =>
    new PromiseCore<number>((resolve) => resolve(5)).then((x) => x * 2),
  delayed: () =>
    new PromiseCore<string>((resolve) =>
      setTimeout(() => resolve("done"), DELAY),
    ),
  reject: () => new PromiseCore((_, reject) => reject(boom())),
  throw: () =>
    new PromiseCore(() => {
      throw boom();
    }),
  catch: () =>
    new PromiseCore((_, reject) => reject(boom())).catch(() => "recovered"),
  passThrough: () =>
    new PromiseCore<number>((_, reject) => reject(boom()))
      .then((x) => x * 2)
      .catch((error: Error) => `caught ${error.message}`),
  thenable: () =>
    new PromiseCore((resolve) =>
      resolve({
        then: (onFulfilled: (value: number) => void) => onFulfilled(42),
      }),
    ),
  nested: () =>
    new PromiseCore((resolve) =>
      resolve(new PromiseCore<string>((inner) => inner("inner"))),
    ),
  once: () =>
    new PromiseCore((resolve, reject) => {
      resolve(1);
      resolve(2);
      reject(boom());
    }),
  cycle: () => {
    const promise: PromiseCore<unknown> = new PromiseCore((resolve) =>
      resolve(1),
    ).then(() => promise);
    return promise;
  },
};

const buttons = document.querySelectorAll<HTMLButtonElement>("[data-example]");
const statusEl = document.querySelector(".promise-core__status")!;
const resultEl = document.querySelector(".promise-core__result")!;

const format = (value: unknown) =>
  value instanceof Error
    ? `${value.name}: ${value.message}`
    : JSON.stringify(value);

let current = 0;

const show = (id: number, status: string, result: string) => {
  if (id !== current) return;
  statusEl.textContent = status;
  resultEl.textContent = result;
};

const select = (button: HTMLButtonElement) => {
  buttons.forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
  const id = ++current;
  show(id, "pending", "—");
  startRun();
  EXAMPLES[button.dataset.example!]().then(
    (value) => show(id, "fulfilled", format(value)),
    (reason) => show(id, "rejected", format(reason)),
  );
};

buttons.forEach((button) =>
  button.addEventListener("click", () => select(button)),
);

select(document.querySelector<HTMLButtonElement>('[data-example="value"]')!);
