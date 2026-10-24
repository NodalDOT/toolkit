import type { Probe } from "../types.ts";

export const PROBE_FN = "__trace$";

const PROBE_START = (id: number) => `${PROBE_FN}(${id}, (`;
const PROBE_END = "))";

type Insert =
  | { at: number; text: string; isOpen: false }
  | { at: number; text: string; isOpen: true; end: number };

const byPosition = (a: Insert, b: Insert) => {
  if (a.at !== b.at) return a.at - b.at;
  if (!a.isOpen || !b.isOpen) return Number(a.isOpen) - Number(b.isOpen);
  return b.end - a.end;
};

export const wrap = (source: string, probes: Probe[]) => {
  const sortedInserts = probes
    .flatMap(({ start, end }, id): Insert[] => [
      { at: start, text: PROBE_START(id), isOpen: true, end },
      { at: end, text: PROBE_END, isOpen: false },
    ])
    .sort(byPosition);

  let result = "";
  let cursor = 0;
  for (const { at, text } of sortedInserts) {
    result += source.slice(cursor, at) + text;
    cursor = at;
  }
  return result + source.slice(cursor);
};
