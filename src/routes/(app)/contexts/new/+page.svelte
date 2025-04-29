<script lang="ts">
	import { Textarea } from '$lib/components/ui/textarea';
	import { Input } from '$lib/components/ui/input';
	import type { Note, AIContext } from '@prisma/client';
	import { contexts } from '$lib/stores/contexts';
	import { fly } from 'svelte/transition';
	import SelectNotes from '$lib/components/context-card/select-notes.svelte';
	import { debounce } from '$lib/utils';
	import Saved from '$lib/components/animations/Saved.svelte';
	import { Button } from '$lib/components/ui/button';
	import { ChevronLeft } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	type AIContextData = Pick<AIContext, 'prompt' | 'title'> & { notes: Note[] };
	let contextId = $state<string | null>(null);
	let aiContext = $state<AIContextData>({
		prompt: '',
		title: '',
		notes: []
	});
	let savedComponent = $state<Saved>();

	async function handleSave() {
		if (!contextId) {
			const newContext = await contexts.create(aiContext, aiContext.notes);
			contextId = newContext?.id ?? null;
		} else {
			contexts.edit(contextId, aiContext, aiContext.notes);
		}
		savedComponent?.triggerSaveAnimation();
	}

	const debouncedSave = debounce(handleSave, 700);
</script>

<div class="absolute right-4 top-4">
	<Saved bind:this={savedComponent} />
</div>

<div class="flex flex-row gap-8 p-8" in:fly={{ y: -20, duration: 300 }}>
	<div class="flex w-1/2 flex-col gap-4">
		<div class="flex items-center gap-4">
			<Button onclick={() => goto('/contexts')} variant="outline" size="icon">
				<ChevronLeft />
			</Button>
			<h1 class="text-2xl font-bold">New Context</h1>
		</div>
		<Input
			placeholder="Enter context title..."
			bind:value={aiContext.title}
			oninput={debouncedSave}
		/>
		<Textarea
			class="h-[40rem] max-h-[60rem] min-h-[40rem]"
			placeholder="Enter your prompt..."
			bind:value={aiContext.prompt}
			oninput={debouncedSave}
		/>
	</div>
	<SelectNotes bind:selectedNotes={aiContext.notes} on:change={debouncedSave} />
</div>
