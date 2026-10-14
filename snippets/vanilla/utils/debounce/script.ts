import { startRun } from "@toolkit/code-trace/runtime";
import { debounce } from "./debounce";

const DELAY = 500;

const input = document.querySelector<HTMLInputElement>(".debounce__input")!;
const burstButton = document.querySelector(".debounce__burst")!;
const callsEl = document.querySelector(".debounce__calls")!;
const firedEl = document.querySelector(".debounce__fired")!;
const lastEl = document.querySelector(".debounce__last")!;

let calls = 0;
let fired = 0;

const log = debounce((message: string) => {
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
