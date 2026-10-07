import type { TemplateDirective, TemplateNode } from "./tree.ts";

export type Scope = Record<string, unknown>;

export type HandlerContext = {
  node: TemplateNode;
  data: Scope;
  renderContent: (data: Scope) => Promise<string>;
};

export interface Handler {
  render(context: HandlerContext): Promise<string>;
}

export type Handlers = Record<TemplateDirective, Handler>;

export type HandlerDirs = {
  iconsDir: string;
  contentDir: string;
  scriptDir: string;
};
