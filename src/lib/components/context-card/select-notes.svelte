<script lang="ts">
	import type { Note } from '@prisma/client';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { notes } from '$lib/stores/notes';
	import { Check, Search, ListFilter } from 'lucide-svelte';

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	let { selectedNotes = $bindable<Note[]>([]) }: { selectedNotes: Note[] } = $props();
	let search = $state('');
	function toggleNote(note: Note) {
		if (selectedNotes.some((n) => n.id === note.id)) {
			selectedNotes = selectedNotes.filter((n) => n.id !== note.id);
		} else {
			selectedNotes = [...selectedNotes, note];
		}

		dispatch('change');
	}
</script>

<div class="flex w-[30rem] flex-col gap-2">
	<div class="flex w-full flex-row items-center gap-2">
		<div class="relative flex-1">
			<Input bind:value={search} class="pl-8" placeholder="Search a note..." />
			<Search
				class="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50"
			/>
		</div>
		<!-- TODO: Faire les filtres poussés -->
		<Button size="icon">
			<ListFilter class="size-4" />
		</Button>
	</div>
	{#each $notes as note}
		<button
			class="flex flex-row items-center justify-between border p-4"
			onclick={() => {
				toggleNote(note);
			}}
		>
			<p>{note.title}</p>
			{#if selectedNotes.some((n) => n.id === note.id)}
				<Check class="h-4 w-4" />
			{/if}
		</button>
	{/each}
</div>
