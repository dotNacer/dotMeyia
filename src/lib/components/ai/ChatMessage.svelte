<script lang="ts">
	import type { UIMessage } from '@ai-sdk/svelte';
	import { fade, slide } from 'svelte/transition';
	import { untrack } from 'svelte';
	import { marked } from 'marked';

	let { message }: { message: UIMessage } = $props();

	const isUser = message.role === 'user';
	const roleName = $derived(isUser ? 'Mido' : 'Meyïa');

	let displayedText = $state('');
	let wordIndex = $state(0);
	let animationComplete = $state(false);
	let wordDelay = $state(50); // ms entre chaque mot

	// Fonction pour rendre le markdown en HTML
	function renderMarkdown(text: string) {
		return marked(text);
	}

	$effect(() => {
		if (isUser) {
			// Pour les messages utilisateur, on affiche tout immédiatement
			untrack(() => {
				displayedText = message.content;
				animationComplete = true;
			});
			return;
		}

		// Pour l'IA, on affiche les mots un par un
		const allWords = message.content.split(' ');

		if (wordIndex >= allWords.length) {
			untrack(() => {
				animationComplete = true;
			});
			return;
		}

		// Si on a un nouveau mot, l'ajouter après un délai
		const timer = setTimeout(() => {
			if (wordIndex < allWords.length) {
				untrack(() => {
					displayedText = allWords.slice(0, wordIndex + 1).join(' ');
					wordIndex++;
				});
			}
		}, wordDelay);

		return () => clearTimeout(timer);
	});
</script>

<div class="flex flex-col {isUser ? 'items-end' : 'items-start'}">
	<div
		class="max-w-[80%] rounded-md px-4 py-2 {isUser
			? 'bg-primary text-primary-foreground'
			: 'bg-muted'}"
		transition:slide={{ duration: 100 }}
	>
		{#if isUser}
			<p>{message.content}</p>
		{:else}
			<p in:fade={{ duration: 100 }}>{@html renderMarkdown(displayedText)}</p>
		{/if}
	</div>
	<span class="mt-1 px-2 text-xs text-muted-foreground">{roleName}</span>
</div>
