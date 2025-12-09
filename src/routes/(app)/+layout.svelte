<script lang="ts">
	import AppSidebar from '$lib/components/sidebar/app-sidebar.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { FloatingActionButton, QuickNoteSheet } from '$lib/components/quick-note';
	import { useKeyboardShortcut } from '$lib/hooks/use-keyboard-shortcut.svelte';
	import type { User } from 'better-auth';
	
	let { children, data } = $props();
	
	let quickNoteOpen = $state(false);
	
	// Keyboard shortcut: Cmd/Ctrl + K to open quick note
	useKeyboardShortcut(() => {
		quickNoteOpen = true;
	}, { key: 'k', meta: true, ctrl: true });
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
		
		<!-- Quick Note Feature -->
		<FloatingActionButton onclick={() => quickNoteOpen = true} />
		<QuickNoteSheet bind:open={quickNoteOpen} />
	</Sidebar.Inset>
</Sidebar.Provider>
