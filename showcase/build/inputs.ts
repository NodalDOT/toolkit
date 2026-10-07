import { SNIPPETS_DIR, ENTRY_HTML } from "../config/index.ts";
import type { Inputs } from "./types.ts";
import { getCatalogInputs } from "./utils/catalog.ts";

export const getInputs = async (): Promise<Inputs> => ({
  main: ENTRY_HTML,
  ...(await getCatalogInputs(SNIPPETS_DIR)),
});
