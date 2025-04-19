<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { Ellipsis } from 'lucide-svelte';
	import { contexts } from '$lib/stores/contexts';
	let { id }: { id: string } = $props();
	function handleDelete() {
		contexts.delete(id);
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
			<DropdownMenu.Item class="text-red-500" onclick={handleDelete}>Delete</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
