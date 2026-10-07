import type { HandlerDirs, Handlers } from "../types/index.ts";
import { ContentHandler } from "./handlers/content.ts";
import { EachHandler } from "./handlers/each.ts";
import { IconHandler } from "./handlers/icon.ts";
import { ScriptHandler } from "./handlers/script.ts";

export const HANDLERS = {
  each: EachHandler,
  content: ContentHandler,
  icon: IconHandler,
  script: ScriptHandler,
};

export const createHandlers = ({
  iconsDir,
  contentDir,
  scriptDir,
}: HandlerDirs): Handlers => ({
  each: new EachHandler(),
  content: new ContentHandler(contentDir),
  icon: new IconHandler(iconsDir),
  script: new ScriptHandler(scriptDir),
});

export { ContentHandler, EachHandler, IconHandler, ScriptHandler };
