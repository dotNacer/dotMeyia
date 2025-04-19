<script lang="ts">
	import { Textarea } from '$lib/components/ui/textarea';
	import type { Note, AIContext } from '@prisma/client';
	import { contexts } from '$lib/stores/contexts';
	import SelectNotes from '$lib/components/context-card/select-notes.svelte';
	import { debounce } from '$lib/utils';
	import Saved from '$lib/components/animations/Saved.svelte';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import { ChevronLeft } from 'lucide-svelte';

	let { data } = $props();
	type AIContextData = Pick<AIContext, 'prompt'> & { notes: Note[] };
	let context: (AIContext & { notes: Note[] }) | null = $state(null);
	let aiContext = $state<AIContextData>({
		prompt: '',
		notes: []
	});
	let savedComponent = $state<Saved>();

	async function handleSave() {
		contexts.edit(data.id, aiContext, aiContext.notes);
		savedComponent?.triggerSaveAnimation();
	}

	const debouncedSave = debounce(handleSave, 700);

	onMount(async () => {
		context = await contexts.get(data.id);
		if (context) {
			aiContext.prompt = context.prompt;
			aiContext.notes = context.notes;
		}
	});
</script>

{#if context}
	<div class="absolute right-4 top-4">
		<Saved bind:this={savedComponent} />
	</div>

	<div class="flex flex-row gap-8 p-8">
		<div class="flex w-1/2 flex-col gap-4">
			<div class="flex items-center gap-4">
				<Button onclick={() => goto('/contexts')} variant="outline" size="icon">
					<ChevronLeft />
				</Button>
				<h1 class="text-2xl font-bold">Prompt</h1>
			</div>
			<Textarea
				class="h-[40rem] max-h-[60rem] min-h-[40rem]"
				placeholder="Enter your prompt..."
				bind:value={aiContext.prompt}
				oninput={debouncedSave}
			/>
		</div>
		<SelectNotes bind:selectedNotes={aiContext.notes} on:change={debouncedSave} />
	</div>
{:else}
	<p>Chargement...</p>
{/if}
