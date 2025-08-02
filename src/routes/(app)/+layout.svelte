<script lang="ts">
	import AppSidebar from '$lib/components/sidebar/app-sidebar.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import type { User } from 'better-auth';
	let { children, data } = $props();
</script>

<Sidebar.Provider>
	<AppSidebar user={data?.session?.user satisfies User} />
	<Sidebar.Inset class="h-screen w-screen overflow-hidden">
		<!-- Trigger mobile pour ouvrir la sidebar -->
		<!-- TODO: Remplacer par une bottom bar plus propre -->
		<div class="fixed left-4 top-4 z-50 md:hidden">
			<Sidebar.Trigger />
		</div>
		{@render children()}
	</Sidebar.Inset>
</Sidebar.Provider>
