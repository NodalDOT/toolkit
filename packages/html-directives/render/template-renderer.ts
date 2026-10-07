import type { Handlers, Part, Scope, TemplateNode } from "../types/index.ts";
import { fillPlaceholders } from "./fill-placeholders.ts";

export class TemplateRenderer {
  private readonly handlers: Handlers;

  constructor(handlers: Handlers) {
    this.handlers = handlers;
  }

  async render(parts: Part[], scope: Scope): Promise<string> {
    let result = "";

    for (const part of parts) {
      result +=
        typeof part === "string"
          ? fillPlaceholders(part, scope)
          : await this.renderNode(part, scope);
    }

    return result;
  }

  private renderNode(node: TemplateNode, scope: Scope): Promise<string> {
    return this.handlers[node.directive].render({
      node,
      data: scope,
      renderContent: (innerScope) => this.render(node.content, innerScope),
    });
  }
}
