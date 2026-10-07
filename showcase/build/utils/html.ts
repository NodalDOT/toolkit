import type { Attributes } from "../types.ts";

const ATTRIBUTE = /([^\s=]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

export const parseAttributes = (source: string): Attributes =>
  new Map(
    [...source.matchAll(ATTRIBUTE)].map(
      ([, name, doubleQuoted, singleQuoted, unquoted]) => [
        name,
        doubleQuoted ?? singleQuoted ?? unquoted,
      ],
    ),
  );
