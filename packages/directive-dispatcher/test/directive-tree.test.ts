import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { buildDirectiveTree } from "../index.ts";

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

describe("buildDirectiveTree", () => {
  test("collects root directives in order", () => {
    const roots = buildDirectiveTree(source);

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
    const [, , , item] = buildDirectiveTree(source);
    const [itemTwo] = item.children;

    assert.equal(item.children.length, 1);
    assert.equal(itemTwo.expression, "itemTwo");
    assert.equal(
      source.slice(itemTwo.contentStart, itemTwo.contentEnd).trim(),
      "{{ data }}",
    );
    assert.ok(source.slice(itemTwo.start, itemTwo.end).endsWith("</template>"));
  });

  test("throws on unmatched close tag", () => {
    assert.throws(
      () => buildDirectiveTree("</template>"),
      /Unmatched close tag at 0/,
    );
  });

  test("throws on open tag without close tag", () => {
    assert.throws(
      () => buildDirectiveTree("<template data-html-icon='x'>"),
      /Unmatched open tag at 0/,
    );
  });

  test("throws on open tag after the last close tag", () => {
    assert.throws(
      () =>
        buildDirectiveTree(
          "<template data-html-icon='x'></template><template data-html-each='y'>",
        ),
      /Unmatched open tag at 40/,
    );
  });

  test("reports the innermost unclosed tag", () => {
    assert.throws(
      () =>
        buildDirectiveTree(
          "<template data-html-each='a'><template data-html-each='b'>",
        ),
      /Unmatched open tag at 29/,
    );
  });
});
