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

export const detectType = (value: unknown): TType => {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (Object.getPrototypeOf(value) === null) return "object";
  return Object.getPrototypeOf(value)?.constructor?.name?.toLowerCase();
};
