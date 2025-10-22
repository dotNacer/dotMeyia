<script lang="ts">
	import { page } from '$app/stores'
	import ExpandableButton from './ExpandableButton.svelte'
	import { Button } from '$lib/components/ui/button'
	import { Plus } from 'lucide-svelte'
	import { Settings } from 'lucide-svelte'

	function handleAdd() {
		console.log('add')
	}

	let pages = ['home', 'notes', 'contexts', 'test']

	let buttonToShow: ('notes' | 'contexts') | null = $derived.by(() => {
		switch ($page.url.pathname) {
			case '/notes':
				return 'notes'
			case '/contexts':
				return 'contexts'
			default:
				return null
		}
	})
</script>

{#if buttonToShow}
	<div class="m-4 flex justify-end">
		<ExpandableButton title="Actions rapides">
			{#snippet icon()}
				<Settings class="size-6 text-primary-foreground" />
			{/snippet}

			<Button variant="outline" class="rounded-2xl" onclick={handleAdd}>
				<Plus class="size-4" />
				Ajouter un élément
			</Button>

			<Button variant="outline" class="rounded-2xl" onclick={handleAdd}>
				<Plus class="size-4" />
				Autre action
			</Button>
		</ExpandableButton>
	</div>
{/if}
