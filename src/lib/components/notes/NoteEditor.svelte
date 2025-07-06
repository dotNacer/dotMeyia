<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { debounce, PLACEHOLDER_CONTENTS } from '$lib/utils';
	import Saved from '$lib/components/animations/Saved.svelte';
	import { ChevronLeft } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	type NoteData = {
		title: string;
		content: string;
	};

	let {
		initialData = { title: '', content: '' }, // Default to empty for new notes
		onSave
	}: {
		initialData?: NoteData;
		onSave: (data: NoteData) => Promise<void> | void;
	} = $props();

	let tempNote = $derived<NoteData>({ ...initialData });
	let savedComponent: Saved | undefined = $state();

	async function handleSave() {
		await onSave(tempNote);
		savedComponent?.triggerSaveAnimation();
	}

	const debouncedSave = debounce(handleSave, 700);

	function handleBack() {
		history.back();
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.repeat) return;

		if (event.key === 'Escape') handleBack();
	}
	onMount(() => {
		if (browser) document.addEventListener('keydown', handleKeyDown);
	});
</script>

<div class="flex h-full w-full flex-col gap-4 p-4" in:fly={{ y: -20, duration: 300 }}>
	<div class="flex items-center justify-between gap-2">
		<div class="flex flex-1 items-center gap-4">
			<Button onclick={handleBack} variant="outline" size="icon">
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
