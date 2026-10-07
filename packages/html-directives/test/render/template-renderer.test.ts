import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { TemplateRenderer } from "../../render/template-renderer.ts";
import type { Handler, Handlers, Part } from "../../index.ts";

const echo = (directive: string): Handler => ({
  render: async ({ node }) => `[${directive}:${node.expression}]`,
});

const wrap: Handler = {
  render: async ({ node, data, renderContent }) =>
    `<${node.expression}>${await renderContent({ ...data, inner: "yes" })}</${node.expression}>`,
};

const handlers: Handlers = {
  each: wrap,
  content: echo("content"),
  icon: echo("icon"),
  script: echo("script"),
};

const renderer = new TemplateRenderer(handlers);

describe("TemplateRenderer", () => {
  test("renders empty parts as empty string", async () => {
    assert.equal(await renderer.render([], {}), "");
  });

  test("fills placeholders in text parts", async () => {
    assert.equal(
      await renderer.render(["<p>{{ a }}</p>"], { a: "x" }),
      "<p>x</p>",
    );
  });

  test("replaces nodes with handler result", async () => {
    const parts: Part[] = [
      "<p>",
      { directive: "icon", expression: "star", content: [] },
      "</p>",
    ];

    assert.equal(await renderer.render(parts, {}), "<p>[icon:star]</p>");
  });

  test("does not fill placeholders in handler result", async () => {
    const raw: Handlers = {
      ...handlers,
      icon: { render: async () => "{{ a }}" },
    };
    const parts: Part[] = [{ directive: "icon", expression: "x", content: [] }];

    assert.equal(await new TemplateRenderer(raw).render(parts, {}), "{{ a }}");
  });

  test("renders node content with scope from handler", async () => {
    const parts: Part[] = [
      {
        directive: "each",
        expression: "ul",
        content: [
          "{{ inner }}",
          { directive: "each", expression: "li", content: ["{{ outer }}"] },
        ],
      },
    ];

    assert.equal(
      await renderer.render(parts, { outer: "o" }),
      "<ul>yes<li>o</li></ul>",
    );
  });
});
