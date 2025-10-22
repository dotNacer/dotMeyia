<script lang="ts">
	import ExpandableButton, { type Action } from '../sidebar/ExpandableButton.svelte'
	import { Plus, Settings } from 'lucide-svelte'
	import type { Snippet } from 'svelte'

	function handleAddNote() {
		console.log('add note')
	}

	function handleAddQuickNote() {
		console.log('add quick note')
	}
</script>

{#snippet quickNoteIcon()}
	<Plus class="size-4" />
{/snippet}

{#snippet detailedNoteExpanded()}
	<div class="flex flex-col gap-4">
		<div class="flex flex-col gap-2">
			<label for="note-title" class="text-sm font-medium text-primary-foreground/80">
				Titre de la note
			</label>
			<input
				id="note-title"
				type="text"
				placeholder="Entrez un titre..."
				class="w-full rounded-lg border border-primary-foreground/20 bg-primary-foreground/5 p-3 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:border-primary-foreground/40 focus:outline-none focus:ring-0"
			/>
		</div>

		<div class="flex flex-col gap-2">
			<label for="note-description" class="text-sm font-medium text-primary-foreground/80">
				Description
			</label>
			<textarea
				id="note-description"
				placeholder="Décrivez votre note en détail..."
				class="min-h-32 w-full resize-none rounded-lg border border-primary-foreground/20 bg-primary-foreground/5 p-3 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:border-primary-foreground/40 focus:outline-none focus:ring-0"
				rows="6"
			></textarea>
		</div>

		<div class="flex flex-col gap-2">
			<label for="note-tags" class="text-sm font-medium text-primary-foreground/80">
				Tags
			</label>
			<input
				id="note-tags"
				type="text"
				placeholder="Séparez les tags par des virgules..."
				class="w-full rounded-lg border border-primary-foreground/20 bg-primary-foreground/5 p-3 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:border-primary-foreground/40 focus:outline-none focus:ring-0"
			/>
		</div>

		<button
			type="button"
			class="flex items-center justify-center gap-2 rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/20 active:scale-95"
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
			icon: quickNoteIcon,
			onClick: handleAddQuickNote,
		},
		{
			label: 'Ajouter une note détaillée',
			expandedContent: detailedNoteExpanded,
		},
	]}

	<ExpandableButton title="Actions rapides" {actions}>
		{#snippet icon()}
			<Settings class="size-6 text-primary-foreground" />
		{/snippet}
	</ExpandableButton>
{/if}
