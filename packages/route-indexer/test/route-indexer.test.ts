import { describe, test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { z } from "zod";
import { routeIndexer } from "../index.ts";
import { sortIndex, withTree } from "./helpers.ts";
import type { Tree } from "./helpers.ts";

const validMeta = { title: "Title", order: 1 };

const levels = [
  {
    level: "segment",
    metaPath: "blog/meta.json",
    rest: { "blog/hello/meta.json": validMeta },
  },
  {
    level: "route",
    metaPath: "blog/hello/meta.json",
    rest: { "blog/meta.json": validMeta },
  },
];

const invalidMetaCases: { name: string; content: unknown; issues: string[] }[] =
  [
    {
      name: "title is missing",
      content: { order: 1 },
      issues: ["invalid_type:title"],
    },
    {
      name: "order is missing",
      content: { title: "Blog" },
      issues: ["invalid_type:order"],
    },
    {
      name: "meta is an empty object",
      content: {},
      issues: ["invalid_type:title", "invalid_type:order"],
    },
    {
      name: "title is empty",
      content: { title: "", order: 1 },
      issues: ["too_small:title"],
    },
    {
      name: "title is only whitespace",
      content: { title: "   ", order: 1 },
      issues: ["too_small:title"],
    },
    {
      name: "title is not a string",
      content: { title: 1, order: 1 },
      issues: ["invalid_type:title"],
    },
    {
      name: "order is a numeric string",
      content: { title: "Blog", order: "1" },
      issues: ["invalid_type:order"],
    },
    {
      name: "meta has an unknown key",
      content: { title: "Blog", order: 1, extra: true },
      issues: ["unrecognized_keys:"],
    },
    { name: "meta is null", content: "null", issues: ["invalid_type:"] },
    { name: "meta is an array", content: [], issues: ["invalid_type:"] },
  ];

const toIssueKeys = (error: z.ZodError) =>
  error.issues.map((issue) => `${issue.code}:${issue.path.join(".")}`);

const assertInvalidMeta = (
  error: unknown,
  metaFile: string,
  issues: string[],
) => {
  assert.ok(error instanceof Error);
  assert.ok(
    error.message.startsWith(`Invalid meta in ${metaFile}:\n`),
    error.message,
  );
  assert.ok(error.cause instanceof z.ZodError);
  assert.deepEqual(toIssueKeys(error.cause), issues);

  for (const issue of error.cause.issues.filter(({ path }) => path.length)) {
    assert.ok(
      error.message.includes(`→ at ${issue.path.join(".")}`),
      error.message,
    );
  }

  return true;
};

const assertInvalidJson = (error: unknown, metaFile: string) => {
  assert.ok(error instanceof Error);
  assert.ok(
    error.message.startsWith(`Invalid JSON in ${metaFile}: `),
    error.message,
  );
  assert.ok(error.cause instanceof SyntaxError);

  return true;
};

describe("routeIndexer", () => {
  test("builds segments with their routes from meta.json", () =>
    withTree(
      {
        "blog/meta.json": { title: "Blog", order: 2 },
        "blog/hello/meta.json": { title: "Hello", order: 1 },
        "blog/world/meta.json": { title: "World", order: 2 },
        "docs/meta.json": { title: "Docs", order: 1 },
        "docs/intro/meta.json": { title: "Intro", order: 1 },
      },
      async (root) => {
        assert.deepEqual(sortIndex(await routeIndexer(root)), [
          {
            name: "blog",
            title: "Blog",
            path: path.join(root, "blog"),
            order: 2,
            routes: [
              {
                name: "hello",
                title: "Hello",
                path: path.join(root, "blog/hello"),
                order: 1,
              },
              {
                name: "world",
                title: "World",
                path: path.join(root, "blog/world"),
                order: 2,
              },
            ],
          },
          {
            name: "docs",
            title: "Docs",
            path: path.join(root, "docs"),
            order: 1,
            routes: [
              {
                name: "intro",
                title: "Intro",
                path: path.join(root, "docs/intro"),
                order: 1,
              },
            ],
          },
        ]);
      },
    ));

  test("returns an empty index for an empty root", () =>
    withTree({}, async (root) => {
      assert.deepEqual(await routeIndexer(root), []);
    }));

  test("returns a segment without routes when it has no route folders", () =>
    withTree({ "blog/meta.json": validMeta }, async (root) => {
      const [segment] = await routeIndexer(root);

      assert.deepEqual(segment?.routes, []);
    }));

  test("ignores files next to segments and routes", () =>
    withTree(
      {
        "README.md": "# root",
        "blog/meta.json": validMeta,
        "blog/notes.txt": "notes",
        "blog/hello/meta.json": validMeta,
        "blog/hello/index.html": "<h1>Hello</h1>",
      },
      async (root) => {
        const index = await routeIndexer(root);

        assert.deepEqual(
          index.map((segment) => segment.name),
          ["blog"],
        );
        assert.deepEqual(
          index[0]?.routes.map((route) => route.name),
          ["hello"],
        );
      },
    ));

  test("rejects when the root does not exist", () =>
    withTree({}, async (root) => {
      await assert.rejects(routeIndexer(path.join(root, "missing")), {
        code: "ENOENT",
      });
    }));

  test("rejects when the root is a file", () =>
    withTree({ "file.txt": "text" }, async (root) => {
      await assert.rejects(routeIndexer(path.join(root, "file.txt")), {
        code: "ENOTDIR",
      });
    }));

  for (const { level, metaPath, rest } of levels) {
    describe(`meta.json of a ${level}`, () => {
      test("rejects when it is missing", () => {
        const dir = path.dirname(metaPath);
        const tree: Tree = { ...rest, [`${dir}/`]: "" };

        return withTree(tree, async (root) => {
          await assert.rejects(routeIndexer(root), {
            message: `Missing meta.json in ${path.join(root, dir)}`,
          });
        });
      });

      for (const { name, content, issues } of invalidMetaCases) {
        test(`rejects when ${name}`, () =>
          withTree({ ...rest, [metaPath]: content }, async (root) => {
            await assert.rejects(routeIndexer(root), (error) =>
              assertInvalidMeta(error, path.join(root, metaPath), issues),
            );
          }));
      }

      test("rejects when it is not valid JSON", () =>
        withTree({ ...rest, [metaPath]: "{ title: Blog" }, async (root) => {
          await assert.rejects(routeIndexer(root), (error) =>
            assertInvalidJson(error, path.join(root, metaPath)),
          );
        }));

      test("rejects when it is empty", () =>
        withTree({ ...rest, [metaPath]: "" }, async (root) => {
          await assert.rejects(routeIndexer(root), (error) =>
            assertInvalidJson(error, path.join(root, metaPath)),
          );
        }));
    });
  }
});
