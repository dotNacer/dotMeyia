<script lang="ts">
	import { searchNotes } from '$lib/notes.remote'
	import { Input } from '$lib/components/ui/input'
	import { Button } from '$lib/components/ui/button'
	import * as Card from '$lib/components/ui/card'
	import type { Note } from '@prisma/client'

	let query = $state('')
	let results: Note[] = $state([])
	let loading = $state(false)

	async function handleSearch() {
		if (!query.trim()) return
		loading = true
		try {
			results = await searchNotes(query)
		} catch (error) {
			console.error('Search failed:', error)
		} finally {
			loading = false
		}
	}
</script>

<div class="container mx-auto space-y-6 p-4">
	<h1 class="text-2xl font-bold">Test de Recherche Vectorielle</h1>

	<div class="flex gap-2">
		<Input
			bind:value={query}
			placeholder="Rechercher une note..."
			onkeydown={(e) => e.key === 'Enter' && handleSearch()}
		/>
		<Button onclick={handleSearch} disabled={loading}>
			{loading ? 'Recherche...' : 'Rechercher'}
		</Button>
	</div>

	<div class="grid gap-4">
		{#each results as note}
			<Card.Root>
				<Card.Header>
					<Card.Title>{note.title}</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="whitespace-pre-wrap text-sm text-muted-foreground">{note.content}</p>
				</Card.Content>
			</Card.Root>
		{:else}
			{#if !loading && results.length === 0 && query !== ''}
				<p class="text-muted-foreground">Aucun résultat trouvé.</p>
			{/if}
		{/each}
	</div>
</div>
