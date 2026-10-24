import { describe as suite, test } from "node:test";
import assert from "node:assert/strict";
import { describe } from "../runtime/describe.ts";

class Point {}

suite("describe", () => {
  test("primitives", () => {
    assert.equal(describe("abc"), '"abc"');
    assert.equal(describe(42), "42");
    assert.equal(describe(10n), "10n");
    assert.equal(describe(true), "true");
    assert.equal(describe(null), "null");
    assert.equal(describe(undefined), "undefined");
    assert.equal(describe(Symbol("id")), "Symbol(id)");
  });

  test("functions show their name", () => {
    const debounced = () => {};

    assert.equal(describe(debounced), "ƒ debounced");
    assert.equal(describe(Array), "ƒ Array");
  });

  test("collections show their size", () => {
    assert.equal(describe([1, "a", [2]]), "Array(3)");
    assert.equal(describe(new Map([[1, 2]])), "Map(1)");
    assert.equal(describe(new Set()), "Set(0)");
  });

  test("plain objects show their keys", () => {
    assert.equal(describe({ a: 1, b: 2 }), "{ a, b }");
    assert.equal(describe({}), "{}");
  });

  test("errors and class instances", () => {
    assert.equal(describe(new Error("boom")), "Error: boom");
    assert.equal(describe(new Point()), "Point");
    assert.equal(describe(/ab+/g), "RegExp");
    assert.equal(describe(Object.create(null)), "{…}");
  });

  test("long values are truncated to 32 characters", () => {
    const text = describe("x".repeat(100));

    assert.equal(text.length, 32);
    assert.ok(text.endsWith("…"));
  });

  test("long key lists are truncated the same way as full ones", () => {
    const value = Object.fromEntries(
      Array.from({ length: 50 }, (_, i) => [`key${i}`, i]),
    );
    const full = `{ ${Object.keys(value).join(", ")} }`;

    assert.equal(describe(value), `${full.slice(0, 31)}…`);
  });
});
