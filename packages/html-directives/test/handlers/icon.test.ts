import { describe, test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { IconHandler } from "../../index.ts";
import type { TemplateNode } from "../../index.ts";

const iconsDir = path.resolve(import.meta.dirname, "../fixtures/icons");
const icon = new IconHandler(iconsDir);

const iconNode = (expression: string): TemplateNode => ({
  directive: "icon",
  expression,
  content: [],
});

const renderIcon = (expression: string) =>
  icon.render({
    node: iconNode(expression),
    data: {},
    renderContent: async () => "",
  });

describe("IconHandler", () => {
  test("renders svg from icons dir", async () => {
    assert.match(await renderIcon("star"), /^\s*<svg[\s\S]*<\/svg>\s*$/);
  });

  test("rejects unknown icon", async () => {
    await assert.rejects(renderIcon("nope"), { code: "ENOENT" });
  });
});
