<script lang="ts">
	import { Pen } from 'lucide-svelte'
	import PageOptions from './PageOptions.svelte'
</script>

<div class="fixed bottom-0 z-50 w-full justify-self-center">
	<PageOptions />
	<div class="m-4 flex justify-between rounded-3xl bg-green-500 px-4 py-8">
		<a href="/" class="bg-red-500">
			<Pen />
		</a>
		<a href="/notes">
			<Pen />
		</a>
		<a href="/contexts">
			<Pen />
		</a>
		<a href="/test">
			<Pen />
		</a>
	</div>
</div>
