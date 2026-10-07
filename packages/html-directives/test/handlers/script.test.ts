import { describe, test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { ScriptHandler } from "../../index.ts";
import type { TemplateNode } from "../../index.ts";

const scriptDir = path.resolve(import.meta.dirname, "../fixtures/scripts");
const script = new ScriptHandler(scriptDir);

const scriptNode = (expression: string): TemplateNode => ({
  directive: "script",
  expression,
  content: [],
});

const renderScript = (expression: string) =>
  script.render({
    node: scriptNode(expression),
    data: {},
    renderContent: async () => "",
  });

describe("ScriptHandler", () => {
  test("wraps file content into script tag", async () => {
    assert.equal(
      await renderScript("hello"),
      '<script>console.log("hi")</script>',
    );
  });

  test("rejects code with closing script tag", async () => {
    await assert.rejects(
      renderScript("closing-tag"),
      /closing-tag\.js can't be inlined: it contains <\/script/,
    );
  });

  test("rejects closing script tag in any case", async () => {
    await assert.rejects(
      renderScript("closing-tag-uppercase"),
      /can't be inlined/,
    );
  });

  test("rejects unknown script", async () => {
    await assert.rejects(renderScript("nope"), { code: "ENOENT" });
  });
});
