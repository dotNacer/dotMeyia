<script lang="ts">
	import { notes } from '$lib/stores/notes';
	import { Notebook, Plus } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';
	import { Input } from '$lib/components/ui/input';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import NoteCard from '$lib/components/note-card/note-card.svelte';
	import { goto } from '$app/navigation';

	let loaded = $state(false);
	let sortedNotes = $derived(
		[...$notes].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
	);

	const flipOptions = {
		delay: 50,
		duration: 400,
		easing: cubicOut
	};

	onMount(async () => {
		await notes.fetch().then(() => {
			loaded = true;
		});
	});
</script>

<div class="container mx-auto max-w-5xl px-4 py-8">
	<div class="flex flex-col space-y-6">
		<!-- Header section -->
		<div class="flex items-center justify-between">
			<h1 class="font-title text-3xl font-bold" in:fly={{ x: 20 }}>Notes</h1>
			<div class="flex items-center gap-2">
				<Input placeholder="Search" />
				<div class="sm:hidden md:block">
					<Button size="icon" onclick={() => goto('/notes/new')}>
						<Plus class="size-4" />
					</Button>
				</div>
			</div>
		</div>

		{#if sortedNotes.length > 0}
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each sortedNotes as note (note.id)}
					<div animate:flip={flipOptions} out:fly={{ y: -10, duration: 300 }}>
						<NoteCard {note} />
					</div>
				{/each}
			</div>
		{:else}
			<div class="flex flex-col items-center justify-center py-16 text-center">
				<Notebook class="mb-4 h-16 w-16 text-muted-foreground" />
				<h3 class="mb-2 text-lg font-medium">No notes yet</h3>
				<p class="mb-6 text-muted-foreground">Start creating notes to see them appear here</p>
			</div>
		{/if}

		<Button class="fixed bottom-4 right-4 md:hidden" size="icon" onclick={() => goto('/notes/new')}>
			<Plus class="size-4" />
		</Button>
	</div>
</div>
