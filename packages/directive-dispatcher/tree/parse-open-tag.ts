import { TEMPLATE_DIRECTIVES, type TemplateDirective, type TemplateNode } from "../types/index.ts";

const isTemplateDirective = (
  directive: string,
): directive is TemplateDirective => {
  return (TEMPLATE_DIRECTIVES as readonly string[]).includes(directive);
};

export const parseOpenTag = (
  tagStart: number,
  source: string,
): { node: TemplateNode; tagEnd: number } => {
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
    content: [],
  };

  return { node, tagEnd };
};
