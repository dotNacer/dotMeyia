<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Send, Loader2 } from 'lucide-svelte';

	interface Props {
		onSend: (message: string) => void;
		disabled?: boolean;
		loading?: boolean;
		placeholder?: string;
	}

	let { 
		onSend, 
		disabled = false, 
		loading = false, 
		placeholder = "Tapez votre message..." 
	} = $props<Props>();

	let messageInput = $state('');

	let canSend = $derived(messageInput.trim().length > 0 && !disabled && !loading);

	function handleSend() {
		if (!canSend) return;
		
		const message = messageInput.trim();
		messageInput = '';
		onSend(message);
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			handleSend();
		}
	}
</script>

<div class="flex gap-3">
	<Input
		bind:value={messageInput}
		placeholder={placeholder}
		on:keypress={handleKeyPress}
		disabled={disabled || loading}
		class="flex-1"
	/>
	<Button 
		on:click={handleSend} 
		disabled={!canSend}
		size="icon"
	>
		{#if loading}
			<Loader2 class="w-4 h-4 animate-spin" />
		{:else}
			<Send class="w-4 h-4" />
		{/if}
	</Button>
</div>