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
	<h1>Welcome back {user?.name}</h1>
	<LogoutButton />
{/if}
