<script lang="ts">
	import ExpandableButton, { type Action } from '../sidebar/ExpandableButton.svelte'
	import { Plus, Zap } from 'lucide-svelte'

	function handleAddNote() {
		console.log('add note')
	}

	function handleAddQuickNote() {
		console.log('add quick note')
	}

	let descriptionTextareaRef: HTMLTextAreaElement | undefined = $state()

	$effect(() => {
		// Focus the textarea when it's mounted and visible
		if (descriptionTextareaRef) {
			// Small delay to allow animations to complete
			setTimeout(() => {
				descriptionTextareaRef?.focus()
			}, 350)
		}
	})
</script>

{#snippet fastNoteExpanded()}
	<div class="flex h-full w-full flex-col justify-between">
		<textarea
			bind:this={descriptionTextareaRef}
			id="note-description"
			placeholder="Décrivez votre note en détail..."
			class="min-h-32 w-full resize-none rounded-lg border border-primary-foreground/20 bg-primary-foreground/5 p-3 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:border-primary-foreground/40 focus:outline-none focus:ring-0"
			rows="6"
		></textarea>

		<button
			type="button"
			class="flex items-center justify-center gap-2 rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2 text-sm font-medium text-primary-foreground transition-[colors,transform] duration-75 hover:bg-primary-foreground/20 active:scale-[0.97]"
			onclick={handleAddNote}
		>
			<Plus class="size-4" />
			Créer la note
		</button>
	</div>
{/snippet}

{#if true}
	{@const actions: Action[] = [
		{
			label: 'Ajouter une note rapide',
			icon: Plus,
			onClick: handleAddQuickNote,
		},
		{
			label: 'Ajouter une FastNote',
			icon: Zap,
			expandedContent: fastNoteExpanded,
			expandedTitle: 'Nouvelle FastNote',
		},
	]}

	<ExpandableButton title="Actions rapides" {actions} />
{/if}
