<script lang="ts">
	import type { Note } from '@prisma/client';
	import * as HoverCard from '$lib/components/ui/hover-card';
	import type { Snippet } from 'svelte';

	let {
		note,
		children,
		height = 'max-h-48',
		width = 'w-80'
	}: { note: Note; children: Snippet; height?: string; width?: string } = $props();
</script>

<HoverCard.Root>
	<HoverCard.Trigger>{@render children()}</HoverCard.Trigger>
	<HoverCard.Content class={`${width} overflow-y-auto ${height}`}>
		<div class="flex justify-between space-x-4">
			<div class="space-y-1">
				<p class="text-sm" style="white-space: pre-line;">
					{note.content != '' ? note.content : 'Note vide'}
				</p>
			</div>
		</div>
	</HoverCard.Content>
</HoverCard.Root>
