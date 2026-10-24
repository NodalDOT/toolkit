type Seen = WeakSet<object>;

export const getType = (value: unknown): string => {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (Object.getPrototypeOf(value) === null) return "object";
  return (
    Object.getPrototypeOf(value)?.constructor?.name?.toLowerCase() ?? "object"
  );
};

const stringifyEntries = (entries: string[], open = "{", close = "}") =>
  entries.length ? `${open} ${entries.join(", ")} ${close}` : `${open}${close}`;

const stringifyObject = (value: object, seen: Seen): string => {
  if (seen.has(value)) return "[Circular]";
  seen.add(value);

  let result: string;
  if (Array.isArray(value)) {
    result = `[${value.map((item) => stringify(item, seen)).join(", ")}]`;
  } else if (value instanceof Map) {
    const entries = [...value].map(
      ([key, item]) => `${stringify(key, seen)} => ${stringify(item, seen)}`,
    );
    result = `Map(${value.size}) ${stringifyEntries(entries)}`;
  } else if (value instanceof Set) {
    const entries = [...value].map((item) => stringify(item, seen));
    result = `Set(${value.size}) ${stringifyEntries(entries)}`;
  } else {
    const entries = Object.entries(value).map(
      ([key, item]) => `${key}: ${stringify(item, seen)}`,
    );
    const name = Object.getPrototypeOf(value)?.constructor?.name;
    const prefix = name && name !== "Object" ? `${name} ` : "";
    result = `${prefix}${stringifyEntries(entries)}`;
  }

  seen.delete(value);
  return result;
};

export function stringify(value: unknown, seen: Seen = new WeakSet()): string {
  switch (getType(value)) {
    case "null":
    case "undefined":
    case "number":
    case "boolean":
    case "symbol":
      return String(value);
    case "bigint":
      return `${value}n`;
    case "string":
      return JSON.stringify(value);
    case "date": {
      const date = value as Date;
      return Number.isNaN(date.getTime()) ? "Invalid Date" : date.toISOString();
    }
    case "regexp":
      return String(value);
    default:
      if (typeof value === "function")
        return `[Function ${value.name || "(anonymous)"}]`;
      if (value instanceof Error) return `${value.name}: ${value.message}`;
      return stringifyObject(value as object, seen);
  }
}
