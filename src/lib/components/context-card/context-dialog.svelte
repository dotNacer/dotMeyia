<script lang="ts">
	import type { AIContext, Note } from '@prisma/client';
	import * as Dialog from '$lib/components/ui/dialog';
	import type { Snippet } from 'svelte';
	import { ExternalLink } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import { ScrollArea } from '$lib/components/ui/scroll-area';

	let { children, context }: { children: Snippet; context: AIContext & { notes: Note[] } } =
		$props();
</script>

<Dialog.Root>
	<Dialog.Trigger class="h-full w-full overflow-hidden transition-all hover:shadow-md">
		{@render children?.()}
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title class="mb-4">Context #{context.id.slice(0, 8)}</Dialog.Title>
			<Dialog.Description class="flex flex-col gap-4">
				<div class="flex flex-col gap-2">
					<p class="text-sm font-medium">Prompt</p>
					<div class="rounded-md border bg-background p-4">
						<p class="text-foreground">{context.prompt}</p>
					</div>
				</div>

				<div class="flex flex-col">
					<p class="text-sm font-medium">Linked Notes ({context.notes.length})</p>
					<ScrollArea class="h-56 w-full space-y-2 rounded-md">
						{#each context.notes as note}
							<div
								class=" mt-2 flex items-center justify-between rounded-md border bg-background px-4 py-2"
							>
								<p class="text-foreground">{note.title}</p>
								<Button variant="ghost" size="icon" onclick={() => goto(`/notes/${note.id}`)}>
									<ExternalLink />
								</Button>
							</div>
						{/each}
					</ScrollArea>
				</div>
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
