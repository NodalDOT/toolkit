import { describe, test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { readMeta } from "../src/meta.ts";
import { withTree } from "./helpers.ts";

describe("readMeta", () => {
  test("returns parsed meta", () =>
    withTree({ "meta.json": { title: "Blog", order: 3 } }, async (root) => {
      assert.deepEqual(await readMeta(root), { title: "Blog", order: 3 });
    }));

  test("accepts negative and fractional order", () =>
    withTree({ "meta.json": { title: "Blog", order: -1.5 } }, async (root) => {
      assert.deepEqual(await readMeta(root), { title: "Blog", order: -1.5 });
    }));

  test("trims the title", () =>
    withTree({ "meta.json": { title: "  Blog  ", order: 1 } }, async (root) => {
      assert.deepEqual(await readMeta(root), { title: "Blog", order: 1 });
    }));

  test("keeps the original error as the cause when meta.json is missing", () =>
    withTree({}, async (root) => {
      await assert.rejects(readMeta(root), (error) => {
        assert.ok(error instanceof Error);
        assert.ok(error.cause instanceof Error);
        assert.equal((error.cause as NodeJS.ErrnoException).code, "ENOENT");
        return true;
      });
    }));

  test("names the folder when meta.json is missing", () =>
    withTree({}, async (root) => {
      await assert.rejects(readMeta(root), {
        message: `Missing meta.json in ${root}`,
      });
    }));

  test("names the folder when the folder itself is missing", () =>
    withTree({}, async (root) => {
      const dir = path.join(root, "missing");

      await assert.rejects(readMeta(dir), {
        message: `Missing meta.json in ${dir}`,
      });
    }));

  test("passes through file system errors other than a missing file", () =>
    withTree({ "meta.json/": "" }, async (root) => {
      await assert.rejects(readMeta(root), { code: "EISDIR" });
    }));
});
