<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ListFilter, Search } from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import type { Note } from '@prisma/client';
	import { onMount } from 'svelte';

	let { notes, filteredNotes = $bindable<Note[]>() }: { notes: Note[]; filteredNotes: Note[] } =
		$props();
	let search = $state('');

	onMount(() => {
		filterNotes();
	});

	//TODO: a améliorer ?
	function filterNotes() {
		if (search == '') {
			filteredNotes = notes;
		} else {
			filteredNotes = notes.filter((note) =>
				note.title.toLowerCase().includes(search.toLowerCase())
			);
		}
	}
</script>

<div class="relative flex-1">
	<Input bind:value={search} oninput={filterNotes} class="pl-8" placeholder="Search a note..." />
	<Search
		class="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50"
	/>
</div>
<DropdownMenu.Root>
	<DropdownMenu.Trigger
		><Button size="icon">
			<ListFilter class="size-4" />
		</Button></DropdownMenu.Trigger
	>
	<DropdownMenu.Content class="w-[30rem]">//TODO: Faire les filtres</DropdownMenu.Content>
</DropdownMenu.Root>
