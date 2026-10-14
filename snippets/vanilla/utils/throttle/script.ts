import { startRun } from "@toolkit/code-trace/runtime";
import { throttle } from "./throttle";

const DELAY = 500;

const input = document.querySelector<HTMLInputElement>(".throttle__input")!;
const burstButton = document.querySelector(".throttle__burst")!;
const callsEl = document.querySelector(".throttle__calls")!;
const firedEl = document.querySelector(".throttle__fired")!;
const lastEl = document.querySelector(".throttle__last")!;

let calls = 0;
let fired = 0;

const log = throttle((message: string) => {
  fired += 1;
  firedEl.textContent = String(fired);
  lastEl.textContent = JSON.stringify(message);
}, DELAY);

const call = (message: string) => {
  calls += 1;
  callsEl.textContent = String(calls);
  log(message);
};

input.addEventListener("input", () => {
  startRun();
  call(input.value);
});
burstButton.addEventListener("click", () => {
  startRun();
  ["a", "b", "c"].forEach(call);
});
