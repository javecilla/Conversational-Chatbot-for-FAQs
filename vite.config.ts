import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";

export default defineConfig({
  plugins: [vue()],
  css: {
    postcss: './postcss.config.js'
  },
  resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@global": path.resolve(__dirname, "./public/assets"),
		},
	},
})
