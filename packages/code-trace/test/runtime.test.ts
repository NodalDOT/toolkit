import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { PROBE_FN } from "../instrument/wrap-probe.ts";

let instance = 0;

const freshRuntime = async () =>
  (await import(
    `../runtime/index.ts?${++instance}`
  )) as typeof import("../runtime/index.ts");

const endOfRun = () => Promise.resolve();

describe("runtime", () => {
  test("exports the function that instrumented code calls", async () => {
    const runtime: Record<string, unknown> = await freshRuntime();

    assert.equal(typeof runtime[PROBE_FN], "function");
  });

  test("returns the value unchanged", async () => {
    const { __trace$ } = await freshRuntime();
    const list = [1];

    assert.equal(__trace$(0, 42), 42);
    assert.equal(__trace$(1, list), list);
  });

  test("stores a snapshot string, not a live reference", async () => {
    const { __trace$, values } = await freshRuntime();
    const user = { name: "Ann" };

    __trace$(0, user);
    Object.assign(user, { age: 3 });

    assert.equal(values.get(0), "{ name }");
  });

  test("counts hits per probe", async () => {
    const { __trace$, hits } = await freshRuntime();

    __trace$(0, "a");
    __trace$(0, "b");
    __trace$(2, "c");

    assert.deepEqual(
      [...hits],
      [
        [0, 2],
        [2, 1],
      ],
    );
  });

  test("never throws on values it cannot describe", async () => {
    const { __trace$, values } = await freshRuntime();
    const hostile = new Proxy(
      {},
      {
        getPrototypeOf() {
          throw new Error("nope");
        },
      },
    );

    assert.equal(__trace$(0, hostile), hostile);
    assert.equal(values.get(0), "?");
  });

  test("notifies subscribers once per run", async () => {
    const { __trace$, subscribe } = await freshRuntime();
    let calls = 0;

    subscribe(() => (calls += 1));

    __trace$(0, 1);
    __trace$(1, 2);
    __trace$(0, 3);
    assert.equal(calls, 0);

    await endOfRun();
    assert.equal(calls, 1);

    __trace$(2, 4);
    await endOfRun();
    assert.equal(calls, 2);
  });

  test("unsubscribe stops notifications", async () => {
    const { __trace$, subscribe } = await freshRuntime();
    let calls = 0;

    const unsubscribe = subscribe(() => (calls += 1));
    unsubscribe();

    __trace$(0, 1);
    await endOfRun();

    assert.equal(calls, 0);
  });

  test("reset clears values, hits and run and notifies subscribers", async () => {
    const { __trace$, reset, subscribe, values, hits, run } =
      await freshRuntime();
    let calls = 0;

    __trace$(0, 1);
    await endOfRun();

    subscribe(() => (calls += 1));
    reset();
    await endOfRun();

    assert.equal(values.size, 0);
    assert.equal(hits.size, 0);
    assert.equal(run.size, 0);
    assert.equal(calls, 1);
  });

  test("collects the ids of the current run", async () => {
    const { __trace$, run } = await freshRuntime();

    __trace$(0, "a");
    __trace$(2, "b");
    __trace$(0, "c");

    assert.deepEqual([...run], [0, 2]);
  });

  test("startRun clears the run but keeps values and hits", async () => {
    const { __trace$, startRun, subscribe, run, values, hits } =
      await freshRuntime();
    let calls = 0;

    __trace$(0, "a");
    __trace$(1, "b");
    await endOfRun();

    subscribe(() => (calls += 1));
    startRun();
    __trace$(1, "c");
    await endOfRun();

    assert.deepEqual([...run], [1]);
    assert.deepEqual(
      [...hits],
      [
        [0, 1],
        [1, 2],
      ],
    );
    assert.equal(values.get(0), '"a"');
    assert.equal(calls, 1);
  });
});
