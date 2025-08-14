import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import { SvelteKitPWA } from '@vite-pwa/sveltekit'

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			injectRegister: null,
			strategies: 'generateSW',
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2,ttf}'],
			},
			devOptions: {
				enabled: true,
			},
		}),
	],
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
