<script lang="ts">
	import type { User } from 'better-auth';
	import { onMount } from 'svelte';
	import LogoutButton from '$lib/components/auth/LogoutButton.svelte';
	let user = $state<User | null>(null);
	let loaded = $state(false);

	let { data } = $props();
	onMount(async () => {
		user = data?.session?.user ?? null;
		loaded = true;
	});
</script>

{#if loaded}
	<h1 class="text-2xl font-bold">Welcome back</h1>

	<div class="flex items-center gap-2">
		<img src={user?.image} alt={user?.name} class="h-10 w-10 rounded-full" />
		<span>{user?.name}</span>
	</div>
{/if}
