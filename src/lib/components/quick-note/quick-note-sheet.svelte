<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Loader2, Save, Sparkles } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { notes } from '$lib/stores/notes';
	import { createQuickNote } from '$lib/quick-notes.remote';

	let {
		open = $bindable(false)
	}: {
		open?: boolean;
	} = $props();

	let content = $state('');
	let isSubmitting = $state(false);
	let similarNotes = $state<Array<{ id: string; title: string; similarity: number }>>([]);
	let selectedMergeNote = $state<string | null>(null);

	async function handleSubmit() {
		if (!content.trim()) {
			toast.error('Please enter some content');
			return;
		}

		isSubmitting = true;
		try {
			const result = await createQuickNote({
				content: content.trim(),
				mergeWithNoteId: selectedMergeNote || undefined
			});

			if (result.merged) {
				toast.success(`Note merged with "${result.note.title}"`);
			} else {
				toast.success('Quick note created!');
			}

			// Refresh notes store
			await notes.fetch();

			// Reset form
			content = '';
			similarNotes = [];
			selectedMergeNote = null;
			open = false;
		} catch (error) {
			console.error('Error creating quick note:', error);
			toast.error('Failed to create note');
		} finally {
			isSubmitting = false;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
			handleSubmit();
		}
	}

	function selectMergeNote(noteId: string) {
		selectedMergeNote = selectedMergeNote === noteId ? null : noteId;
	}

	// Reset state when sheet closes
	$effect(() => {
		if (!open) {
			setTimeout(() => {
				content = '';
				similarNotes = [];
				selectedMergeNote = null;
			}, 300);
		}
	});
</script>

<Sheet.Root bind:open>
	<Sheet.Content side="bottom" class="h-[85vh] rounded-t-xl">
		<Sheet.Header>
			<Sheet.Title>Quick Note</Sheet.Title>
			<Sheet.Description>
				Quickly capture your thoughts. Press {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+Enter
				to save.
			</Sheet.Description>
		</Sheet.Header>

		<div class="mt-4 flex h-[calc(100%-120px)] flex-col gap-4">
			<Textarea
				bind:value={content}
				onkeydown={handleKeydown}
				placeholder="What's on your mind?"
				class="min-h-[150px] resize-none text-base"
				autofocus
			/>

			{#if similarNotes.length > 0}
				<div class="rounded-lg border bg-muted/50 p-4">
					<div class="mb-2 flex items-center gap-2 text-sm font-medium">
						<Sparkles class="h-4 w-4 text-primary" />
						<span>Similar notes found</span>
					</div>
					<p class="mb-3 text-xs text-muted-foreground">
						Select a note to merge with, or leave unselected to create a new note.
					</p>
					<div class="space-y-2">
						{#each similarNotes as note (note.id)}
							<button
								type="button"
								onclick={() => selectMergeNote(note.id)}
								class="w-full rounded-md border bg-background p-3 text-left transition-colors hover:bg-accent"
								class:ring-2={selectedMergeNote === note.id}
								class:ring-primary={selectedMergeNote === note.id}
							>
								<div class="flex items-center justify-between">
									<span class="font-medium text-sm">{note.title}</span>
									<span class="text-xs text-muted-foreground">
										{Math.round(note.similarity * 100)}% match
									</span>
								</div>
							</button>
						{/each}
					</div>
				</div>
			{/if}
		</div>

		<Sheet.Footer class="absolute bottom-6 left-6 right-6">
			<Button variant="outline" onclick={() => (open = false)} disabled={isSubmitting}>
				Cancel
			</Button>
			<Button onclick={handleSubmit} disabled={isSubmitting || !content.trim()} class="flex-1">
				{#if isSubmitting}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					Saving...
				{:else}
					<Save class="mr-2 h-4 w-4" />
					{selectedMergeNote ? 'Merge & Save' : 'Save'}
				{/if}
			</Button>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
