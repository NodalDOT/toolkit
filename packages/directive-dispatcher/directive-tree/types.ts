export const TEMPLATE_DIRECTIVES = ["each", "content", "icon", "script"] as const;

export type TemplateDirective = (typeof TEMPLATE_DIRECTIVES)[number];

export interface TemplateNode {
  directive: TemplateDirective;
  expression: string;

  start: number;
  contentStart: number;
  contentEnd: number;
  end: number;

  children: TemplateNode[];
}
