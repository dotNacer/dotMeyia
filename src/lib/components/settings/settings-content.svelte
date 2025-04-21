<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as Select from '$lib/components/ui/select';
	// TODO : C'est degueux et peu modulable,
	// mettre les settings available dans un fichier autre ?

	// Au pire nsm je verrais mais ça marche pour le moment
	let { selectedID }: { selectedID: string } = $props();

	import { contexts } from '$lib/stores/contexts';
	import { onMount } from 'svelte';

	let favoriteContext: string | undefined = $state(contexts.selected.get() as string);

	onMount(() => {
		contexts.fetch();
	});

	function changeFavoriteContext() {
		if (!favoriteContext) return;
		contexts.selected.select(favoriteContext);
	}
</script>

<Sidebar.Inset class="h-full w-full gap-2 p-4">
	{#if selectedID === 'ai-settings'}
		<h1>Favorite Context</h1>
		<Select.Root type="single" bind:value={favoriteContext} onValueChange={changeFavoriteContext}>
			<Select.Trigger>
				{$contexts.find((context) => context.id === favoriteContext)?.title}
			</Select.Trigger>
			<Select.Content>
				{#each $contexts as context}
					<Select.Item value={context.id}>{context.title}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	{:else if selectedID === 'user-settings'}
		<h1>User Settings</h1>
	{/if}
</Sidebar.Inset>
