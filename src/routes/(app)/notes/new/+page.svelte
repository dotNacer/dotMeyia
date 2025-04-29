<script lang="ts">
	import { notes } from '$lib/stores/notes';
	import { Button } from '$lib/components/ui/button';
	import { PLACEHOLDER_CONTENTS, debounce } from '$lib/utils';
	import type { Note } from '@prisma/client';
	import { goto } from '$app/navigation';
	import Saved from '$lib/components/animations/Saved.svelte';
	import { ChevronLeft } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	type NoteData = Pick<Note, 'title' | 'content'>;

	let savedComponent = $state<Saved>();
	let noteId = $state<string | null>(null);
	let tempNote = $state<NoteData>({
		title: '',
		content: ''
	});

	async function handleSave() {
		if (!noteId) {
			const newNote = await notes.create({
				title: tempNote.title,
				content: tempNote.content
			});
			noteId = newNote?.id ?? null;
		} else {
			notes.edit(noteId, { title: tempNote.title, content: tempNote.content });
		}
		savedComponent?.triggerSaveAnimation();
	}

	const debouncedSave = debounce(handleSave, 700);
</script>

<div class="flex h-full w-full flex-col gap-4 p-4" in:fly={{ y: -20, duration: 300 }}>
	<div class="flex items-center justify-between gap-2">
		<div class="flex flex-1 items-center gap-4">
			<Button onclick={() => goto('/notes')} variant="outline" size="icon">
				<ChevronLeft />
			</Button>
			<input
				type="text"
				bind:value={tempNote.title}
				oninput={debouncedSave}
				class="w-full bg-background text-2xl font-bold focus:outline-none"
				placeholder="Title"
			/>
		</div>
		<div class="h-6 w-6">
			<Saved bind:this={savedComponent} />
		</div>
	</div>
	<div class="flex h-full w-full flex-col gap-4">
		<textarea
			bind:value={tempNote.content}
			oninput={debouncedSave}
			class="h-full w-full resize-none bg-background focus:outline-none"
			placeholder={PLACEHOLDER_CONTENTS[Math.floor(Math.random() * PLACEHOLDER_CONTENTS.length)]}
		></textarea>
	</div>
</div>
