import vue from "@vitejs/plugin-vue";
import WindiCSS from "vite-plugin-windicss";

export default {
  plugins: [vue(), WindiCSS()],
  define: {
    "process.env": {},
  },
  build: {
    outDir: "../backend/public",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    https: true,
  },
};
