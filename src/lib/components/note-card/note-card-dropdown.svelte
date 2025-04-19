<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { Ellipsis } from 'lucide-svelte';
	import { notes } from '$lib/stores/notes';
	import { goto } from '$app/navigation';
	let { id }: { id: string } = $props();
	function handleDelete() {
		notes.delete(id);
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Button variant="ghost" size="icon">
			<Ellipsis class=" size-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Item onclick={() => goto(`/notes/${id}`)}>Edit</DropdownMenu.Item>
			<DropdownMenu.Item class="text-red-500" onclick={handleDelete}>Delete</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
