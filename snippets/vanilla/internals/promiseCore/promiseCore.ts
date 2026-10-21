type Resolve<T> = (resolution: T | PromiseLike<T>) => void;
type Reject = (reason?: unknown) => void;
type Executor<T> = (resolve: Resolve<T>, reject: Reject) => void;
type Reaction = (result: unknown) => void;

type OnFulfilled<T, R> = ((value: T) => R | PromiseLike<R>) | null | undefined;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OnRejected<R> = ((reason: any) => R | PromiseLike<R>) | null | undefined;

type PromiseStatus = "pending" | "fulfilled" | "rejected";

const PENDING: PromiseStatus = "pending";
const FULFILLED: PromiseStatus = "fulfilled";
const REJECTED: PromiseStatus = "rejected";

const isObject = (value: unknown): value is object =>
  (typeof value === "object" && value !== null) || typeof value === "function";

export class PromiseCore<T> implements PromiseLike<T> {
  #status: PromiseStatus = PENDING;
  #result: unknown = undefined;

  #fulfillReactions: Reaction[] = [];
  #rejectReactions: Reaction[] = [];

  constructor(executor: Executor<T>) {
    if (typeof executor !== "function") {
      throw new TypeError("Executor must be a function");
    }

    const { resolve, reject } = this.#createResolvingFunctions();

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  #settle(status: PromiseStatus, result: unknown, reactions: Reaction[]) {
    this.#status = status;
    this.#result = result;
    this.#fulfillReactions = [];
    this.#rejectReactions = [];
    reactions.forEach((reaction) => queueMicrotask(() => reaction(result)));
  }

  #fulfill(value: unknown) {
    this.#settle(FULFILLED, value, this.#fulfillReactions);
  }

  #reject(reason: unknown) {
    this.#settle(REJECTED, reason, this.#rejectReactions);
  }

  #createResolvingFunctions(): { resolve: Resolve<unknown>; reject: Reject } {
    let alreadyResolved = false;

    const resolve: Resolve<unknown> = (resolution) => {
      if (alreadyResolved) return;
      alreadyResolved = true;

      if (resolution === this) {
        this.#reject(new TypeError("Chaining cycle detected"));
        return;
      }
      if (!isObject(resolution)) {
        this.#fulfill(resolution);
        return;
      }

      let then: unknown;
      try {
        then = (resolution as { then?: unknown }).then;
      } catch (error) {
        this.#reject(error);
        return;
      }
      if (typeof then !== "function") {
        this.#fulfill(resolution);
        return;
      }

      const adopt = then;
      queueMicrotask(() => {
        const { resolve, reject } = this.#createResolvingFunctions();
        try {
          adopt.call(resolution, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
    };

    const reject: Reject = (reason) => {
      if (alreadyResolved) return;
      alreadyResolved = true;
      this.#reject(reason);
    };

    return { resolve, reject };
  }

  then<R1 = T, R2 = never>(
    onFulfilled?: OnFulfilled<T, R1>,
    onRejected?: OnRejected<R2>,
  ): PromiseCore<R1 | R2> {
    let resolveNext!: Resolve<R1 | R2>;
    let rejectNext!: Reject;
    const next = new PromiseCore<R1 | R2>((resolve, reject) => {
      resolveNext = resolve;
      rejectNext = reject;
    });

    const runFulfilled: Reaction = (value) => {
      if (typeof onFulfilled !== "function") {
        resolveNext(value as R1);
        return;
      }
      try {
        resolveNext(onFulfilled(value as T));
      } catch (error) {
        rejectNext(error);
      }
    };

    const runRejected: Reaction = (reason) => {
      if (typeof onRejected !== "function") {
        rejectNext(reason);
        return;
      }
      try {
        resolveNext(onRejected(reason));
      } catch (error) {
        rejectNext(error);
      }
    };

    if (this.#status === PENDING) {
      this.#fulfillReactions.push(runFulfilled);
      this.#rejectReactions.push(runRejected);
    } else {
      const reaction = this.#status === FULFILLED ? runFulfilled : runRejected;
      const result = this.#result;
      queueMicrotask(() => reaction(result));
    }

    return next;
  }

  catch<R = never>(onRejected?: OnRejected<R>): PromiseCore<T | R> {
    return this.then(undefined, onRejected);
  }
}
