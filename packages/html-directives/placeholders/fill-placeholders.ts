import escapeHtml from "escape-html";
import type { Scope } from "../types/index.ts";

const PLACEHOLDER = /\{\{\s*(\w+)\s*\}\}/g;

export const fillPlaceholders = (
  text: string,
  scope: Scope,
  escape: (value: string) => string = escapeHtml,
): string =>
  text.replace(PLACEHOLDER, (_, key: string) => {
    if (!(key in scope)) throw new Error(`Unknown key "${key}"`);
    return escape(String(scope[key]));
  });
