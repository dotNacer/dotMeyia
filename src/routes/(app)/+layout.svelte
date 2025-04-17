<script lang="ts">
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import type { User } from 'better-auth';
	let { children, data } = $props();
</script>

<Sidebar.Provider>
	<AppSidebar user={data?.session?.user satisfies User} />
	<Sidebar.Inset>
		{@render children()}
	</Sidebar.Inset>
</Sidebar.Provider>
