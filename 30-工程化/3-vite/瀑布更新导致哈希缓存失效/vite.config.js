import { defineConfig } from "vite";

export default defineConfig({
  // 开发服务器配置（按需改）
  server: {
    port: 5173,
    open: true,
  },
  // 构建配置（按需改）
  build: {
    // 生成 manifest，输出到 dist/.vite/manifest.json（便于分析 hash 级联）
    manifest: true,
    rollupOptions: {
      input: {
        main: "./src/main.js",
      },
      output: {
        entryFileNames: "[name].[hash].js",
      },
    },
  },
});
