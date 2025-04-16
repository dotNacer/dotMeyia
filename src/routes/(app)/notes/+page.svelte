<script lang="ts">
	import type { Note } from '$lib/types/Note';
	import { notes as nodeStore } from '$lib/stores/notes';

	let notes = $state<Note[]>([]);

	let { data } = $props();
	notes = data.notes;
</script>

<button onclick={() => nodeStore.fetch()}>Fetch Notes</button>
<h1>Notes</h1>

{#each notes as note}
	<div class="rounded-md border border-gray-300 p-4">
		<h2 class="text-lg font-bold">{note.title}</h2>
		<p class="text-sm text-gray-500">{note.content}</p>
	</div>
{/each}
