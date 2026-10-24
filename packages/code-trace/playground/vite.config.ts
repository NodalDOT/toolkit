import { codeTrace } from "@toolkit/code-trace/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [codeTrace()],
});
