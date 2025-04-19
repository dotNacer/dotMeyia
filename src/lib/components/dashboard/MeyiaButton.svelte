<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Sparkles, X } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	let isOpen = $state(false);
</script>

{#if isOpen}
	<div
		class=" absolute bottom-4 right-4 h-[calc(100vh-2rem)] w-[30rem] border"
		transition:fly={{ x: 50, duration: 300, easing: cubicOut }}
	>
		<Button
			variant="ghost"
			size="icon"
			class="absolute right-2 top-2"
			onclick={() => (isOpen = !isOpen)}
		>
			<X class="size-4" />
		</Button>
	</div>
{:else}
	<Button
		variant="outline"
		size="icon"
		class="fixed bottom-4 right-4"
		onclick={() => (isOpen = !isOpen)}
	>
		<Sparkles class="size-4" />
	</Button>
{/if}
