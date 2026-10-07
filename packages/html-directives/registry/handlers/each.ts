import type { Handler, HandlerContext } from "../../types/index.ts";

export class EachHandler implements Handler {
  async render({ node, data, renderContent }: HandlerContext): Promise<string> {
    const list = data[node.expression];

    if (!Array.isArray(list)) {
      throw new Error(`each: "${node.expression}" is not an array`);
    }

    const items = await Promise.all(
      list.map((item) => renderContent({ ...data, ...item })),
    );

    return items.join("");
  }
}
