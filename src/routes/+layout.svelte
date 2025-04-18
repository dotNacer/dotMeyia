<script lang="ts">
	import '../app.css';
	import { themeStore } from '$lib/stores/theme';
	import { onMount } from 'svelte';
	let { children } = $props();

	onMount(() => {
		themeStore.initialize();
	});
</script>

{@render children()}
