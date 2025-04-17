<script lang="ts">
	import { Loader, Save } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';

	let showSaved = $state(false);
	let visible = $state(false);

	export function triggerSaveAnimation() {
		visible = true;
		setTimeout(() => {
			showSaved = true;
		}, 300);

		setTimeout(() => {
			showSaved = false;
		}, 900);

		// Hide component after animation completes
		setTimeout(() => {
			visible = false;
		}, 800);
	}
</script>

{#if visible}
	<div class="relative h-6 w-6" in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
		{#if !showSaved}
			<div in:fade={{ duration: 200 }}>
				<Loader class="h-6 w-6 animate-spin" />
			</div>
		{:else}
			<div in:fly={{ y: 5, duration: 300 }} out:fade={{ duration: 200 }}>
				<Save class="h-6 w-6 animate-pulse" />
			</div>
		{/if}
	</div>
{/if}
