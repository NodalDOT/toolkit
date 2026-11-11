import type { Stock } from "./types";

export const defaultComparator =
  (columnId: keyof Stock, direction: "asc" | "desc") =>
  (a: Stock, b: Stock): number => {
    const modifier = direction === "asc" ? 1 : -1;
    if (typeof a[columnId] === "string" && typeof b[columnId] === "string") {
      return a[columnId].localeCompare(b[columnId]) * modifier;
    }
    if (typeof a[columnId] === "number" && typeof b[columnId] === "number") {
      return (a[columnId] - b[columnId]) * modifier;
    }
    return 0;
  };
