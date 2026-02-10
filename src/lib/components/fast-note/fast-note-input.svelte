<script lang="ts">
	import { goto } from '$app/navigation'
	import * as Button from '$lib/components/ui/button'
	import * as Dialog from '$lib/components/ui/dialog'
	import { Textarea } from '$lib/components/ui/textarea'
	import { toast } from 'svelte-sonner'
	import { Zap, Loader2 } from 'lucide-svelte'
	import type { FastNoteMatch } from '$lib/types/fast-note'

	let content = $state('')
	let loading = $state(false)
	let showConfirm = $state(false)
	let candidates = $state<FastNoteMatch[]>([])
	let createNew = $state(false)
	let merging = $state(false)

	async function search() {
		if (!content.trim()) return
		loading = true
		showConfirm = false
		try {
			const res = await fetch('/api/ai/fast-note', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ content: content.trim() }),
			})
			if (!res.ok) throw new Error(await res.text())
			const data = await res.json()
			candidates = data.candidates ?? []
			createNew = data.createNew ?? false
			showConfirm = true
		} catch (e) {
			toast.error('Erreur lors de la recherche')
			console.error(e)
		} finally {
			loading = false
		}
	}

	async function confirmMerge(noteId: string | null) {
		if (!content.trim()) return
		merging = true
		try {
			const res = await fetch('/api/ai/fast-note', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ content: content.trim(), noteId }),
			})
			if (!res.ok) throw new Error(await res.text())
			const data = await res.json()
			content = ''
			showConfirm = false
			toast.success('Fast Note enregistré')
			if (data.noteId) {
				goto(`/notes/${data.noteId}`)
			}
		} catch (e) {
			toast.error("Erreur lors de l'enregistrement")
			console.error(e)
		} finally {
			merging = false
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			search()
		}
	}
</script>

<div class="flex flex-col gap-2">
	<div class="flex gap-2">
		<Textarea
			bind:value={content}
			placeholder="Fast Note — ex: Réunion demain 14h..."
			class="min-h-[60px] flex-1 resize-none"
			onkeydown={handleKeydown}
			disabled={loading}
		/>
		<Button.Root onclick={search} disabled={loading || !content.trim()}>
			{#if loading}
				<Loader2 class="size-4 animate-spin" />
			{:else}
				<Zap class="size-4" />
			{/if}
		</Button.Root>
	</div>

	<Dialog.Root bind:open={showConfirm}>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Où enregistrer cette Fast Note ?</Dialog.Title>
				<Dialog.Description>
					{#if createNew}
						Aucune note similaire trouvée. Créez une nouvelle note ou choisissez une
						note existante.
					{:else}
						Note(s) similaire(s) trouvée(s). Choisissez une note ou créez-en une
						nouvelle.
					{/if}
				</Dialog.Description>
			</Dialog.Header>
			<div class="grid gap-2 py-4">
				{#each candidates as c}
					<Button.Root
						variant="outline"
						class="justify-start text-left"
						onclick={() => confirmMerge(c.noteId)}
						disabled={merging}
					>
						{c.title}
						<span class="ml-2 text-xs text-muted-foreground"
							>({Math.round(c.similarity * 100)}%)</span
						>
					</Button.Root>
				{/each}
				<Button.Root
					variant="default"
					class="justify-start"
					onclick={() => confirmMerge(null)}
					disabled={merging}
				>
					Nouvelle note
				</Button.Root>
			</div>
		</Dialog.Content>
	</Dialog.Root>
</div>
