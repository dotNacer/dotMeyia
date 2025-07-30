<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
	import { User, Bot } from 'lucide-svelte';
	import Markdown from '$lib/components/ui/markdown.svelte';

	interface Props {
		message: {
			id: string;
			content: string;
			role: 'USER' | 'ASSISTANT';
			createdAt: string;
		};
	}

	let { message } = $props<Props>();

	let isUser = $derived(message.role === 'USER');
	let formattedTime = $derived(
		new Date(message.createdAt).toLocaleTimeString('fr-FR', {
			hour: '2-digit',
			minute: '2-digit'
		})
	);
</script>

<div class="flex gap-3 {isUser ? 'justify-end' : 'justify-start'}">
	{#if !isUser}
		<div class="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
			<Bot class="w-4 h-4 text-white" />
		</div>
	{/if}
	
	<Card class="max-w-[80%] {isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}">
		<CardContent class="p-3">
			{#if isUser}
				<p class="text-sm whitespace-pre-wrap">{message.content}</p>
			{:else}
				<Markdown content={message.content} />
			{/if}
			<p class="text-xs opacity-70 mt-2">
				{formattedTime}
			</p>
		</CardContent>
	</Card>

	{#if isUser}
		<div class="flex-shrink-0 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
			<User class="w-4 h-4 text-white" />
		</div>
	{/if}
</div>