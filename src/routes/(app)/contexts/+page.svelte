<script lang="ts">
	import { contexts } from '$lib/stores/contexts';
	import { Brain, Plus } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { cubicOut } from 'svelte/easing';
	import ContextCard from '$lib/components/context-card/context-card.svelte';
	import { goto } from '$app/navigation';

	let loaded = $state(false);
	let sortedContexts = $derived(
		[...$contexts].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
	);

	const flipOptions = {
		delay: 50,
		duration: 400,
		easing: cubicOut
	};

	onMount(async () => {
		await contexts.fetch().then(() => {
			loaded = true;
		});
	});
</script>

<div class="container mx-auto max-w-5xl px-4 py-8">
	<div class="flex flex-col space-y-6">
		<!-- Header section -->
		<div class="flex items-center justify-between">
			<h1 class="text-3xl font-bold">Contexts</h1>
			<div class="flex items-center gap-2">
				<div class="sm:hidden md:block">
					<Button variant="outline" size="icon" onclick={() => goto('/contexts/new')}>
						<Plus class="size-4" />
					</Button>
				</div>
				<Button variant="default" size="default" onclick={() => contexts.fetch()}>Refresh</Button>
			</div>
		</div>

		{#if sortedContexts.length > 0}
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each sortedContexts as context (context.id)}
					<div animate:flip={flipOptions}>
						<ContextCard {context} />
					</div>
				{/each}
			</div>
		{:else}
			<div class="flex flex-col items-center justify-center py-16 text-center">
				<Brain class="mb-4 h-16 w-16 text-muted-foreground" />
				<h3 class="mb-2 text-lg font-medium">No contexts yet</h3>
				<p class="mb-6 text-muted-foreground">Start creating contexts to organize your notes</p>
			</div>
		{/if}

		<Button
			class="fixed bottom-4 right-4 md:hidden"
			size="icon"
			onclick={() => goto('/contexts/new')}
		>
			<Plus class="size-4" />
		</Button>
	</div>
</div>
