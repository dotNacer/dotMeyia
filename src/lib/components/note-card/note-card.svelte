<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Card from '$lib/components/ui/card';
	import { cn } from '$lib/utils';
	import type { Note } from '@prisma/client';
	import NoteCardDropdown from './note-card-dropdown.svelte';
	let { note }: { note: Note } = $props();
</script>

<Card.Root
	class="h-full overflow-hidden transition-all hover:shadow-md"
	onclick={() => {
		goto(`/notes/${note.id}`);
	}}
>
	<Card.Header class="flex flex-row items-center justify-between">
		<Card.Title class="line-clamp-1">{note.title}</Card.Title>
		<NoteCardDropdown id={note.id} />
	</Card.Header>
	<Card.Content>
		<p class="line-clamp-3 text-muted-foreground">{note.content}</p>
	</Card.Content>
	<Card.Footer class={cn('flex justify-between text-xs text-muted-foreground')}>
		<span>Created: {new Date(note.createdAt).toLocaleDateString()}</span>
		<span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
	</Card.Footer>
</Card.Root>

<style>
	.line-clamp-3 {
		display: -webkit-box;
		line-clamp: 3;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
