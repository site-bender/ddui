/// <reference types="vitest" />

import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"~EditProfile": path.resolve(__dirname, "./src/EditProfile"),
			"~getComponent": path.resolve(__dirname, "./src/modules/getComponent"),
			"~icons": path.resolve(__dirname, "./src/modules/icons"),
			"~services": path.resolve(__dirname, "./src/services"),
			"~setup": path.resolve(__dirname, "./setup"),
			"~utilities": path.resolve(__dirname, "./src/utilities"),
			"~": path.resolve(__dirname, "."),
		},
	},
	test: {
		clearMocks: true,
		coverage: {
			reporter: ["html"],
			lines: 100,
		},
		environment: "jsdom",
		globals: true,
		setupFiles: "./setup/setupTests.ts",
	},
})
