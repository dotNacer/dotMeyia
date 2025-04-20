<script lang="ts">
	import * as Card from '$lib/components/ui/card';

	import ContextDialog from '$lib/components/context-card/context-dialog.svelte';
	import type { AIContext, Note } from '@prisma/client';
	import ContextCardDropdown from './context-card-dropdown.svelte';
	let { context }: { context: AIContext & { notes: Note[] } } = $props();
</script>

<ContextDialog {context}>
	<Card.Root class="h-full overflow-hidden transition-all hover:shadow-md">
		<Card.Header class="flex flex-row items-center justify-between">
			<Card.Title>{context.title}</Card.Title>
			<ContextCardDropdown id={context.id} />
		</Card.Header>
		<Card.Content>
			<Card.Description class="text-left">{context.prompt}</Card.Description>
		</Card.Content>
	</Card.Root>
</ContextDialog>
