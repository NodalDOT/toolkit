export type TType =
  | "null"
  | "undefined"
  | "string"
  | "number"
  | "boolean"
  | "symbol"
  | "bigint"
  | "object"
  | "array"
  | "function"
  | "date"
  | "regexp"
  | "map"
  | "set"
  | "weakmap"
  | "weakset"
  | "error"
  | "promise"
  | "arraybuffer"
  | string;

type ContainerType = "array" | "map" | "set" | "object";
type Container =
  | unknown[]
  | Map<unknown, unknown>
  | Set<unknown>
  | Record<string, unknown>;
type EntryCallback = (value: unknown, key: unknown) => void;
type Copies = WeakMap<object, unknown>;

const getType = (value: unknown): TType => {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (Object.getPrototypeOf(value) === null) return "object";
  return Object.getPrototypeOf(value)?.constructor?.name?.toLowerCase();
};

const createEmpty = (type: ContainerType): Container => {
  switch (type) {
    case "array":
      return [];
    case "map":
      return new Map();
    case "set":
      return new Set();
    case "object":
      return {};
  }
};

const forEachEntry = (container: Container, callback: EntryCallback) => {
  if (container instanceof Map || container instanceof Set) {
    container.forEach(callback);
    return;
  }
  Object.entries(container).forEach(([key, value]) => callback(value, key));
};

const setEntry = (container: Container, key: unknown, value: unknown) => {
  if (container instanceof Set) {
    container.add(value);
  } else if (container instanceof Map) {
    container.set(key, value);
  } else {
    (container as Record<string, unknown>)[key as string] = value;
  }
};

export function deepClone<T>(value: T, copies: Copies = new WeakMap()): T {
  if (typeof value === "object" && value !== null && copies.has(value)) {
    return copies.get(value) as T;
  }

  const type = getType(value);
  switch (type) {
    case "array":
    case "map":
    case "set":
    case "object": {
      const copy = createEmpty(type);
      copies.set(value as object, copy);
      forEachEntry(value as Container, (entryValue, key) => {
        setEntry(copy, key, deepClone(entryValue, copies));
      });
      return copy as T;
    }
    case "date":
      return new Date((value as Date).getTime()) as T;
    case "regexp": {
      const { source, flags } = value as RegExp;
      return new RegExp(source, flags) as T;
    }
    default:
      return value;
  }
}
