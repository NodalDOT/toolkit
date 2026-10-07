import { HANDLERS } from "../registry/index.ts";

export type TemplateDirective = keyof typeof HANDLERS;

export const TEMPLATE_DIRECTIVES = Object.keys(HANDLERS) as TemplateDirective[];

export interface TemplateNode {
  directive: TemplateDirective;
  expression: string;

  content: Part[];
}
export type Part = string | TemplateNode;

export type ParsedOpenTag = {
  node: TemplateNode;
  tagEnd: number;
};

export type OpenNode = {
  node: TemplateNode;
  start: number;
};
