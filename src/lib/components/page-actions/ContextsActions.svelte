<script lang="ts">
	import ExpandableButton, { type Action } from '../sidebar/ExpandableButton.svelte'
	import { Folder, Settings } from 'lucide-svelte'
	import type { Snippet } from 'svelte'

	function handleAddContext() {
		console.log('add context')
	}
</script>

{#snippet contextExpanded()}
	<div class="flex flex-col gap-4">
		<div class="flex flex-col gap-2">
			<label for="context-name" class="text-sm font-medium text-primary-foreground/80">
				Nom du contexte
			</label>
			<input
				id="context-name"
				type="text"
				placeholder="Entrez un nom..."
				class="w-full rounded-lg border border-primary-foreground/20 bg-primary-foreground/5 p-3 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:border-primary-foreground/40 focus:outline-none focus:ring-0"
			/>
		</div>

		<div class="flex flex-col gap-2">
			<label for="context-description" class="text-sm font-medium text-primary-foreground/80">
				Description
			</label>
			<textarea
				id="context-description"
				placeholder="Décrivez le contexte..."
				class="min-h-24 w-full resize-none rounded-lg border border-primary-foreground/20 bg-primary-foreground/5 p-3 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:border-primary-foreground/40 focus:outline-none focus:ring-0"
				rows="4"
			></textarea>
		</div>

		<button
			type="button"
			class="flex items-center justify-center gap-2 rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/20 active:scale-95"
			onclick={handleAddContext}
		>
			<Folder class="size-4" />
			Créer le contexte
		</button>
	</div>
{/snippet}

{#if true}
	{@const actions: Action[] = [
		{
			label: 'Ajouter un contexte',
			expandedContent: contextExpanded,
		},
	]}

	<ExpandableButton title="Actions rapides" {actions}>
		{#snippet icon()}
			<Settings class="size-6 text-primary-foreground" />
		{/snippet}
	</ExpandableButton>
{/if}
