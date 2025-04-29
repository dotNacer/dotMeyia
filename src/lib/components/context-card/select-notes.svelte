<script lang="ts">
	import type { Note } from '@prisma/client';
	import { notes } from '$lib/stores/notes';
	import { Check } from 'lucide-svelte';
	import NoteHover from '$lib/components/note-card/note-hover.svelte';

	import { createEventDispatcher, onMount } from 'svelte';
	import FilterMenu from './filter-menu.svelte';

	onMount(async () => {
		await notes.fetch();
	});

	let filteredNotes: Note[] = $state() as Note[];
	const dispatch = createEventDispatcher();
	let { selectedNotes = $bindable<Note[]>([]) }: { selectedNotes: Note[] } = $props();
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
		<!-- TODO: Faire les filtres poussés -->
		<FilterMenu notes={$notes} bind:filteredNotes />
	</div>
	{#each filteredNotes as note}
		<NoteHover {note}>
			<button
				class="flex w-full flex-row items-center justify-between border p-4"
				onclick={() => {
					toggleNote(note);
				}}
			>
				<p>{note.title}</p>
				{#if selectedNotes.some((n) => n.id === note.id)}
					<Check class="h-4 w-4" />
				{/if}
			</button>
		</NoteHover>
	{/each}
</div>
