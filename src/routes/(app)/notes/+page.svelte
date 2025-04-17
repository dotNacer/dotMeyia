<script lang="ts">
	import { notes } from '$lib/stores/notes';
	import { Search } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { cn } from '$lib/utils';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { fly, slide } from 'svelte/transition';
	let sortedNotes = $derived(
		[...$notes].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
	);

	onMount(async () => {
		await notes.fetch();
	});
</script>

<Button onclick={() => notes.create({ title: 'New Note', content: 'New Note Content' })}>
	Create Note
</Button>
<Button onclick={() => notes.deleteAll()} variant="destructive">Delete All</Button>
<div class="container mx-auto max-w-5xl px-4 py-8">
	<div class="flex flex-col space-y-6">
		<!-- Header section -->
		<div class="flex items-center justify-between">
			<h1 class="text-3xl font-bold text-gray-900">Notes</h1>
			<Button variant="default" size="default" onclick={() => notes.fetch()}>Refresh</Button>
		</div>

		<!-- Search section -->
		<div class="relative">
			<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
			<Input type="text" placeholder="Search notes..." class="pl-10" />
		</div>

		<Separator />

		<!-- Notes grid -->
		{#if sortedNotes.length > 0}
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each sortedNotes as note}
					<div transition:fly>
						<Card.Root
							class="h-full overflow-hidden transition-all hover:shadow-md"
							onclick={() => {
								goto(`/notes/${note.id}`);
							}}
						>
							<Card.Header>
								<Card.Title class="line-clamp-1">{note.title}</Card.Title>
							</Card.Header>
							<Card.Content>
								<p class="line-clamp-3 text-muted-foreground">{note.content}</p>
							</Card.Content>
							<Card.Footer class={cn('flex justify-between text-xs text-muted-foreground')}>
								<span>Created: {new Date(note.createdAt).toLocaleDateString()}</span>
								<span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
							</Card.Footer>
						</Card.Root>
					</div>
				{/each}
			</div>
		{:else}
			<div class="flex flex-col items-center justify-center py-16 text-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="mb-4 h-16 w-16 text-muted-foreground/30"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					/>
				</svg>
				<h3 class="mb-2 text-lg font-medium">No notes yet</h3>
				<p class="mb-6 text-muted-foreground">Start creating notes to see them appear here</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.line-clamp-1 {
		display: -webkit-box;
		line-clamp: 1;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.line-clamp-3 {
		display: -webkit-box;
		line-clamp: 3;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
