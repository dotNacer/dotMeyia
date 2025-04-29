<script lang="ts">
	import { notes } from '$lib/stores/notes';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import { debounce } from '$lib/utils';
	import Saved from '$lib/components/animations/Saved.svelte';
	import { ChevronLeft } from 'lucide-svelte';
	import type { Note } from '@prisma/client';
	import { PLACEHOLDER_CONTENTS } from '$lib/utils';
	import { fly } from 'svelte/transition';
	let { data } = $props();
	let note: Note | null = $state(null);
	type NoteData = Pick<Note, 'title' | 'content'>;
	let tempNote = $state<NoteData>({
		title: '',
		content: ''
	});
	let savedComponent: any = $state(undefined);

	function handleSave() {
		if (!note) return;
		notes.edit(data.id, {
			title: tempNote.title,
			content: tempNote.content
		});
		// Trigger the save animation
		savedComponent?.triggerSaveAnimation();
	}

	// Create debounced save function that triggers 2 seconds after changes
	const debouncedSave = debounce(handleSave, 700);

	onMount(async () => {
		note = await notes.get(data.id);
		if (note) {
			tempNote.title = note.title;
			tempNote.content = note.content;
		}
	});
</script>

<div class="flex h-full w-full flex-col gap-4 p-4" in:fly={{ y: -20, duration: 300 }}>
	{#if note}
		<div class="flex items-center justify-between gap-2">
			<div class="flex flex-1 items-center gap-4">
				<Button onclick={() => goto('/notes')} variant="outline" size="icon"><ChevronLeft /></Button
				>
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
				class="h-full w-full resize-none bg-background focus:outline-none"
				oninput={debouncedSave}
				placeholder={PLACEHOLDER_CONTENTS[Math.floor(Math.random() * PLACEHOLDER_CONTENTS.length)]}
			></textarea>
		</div>
	{:else}
		<p>Chargement...</p>
	{/if}
</div>
