<script lang="ts" module>
	import Home from '@lucide/svelte/icons/home';
	import FileText from '@lucide/svelte/icons/file-text';
	import BotMessageSquare from '@lucide/svelte/icons/bot-message-square';
	import BrainCircuit from '@lucide/svelte/icons/brain-circuit';
	// This is sample data.
	const data = {
		navMain: [
			{
				title: 'Main Navigation',
				url: '#',
				items: [
					{
						title: 'Dashboard',
						url: '/',
						icon: Home
					},
					{
						title: 'Notes',
						url: '/notes',
						icon: FileText
					},
					{
						title: 'Contexts',
						url: '/contexts',
						icon: BrainCircuit
					},
					{
						title: 'Test',
						url: '/test',
						icon: BotMessageSquare
					}
				]
			}
		]
	};
</script>

<script lang="ts">
	import NavMain from '$lib/components/sidebar/nav-main.svelte';
	import NavUser from '$lib/components/sidebar/nav-user.svelte';
	import NavSearch from '$lib/components/sidebar/nav-search.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	import type { User } from 'better-auth';
	let {
		user,
		ref = $bindable(null),
		collapsible = 'icon',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & { user: User } = $props();
</script>

<Sidebar.Root {collapsible} bind:ref {...restProps}>
	<Sidebar.Header>
		<NavUser {user} />
		<NavSearch />
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
	</Sidebar.Content>
	<Sidebar.Rail />
</Sidebar.Root>
