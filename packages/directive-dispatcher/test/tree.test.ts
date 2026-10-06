import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { buildTree } from "../index.ts";
import type { Part, TemplateNode } from "../types/index.ts";

const nodesOf = (parts: Part[]): TemplateNode[] =>
  parts.filter((part) => typeof part !== "string");

const source = `
<template data-html-content='content'></template>

<template data-html-icon='icon'></template>

<template data-html-script='restore-state'></template>

<template data-html-each='item'>
<li>
      <button data-path="{{ path }}">
        {{ title }}
        <template data-html-each='itemTwo'>
          {{ data }}
        </template>
      </button>
    </li>
</template>
`;

describe("buildTree", () => {
  test("collects root directives in order", () => {
    const roots = nodesOf(buildTree(source));

    assert.deepEqual(
      roots.map(({ directive, expression }) => [directive, expression]),
      [
        ["content", "content"],
        ["icon", "icon"],
        ["script", "restore-state"],
        ["each", "item"],
      ],
    );
  });

  test("nests inner template into its parent", () => {
    const [, , , item] = nodesOf(buildTree(source));
    const [itemTwo] = nodesOf(item.content);

    assert.equal(nodesOf(item.content).length, 1);
    assert.equal(itemTwo.expression, "itemTwo");
    assert.deepEqual(itemTwo.content, ["\n          {{ data }}\n        "]);
  });

  test("keeps text and nodes in order", () => {
    assert.deepEqual(
      buildTree(
        "<h1>A</h1><template data-html-each='x'><li>B</li></template><p>C</p>",
      ),
      [
        "<h1>A</h1>",
        { directive: "each", expression: "x", content: ["<li>B</li>"] },
        "<p>C</p>",
      ],
    );
  });

  test("skips empty text between tags", () => {
    assert.deepEqual(
      buildTree(
        "<template data-html-icon='a'></template><template data-html-icon='b'></template>",
      ),
      [
        { directive: "icon", expression: "a", content: [] },
        { directive: "icon", expression: "b", content: [] },
      ],
    );
  });

  test("keeps plain text without directives", () => {
    assert.deepEqual(buildTree("<p>hi</p>"), ["<p>hi</p>"]);
  });

  test("throws on unmatched close tag", () => {
    assert.throws(
      () => buildTree("</template>"),
      /Unmatched close tag at 0/,
    );
  });

  test("throws on open tag without close tag", () => {
    assert.throws(
      () => buildTree("<template data-html-icon='x'>"),
      /Unmatched open tag at 0/,
    );
  });

  test("throws on open tag after the last close tag", () => {
    assert.throws(
      () =>
        buildTree(
          "<template data-html-icon='x'></template><template data-html-each='y'>",
        ),
      /Unmatched open tag at 40/,
    );
  });

  test("reports the innermost unclosed tag", () => {
    assert.throws(
      () =>
        buildTree(
          "<template data-html-each='a'><template data-html-each='b'>",
        ),
      /Unmatched open tag at 29/,
    );
  });
});
