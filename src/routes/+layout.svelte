<script lang="ts">
	import '../app.css';
	import { themeStore } from '$lib/stores/theme';
	import { Toaster } from '$lib/components/ui/sonner';
	import { onMount } from 'svelte';
	let { children } = $props();

	onMount(() => {
		themeStore.initialize();
	});
</script>

<Toaster />
{@render children()}
