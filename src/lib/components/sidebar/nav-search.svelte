<script lang="ts">
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import { Label } from '$lib/components/ui/label';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import type { WithElementRef } from 'bits-ui';
	import { Search } from 'lucide-svelte';
	import type { HTMLFormAttributes } from 'svelte/elements';

	import Calculator from 'lucide-svelte/icons/calculator';
	import CreditCard from 'lucide-svelte/icons/credit-card';
	import Settings from 'lucide-svelte/icons/settings';
	import Smile from 'lucide-svelte/icons/smile';
	import User from 'lucide-svelte/icons/user';
	import Sparkles from 'lucide-svelte/icons/sparkles';
	import * as Command from '$lib/components/ui/command/index.js';
	let {
		collapsible,
		ref = $bindable(null),
		...restProps
	}: WithElementRef<HTMLFormAttributes> & { collapsible?: boolean } = $props();

	let open = $state(false);

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			open = !open;
		}
	}

	const sidebar = useSidebar();
</script>

<svelte:document onkeydown={handleKeydown} />
{#if sidebar.open}
	<form bind:this={ref} {...restProps}>
		<Sidebar.Group class="py-0">
			<Sidebar.GroupContent class="relative">
				<Label for="search" class="sr-only">Search</Label>
				<Sidebar.MenuButton
					class="flex items-center justify-between border"
					id="search"
					onclick={(e) => {
						open = !open;
						e.preventDefault();
					}}
				>
					<p class="text-muted-foreground">Search...</p>
					<kbd
						class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
					>
						<span class="text-xs">⌘</span>K
					</kbd>
				</Sidebar.MenuButton>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</form>
{/if}
<Command.Dialog bind:open>
	<Command.Input placeholder="Type a command or search..." />

	<Command.List>
		<Command.Group forceMount={true} heading="Assistant">
			<Command.Item
				forceMount={true}
				onSelect={() => {
					console.log('Ask Meÿia');
				}}
			>
				<Sparkles class="mr-2 size-4 " />
				<span>Ask Meÿia</span>
			</Command.Item>
		</Command.Group>

		<Command.Separator />
		<Command.Group heading="Search">
			<Command.Item>
				<Search class="mr-2 size-4" />
				<span>Search</span>
			</Command.Item>
			<Command.Item>
				<Smile class="mr-2 size-4" />
				<span>Search Emoji</span>
			</Command.Item>
			<Command.Item>
				<Calculator class="mr-2 size-4" />
				<span>Calculator</span>
			</Command.Item>
		</Command.Group>
		<Command.Separator />
		<Command.Group heading="Settings">
			<Command.Item>
				<User class="mr-2 size-4" />
				<span>Profile</span>
				<Command.Shortcut>⌘P</Command.Shortcut>
			</Command.Item>
			<Command.Item>
				<CreditCard class="mr-2 size-4" />
				<span>Billing</span>
				<Command.Shortcut>⌘B</Command.Shortcut>
			</Command.Item>
			<Command.Item>
				<Settings class="mr-2 size-4" />
				<span>Settings</span>
				<Command.Shortcut>⌘S</Command.Shortcut>
			</Command.Item>
		</Command.Group>
	</Command.List>
</Command.Dialog>
