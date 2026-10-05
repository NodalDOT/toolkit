import { TEMPLATE_DIRECTIVES } from "./types.ts";
import type { TemplateDirective, TemplateNode } from "./types.ts";

const isTemplateDirective = (
  directive: string,
): directive is TemplateDirective => {
  return (TEMPLATE_DIRECTIVES as readonly string[]).includes(directive);
};

export const parseOpenTag = (
  tagStart: number,
  source: string,
): TemplateNode => {
  const tagEnd = source.indexOf(">", tagStart) + 1;

  const openTag = source.slice(tagStart, tagEnd);

  const match = openTag.match(
    /data-html-(?<directive>\w+)=(['"])(?<expression>.*?)\2/,
  );
  if (!match?.groups) throw Error(`Invalid open tag: ${openTag}`);
  const { directive, expression } = match.groups;

  if (!isTemplateDirective(directive))
    throw Error(`Invalid directive: ${directive}`);

  const node: TemplateNode = {
    directive,
    expression,
    start: tagStart,
    contentStart: tagEnd,
    contentEnd: -1,
    end: -1,
    children: [],
  };

  return node;
};
