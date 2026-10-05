import { parseOpenTag } from "./parse-open-tag.ts";
import type { TemplateNode } from "./types.ts";

const OPEN_TAG_PREFIX = "<template data-html";
const CLOSE_TAG = "</template>";

export const buildDirectiveTree = (source: string): TemplateNode[] => {
  const stack: TemplateNode[] = [];
  const roots: TemplateNode[] = [];

  let cursor = 0;
  while (cursor < source.length) {
    const nextOpen = source.indexOf(OPEN_TAG_PREFIX, cursor);
    const nextClose = source.indexOf(CLOSE_TAG, cursor);
    if (nextOpen === -1 && nextClose === -1) {
      break;
    }
    if (nextOpen !== -1 && (nextClose === -1 || nextOpen < nextClose)) {
      const openNode = parseOpenTag(nextOpen, source);
      const parent = stack[stack.length - 1];
      if (!parent) {
        roots.push(openNode);
      } else {
        parent.children.push(openNode);
      }
      stack.push(openNode);
      cursor = openNode.contentStart;
    } else {
      const node = stack.pop();
      if (!node) throw Error(`Unmatched close tag at ${nextClose}`);
      node.contentEnd = nextClose;
      node.end = nextClose + CLOSE_TAG.length;
      cursor = node.end;
    }
  }
  const unclosed = stack[stack.length - 1];
  if (unclosed) throw Error(`Unmatched open tag at ${unclosed.start}`);
  return roots;
};
