<script lang="ts">
	import AppSidebar from '$lib/components/sidebar/app-sidebar.svelte'
	import * as Sidebar from '$lib/components/ui/sidebar'
	let { children, data } = $props()
</script>

<Sidebar.Provider>
	<AppSidebar user={data?.session?.user} />
	<Sidebar.Inset class="h-dvh w-dvw overflow-hidden">
		{@render children()}
	</Sidebar.Inset>
</Sidebar.Provider>
