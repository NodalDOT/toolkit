import { defineConfig } from "vite";
import { DIST_DIR, ROOT_DIR, getConfig } from "./showcase/config/index.ts";
import { createPlugins, getDefine, getInputs } from "./showcase/build/index.ts";

export default defineConfig(async ({ command, mode }) => {
  const { base, port } = getConfig();

  return {
    root: ROOT_DIR,
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
