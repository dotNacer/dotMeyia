<script lang="ts">
	import { notes } from '$lib/stores/notes';
	import { onMount } from 'svelte';
	import type { Note } from '$lib/types/Note';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import { debounce } from '$lib/utils';
	import Saved from '$lib/components/animations/Saved.svelte';
	let { data } = $props();
	let note: Note | null = $state(null);
	let title = $state('');
	let content = $state('');
	// Use any type to avoid complex Svelte 5 component typing issues
	let savedComponent: any = $state(undefined);

	function handleSave() {
		if (!note) return;
		notes.edit(data.id, {
			title,
			content
		});
		// Trigger the save animation
		savedComponent?.triggerSaveAnimation();
	}

	// Create debounced save function that triggers 2 seconds after changes
	const debouncedSave = debounce(handleSave, 700);

	onMount(async () => {
		note = await notes.get(data.id);
		if (note) {
			title = note.title;
			content = note.content;
		}
	});
</script>

<div class="flex h-full w-full flex-col gap-4 p-4">
	<div class="flex items-center justify-between gap-2">
		<Button onclick={() => goto('/notes')} variant="outline">Back</Button>
		<div class="h-6 w-6">
			<Saved bind:this={savedComponent} />
		</div>
	</div>
	{#if note}
		<div class="flex h-full w-full flex-col gap-4">
			<input type="text" bind:value={title} oninput={debouncedSave} class="text-2xl font-bold" />
			<textarea bind:value={content} class="h-full w-full" oninput={debouncedSave}></textarea>
		</div>
	{:else}
		<p>Chargement...</p>
	{/if}
</div>
