<script lang="ts">
	import type { User } from 'better-auth';
	import { onMount } from 'svelte';
	import MeyiaButton from '$lib/components/dashboard/MeyiaButton.svelte';
	let user = $state<User | null>(null);
	let loaded = $state(false);
	import * as Avatar from '$lib/components/ui/avatar';

	let { data } = $props();
	onMount(async () => {
		user = data?.session?.user ?? null;
		loaded = true;
	});
</script>

<MeyiaButton />
{#if loaded}
	<div class="flex h-full w-full items-center justify-center">
		<div class="flex flex-col items-center justify-center">
			<h1 class="text-2xl font-bold">Welcome back</h1>
			<div class="flex items-center gap-2">
				<Avatar.Root>
					<Avatar.Image src={user?.image} alt={user?.name} />
					<Avatar.Fallback>
						{user?.name
							?.split(' ')
							.map((n) => n[0])
							.join('')}
					</Avatar.Fallback>
				</Avatar.Root>
				<span>{user?.name}</span>
			</div>
		</div>
	</div>
{/if}
