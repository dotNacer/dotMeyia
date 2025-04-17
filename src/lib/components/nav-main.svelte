<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { page } from '$app/stores';
	let {
		items
	}: {
		items: {
			title: string;
			url: string;
			// this should be `Component` after lucide-svelte updates types
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			icon?: any;
			isActive?: boolean;
			items?: {
				title: string;
				url: string;
				icon?: any;
			}[];
		}[];
	} = $props();
</script>

{#each items as group}
	<Sidebar.Group>
		<Sidebar.GroupContent>
			<Sidebar.Menu>
				{#if group.items}
					{#each group.items as item (item.title)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton
								isActive={item.url.split('/')[1] === $page.url.pathname.split('/')[1]}
							>
								{#snippet tooltipContent()}
									{item.title}
								{/snippet}
								{#snippet child({ props })}
									<a href={item.url} {...props}>
										{#if item.icon}
											<item.icon class="size-4" />
										{/if}
										{item.title}</a
									>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				{/if}
			</Sidebar.Menu>
		</Sidebar.GroupContent>
	</Sidebar.Group>
{/each}
