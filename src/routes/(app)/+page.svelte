<script lang="ts">
	import type { User } from 'better-auth'
	import { onMount } from 'svelte'
	import MeyiaButton from '$lib/components/dashboard/MeyiaButton.svelte'
	import FastNoteInput from '$lib/components/fast-note/fast-note-input.svelte'
	import * as Avatar from '$lib/components/ui/avatar'
	import { goto } from '$app/navigation'

	let user = $state<User | null>(null)
	let loaded = $state(false)

	let { data } = $props()
	onMount(async () => {
		user = data?.session?.user ?? null
		loaded = true
	})
</script>

<MeyiaButton />
{#if loaded}
	<div class="flex h-full w-full flex-col items-center justify-center gap-8 px-4">
		<div class="flex flex-col items-center gap-4">
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
		<div class="w-full max-w-xl">
			<p class="mb-2 text-center text-sm text-muted-foreground">Fast Note</p>
			<FastNoteInput />
		</div>
		<div class="flex gap-2">
			<button
				class="text-sm text-muted-foreground underline hover:text-foreground"
				onclick={() => goto('/fast-notes')}
			>
				Voir l'historique
			</button>
		</div>
	</div>
{/if}
