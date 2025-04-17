<script lang="ts">
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import { Label } from '$lib/components/ui/label';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import type { WithElementRef } from 'bits-ui';
	import { Search } from 'lucide-svelte';
	import type { HTMLFormAttributes } from 'svelte/elements';

	import Calculator from 'lucide-svelte/icons/calculator';
	import Calendar from 'lucide-svelte/icons/calendar';
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
				<Sidebar.Input
					id="search"
					placeholder="Search..."
					class="pl-8"
					onclick={(e) => {
						open = !open;
						e.preventDefault();
					}}
				/>

				<Search
					class="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50"
				/>
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
		<Command.Group heading="Suggestions">
			<Command.Item>
				<Calendar class="mr-2 size-4" />
				<span>Calendar</span>
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
