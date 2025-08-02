import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [sveltekit()],
	ssr: {
		noExternal: ['@ai-sdk/google', '@ai-sdk/svelte', 'ai'],
	},
	optimizeDeps: {
		exclude: ['crypto'],
	},
	define: {
		global: 'globalThis',
	},
	resolve: {
		alias: {
			crypto: 'crypto-browserify',
		},
	},
})
