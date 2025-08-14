<script lang="ts">
	import '../app.css';
	import { themeStore } from '$lib/stores/theme';
	import { Toaster } from '$lib/components/ui/sonner';
	import { onMount } from 'svelte';
	let { children } = $props();

	onMount(async () => {
		themeStore.initialize();
		if (typeof window !== 'undefined') {
			const { registerSW } = await import('virtual:pwa-register');
			registerSW({ immediate: true });
		}
	});
</script>

<svelte:head>
	<link rel="manifest" href="/manifest.webmanifest" />
	<meta name="theme-color" content="#ffffff" />
	<link rel="apple-touch-icon" href="/favicon.png" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	<meta name="apple-mobile-web-app-title" content="Dotmeyia" />
</svelte:head>

<Toaster />
{@render children()}
