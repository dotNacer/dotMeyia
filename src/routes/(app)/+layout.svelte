<script lang="ts">
	import AppSidebar from '$lib/components/sidebar/app-sidebar.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import type { User } from 'better-auth';
	let { children, data } = $props();
</script>

<Sidebar.Provider>
	<AppSidebar user={data?.session?.user satisfies User} />
	<Sidebar.Inset class="h-screen w-screen overflow-hidden">
		{@render children()}
	</Sidebar.Inset>
</Sidebar.Provider>
