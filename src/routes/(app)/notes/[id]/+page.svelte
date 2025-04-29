<script lang="ts">
	import { notes } from '$lib/stores/notes';
	import { onMount } from 'svelte';
	import type { Note } from '@prisma/client';
	import NoteEditor from '$lib/components/notes/NoteEditor.svelte';

	let { data } = $props();
	let note = $state<Note | null>(null);

	async function handleSave(updatedData: Pick<Note, 'title' | 'content'>) {
		if (!note) return;
		await notes.edit(data.id, updatedData);
	}

	onMount(async () => {
		note = await notes.get(data.id);
	});
</script>

{#if note}
	<NoteEditor initialData={{ title: note.title, content: note.content }} onSave={handleSave} />
{:else}
	<p class="p-4">Chargement...</p>
{/if}
