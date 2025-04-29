<script lang="ts">
	import { notes } from '$lib/stores/notes';
	import NoteEditor from '$lib/components/notes/NoteEditor.svelte';
	import type { Note } from '@prisma/client';

	let noteId = $state<string | null>(null);

	async function handleSave(data: Pick<Note, 'title' | 'content'>) {
		if (!noteId) {
			const newNote = await notes.create({
				title: data.title,
				content: data.content
			});
			noteId = newNote?.id ?? null;
			if (noteId) {
				history.replaceState(null, '', `/notes/${noteId}`);
			}
		} else {
			await notes.edit(noteId, { title: data.title, content: data.content });
		}
	}
</script>

<NoteEditor onSave={handleSave} />
