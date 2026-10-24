import { describe } from "./describe.ts";

export const values = new Map<number, string>();
export const hits = new Map<number, number>();
export const run = new Set<number>();

const listeners = new Set<() => void>();
let isScheduled = false;

const notify = () => {
  isScheduled = false;
  listeners.forEach((listener) => listener());
};

const schedule = () => {
  if (isScheduled) return;
  isScheduled = true;
  queueMicrotask(notify);
};

const snapshot = (value: unknown) => {
  try {
    return describe(value);
  } catch {
    return "?";
  }
};

export const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const startRun = () => {
  run.clear();
  schedule();
};

export const reset = () => {
  values.clear();
  hits.clear();
  run.clear();
  schedule();
};

export const __trace$ = <T>(id: number, value: T) => {
  values.set(id, snapshot(value));
  hits.set(id, (hits.get(id) ?? 0) + 1);
  run.add(id);
  schedule();
  return value;
};
