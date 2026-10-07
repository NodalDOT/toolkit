import { defineConfig } from "vite";
import { DIST_DIR, ROOT_DIR, SRC_DIR, getConfig } from "./config/index.ts";
import { createPlugins, getDefine, getInputs } from "./tools/vite/index.ts";

export default defineConfig(async ({ command, mode }) => {
  const { base, port } = getConfig();

  return {
    root: SRC_DIR,
    envDir: ROOT_DIR,
    base,
    define: getDefine(),
    plugins: createPlugins({ command, mode }),
    server: { port },
    preview: { port },
    build: {
      outDir: DIST_DIR,
      emptyOutDir: true,
      rolldownOptions: {
        input: await getInputs(),
      },
    },
  };
});
