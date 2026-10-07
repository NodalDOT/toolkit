import { parseOpenTag } from "./parse-open-tag.ts";
import type { OpenNode, Part } from "../types/index.ts";

const OPEN_TAG_PREFIX = "<template data-html";
const CLOSE_TAG = "</template>";

const pushText = (parts: Part[], text: string) => {
  if (text) parts.push(text);
};

export const buildTree = (source: string): Part[] => {
  const roots: Part[] = [];
  const stack: OpenNode[] = [];
  let cursor = 0;

  while (true) {
    const nextOpen = source.indexOf(OPEN_TAG_PREFIX, cursor);
    const nextClose = source.indexOf(CLOSE_TAG, cursor);

    const openNode = stack.at(-1);
    const currentContent = openNode ? openNode.node.content : roots;

    const hasNoTagsLeft = nextOpen === -1 && nextClose === -1;

    if (hasNoTagsLeft) {
      pushText(currentContent, source.slice(cursor));
      break;
    }

    const isOpenTagFirst =
      nextOpen !== -1 && (nextClose === -1 || nextOpen < nextClose);

    if (isOpenTagFirst) {
      pushText(currentContent, source.slice(cursor, nextOpen));

      const { node, tagEnd } = parseOpenTag(nextOpen, source);
      currentContent.push(node);
      stack.push({ node, start: nextOpen });
      cursor = tagEnd;
    } else {
      if (!stack.length) throw Error(`Unmatched close tag at ${nextClose}`);

      pushText(currentContent, source.slice(cursor, nextClose));
      stack.pop();
      cursor = nextClose + CLOSE_TAG.length;
    }
  }

  const unclosed = stack.at(-1);
  if (unclosed) throw Error(`Unmatched open tag at ${unclosed.start}`);
  return roots;
};
