import { defineConfig } from "tsup";

export default defineConfig({
  dts: true,
  entry: ["src/index.ts", "src/cli.ts"],
  format: ["cjs", "esm"],
  minify: true,
  sourcemap: false,
});
