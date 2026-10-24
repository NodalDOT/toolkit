type Seen = Map<object, Set<object>>;

const cloneSeen = (seen: Seen): Seen =>
  new Map([...seen].map(([key, pairs]) => [key, new Set(pairs)]));

export function deepEquals(
  a: unknown,
  b: unknown,
  seen: Seen = new Map(),
): boolean {
  if (a === b) return true;
  if (Number.isNaN(a) && Number.isNaN(b)) return true;
  if (
    typeof a !== "object" ||
    typeof b !== "object" ||
    a === null ||
    b === null
  )
    return false;
  if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;

  const pairs = seen.get(a) ?? new Set<object>();
  if (pairs.has(b)) return true;
  seen.set(a, pairs.add(b));

  if (a instanceof RegExp && b instanceof RegExp)
    return a.source === b.source && a.flags === b.flags;
  if (a instanceof Date && b instanceof Date)
    return a.getTime() === b.getTime();

  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) return false;
    for (const [key, value] of a) {
      if (!b.has(key) || !deepEquals(value, b.get(key), seen)) return false;
    }
    return true;
  }

  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) return false;
    const unmatched = [...b];
    for (const value of a) {
      const index = unmatched.findIndex((other) =>
        deepEquals(value, other, cloneSeen(seen)),
      );
      if (index === -1) return false;
      unmatched.splice(index, 1);
    }
    return true;
  }

  const objA = a as Record<string, unknown>;
  const objB = b as Record<string, unknown>;
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!Object.hasOwn(objB, key) || !deepEquals(objA[key], objB[key], seen))
      return false;
  }

  return true;
}
