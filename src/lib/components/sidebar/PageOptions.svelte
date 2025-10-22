<script lang="ts">
	import { page } from '$app/stores'
	import { NotesActions, ContextsActions } from '../page-actions'

	let currentPage = $derived.by(() => {
		const pathname = $page.url.pathname
		if (pathname === '/notes') return 'notes'
		if (pathname === '/contexts') return 'contexts'
		return null
	})
</script>

{#if currentPage === 'notes'}
	<div class="m-4 flex justify-end">
		<NotesActions />
	</div>
{:else if currentPage === 'contexts'}
	<div class="m-4 flex justify-end">
		<ContextsActions />
	</div>
{/if}
