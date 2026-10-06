import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { fillPlaceholders } from "../../render/fill-placeholders.ts";

describe("fillPlaceholders", () => {
  test("keeps text without placeholders", () => {
    assert.equal(fillPlaceholders("<p>hi</p>", {}), "<p>hi</p>");
  });

  test("replaces every placeholder with its value", () => {
    assert.equal(
      fillPlaceholders("{{ a }}-{{a}}-{{   b   }}", { a: 1, b: "x" }),
      "1-1-x",
    );
  });

  test("escapes html in values", () => {
    assert.equal(
      fillPlaceholders("{{ value }}", { value: `<b>'&"</b>` }),
      "&lt;b&gt;&#39;&amp;&quot;&lt;/b&gt;",
    );
  });

  test("throws on unknown key", () => {
    assert.throws(() => fillPlaceholders("{{ missing }}", {}), /Unknown key "missing"/);
  });
});
