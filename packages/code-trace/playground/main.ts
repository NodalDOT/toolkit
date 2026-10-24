import { startRun } from "@toolkit/code-trace/runtime";
import { check } from "./example.ts";

const input = document.querySelector("input")!;

input.addEventListener("input", () => {
  startRun();
  check(Number(input.value));
});
