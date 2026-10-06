import { describe, test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { renderTemplate } from "../../index.ts";
import type { HandlerDirs, Scope } from "../../index.ts";

const fixtures = path.resolve(import.meta.dirname, "../fixtures");

const dirs: HandlerDirs = {
  iconsDir: path.join(fixtures, "icons"),
  contentDir: path.join(fixtures, "content"),
  scriptDir: path.join(fixtures, "scripts"),
};

const render = (html: string, data?: Scope) =>
  renderTemplate(html, { dirs, data });

describe("renderTemplate", () => {
  test("keeps text without directives", async () => {
    assert.equal(await render("<p>hi</p>"), "<p>hi</p>");
  });

  test("replaces icon directive with svg file", async () => {
    assert.equal(
      await render("<p>a</p><template data-html-icon='star'></template><p>b</p>"),
      '<p>a</p><svg id="star"></svg><p>b</p>',
    );
  });

  test("replaces content directive with html file", async () => {
    assert.equal(
      await render("<template data-html-content='footer'></template>"),
      "<p>footer</p>",
    );
  });

  test("wraps script directive into script tag", async () => {
    assert.equal(
      await render("<template data-html-script='hello'></template>"),
      '<script>console.log("hi")</script>',
    );
  });

  test("interpolates and escapes data", async () => {
    assert.equal(
      await render("<h1>{{ title }}</h1>", { title: "<A & B>" }),
      "<h1>&lt;A &amp; B&gt;</h1>",
    );
  });

  test("escapes quotes inside attributes", async () => {
    assert.equal(
      await render(`<button data-path='{{ path }}'></button>`, { path: `a'b"c` }),
      `<button data-path='a&#39;b&quot;c'></button>`,
    );
  });

  test("throws on unknown key", async () => {
    await assert.rejects(render("{{ missing }}"), /Unknown key "missing"/);
  });

  test("renders nested each", async () => {
    const source =
      "<ul><template data-html-each='items'><li>{{ title }}<template data-html-each='tags'>[{{ tag }}]</template></li></template></ul>";

    assert.equal(
      await render(source, {
        items: [
          { title: "A", tags: [{ tag: "x" }, { tag: "y" }] },
          { title: "B", tags: [] },
        ],
      }),
      "<ul><li>A[x][y]</li><li>B</li></ul>",
    );
  });

  test("keeps outer data visible inside each", async () => {
    assert.equal(
      await render(
        "<template data-html-each='items'>{{ prefix }}{{ title }};</template>",
        { prefix: "#", items: [{ title: "A" }, { title: "B" }] },
      ),
      "#A;#B;",
    );
  });

  test("renders directives inside each item", async () => {
    assert.equal(
      await render(
        "<template data-html-each='items'><li>{{ title }}<template data-html-icon='star'></template></li></template>",
        { items: [{ title: "A" }, { title: "B" }] },
      ),
      '<li>A<svg id="star"></svg></li><li>B<svg id="star"></svg></li>',
    );
  });

  test("throws on unknown directive", async () => {
    await assert.rejects(
      render("<template data-html-nope='x'></template>"),
      /Invalid directive: nope/,
    );
  });

  test("throws when each target is not an array", async () => {
    await assert.rejects(
      render("<template data-html-each='items'></template>", { items: "nope" }),
      /each: "items" is not an array/,
    );
  });
});
