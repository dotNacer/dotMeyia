<script lang="ts">
	import { goto } from '$app/navigation'
	import * as Card from '$lib/components/ui/card'
	import FastNoteInput from '$lib/components/fast-note/fast-note-input.svelte'
	import type { FastNoteHistoryItem } from '$lib/types/fast-note'
	import { onMount } from 'svelte'

	let items = $state<FastNoteHistoryItem[]>([])
	let loading = $state(true)

	async function loadHistory() {
		try {
			const res = await fetch('/api/ai/fast-note/history')
			if (!res.ok) throw new Error()
			const data = await res.json()
			items = data.items ?? []
		} catch {
			items = []
		} finally {
			loading = false
		}
	}

	onMount(loadHistory)

	function formatDate(iso: string) {
		return new Date(iso).toLocaleString('fr-FR', {
			dateStyle: 'short',
			timeStyle: 'short',
		})
	}
</script>

<div class="container mx-auto max-w-3xl px-4 py-8">
	<h1 class="font-title mb-6 text-3xl font-bold">Fast Notes</h1>
	<div class="mb-8">
		<FastNoteInput />
	</div>
	<h2 class="mb-4 text-xl font-semibold">Historique</h2>

	{#if loading}
		<p class="text-muted-foreground">Chargement...</p>
	{:else if items.length === 0}
		<div class="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
			Aucun Fast Note enregistré
		</div>
	{:else}
		<div class="flex flex-col gap-4">
			{#each items as item}
				<Card.Root
					class="cursor-pointer transition-colors hover:bg-muted/50"
					onclick={() => goto(`/notes/${item.noteId}`)}
				>
					<Card.Header class="pb-2">
						<Card.Title class="text-base font-medium">{item.noteTitle}</Card.Title>
						<p class="text-xs text-muted-foreground">{formatDate(item.createdAt)}</p>
					</Card.Header>
					<Card.Content>
						<p class="line-clamp-2 text-sm text-muted-foreground">{item.content}</p>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	{/if}
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		line-clamp: 2;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
