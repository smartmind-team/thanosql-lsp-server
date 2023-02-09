import path from "path";
import { defineConfig } from "vite";
import rollupPolyfill from "rollup-plugin-polyfill-node";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";

const config = defineConfig({
  optimizeDeps: {
    exclude: ["../thanosql-language-service"],
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis",
      },
      // Enable esbuild polyfill plugins
      plugins: [NodeGlobalsPolyfillPlugin(), NodeModulesPolyfillPlugin()],
    },
  },
  build: {
    target: "es6",
    lib: {
      entry: [path.resolve(__dirname, "./src/thanosWorker.ts")],
      name: "thanosWorker",
      fileName: (format) => `thanosWorker-${format}.js`,
      formats: ["es", "iife"],
    },
    outDir: "dist/workers",
    emptyOutDir: false,
    rollupOptions: {
      plugins: [rollupPolyfill()],
    },
  },
});

export default config;
