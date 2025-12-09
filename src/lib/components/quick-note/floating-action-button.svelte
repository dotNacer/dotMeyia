<script lang="ts">
	import { Plus } from 'lucide-svelte';
	import { cn } from '$lib/utils';

	let {
		onclick,
		class: className,
		...restProps
	}: {
		onclick?: () => void;
		class?: string;
	} = $props();
</script>

<button
	type="button"
	onclick={onclick}
	class={cn(
		'fixed bottom-6 right-6 z-50',
		'flex h-14 w-14 items-center justify-center',
		'rounded-full bg-primary text-primary-foreground shadow-lg',
		'transition-all duration-200 hover:scale-110 hover:shadow-xl',
		'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
		'md:hidden', // Only show on mobile
		className
	)}
	{...restProps}
>
	<Plus class="h-6 w-6" />
	<span class="sr-only">Add quick note</span>
</button>
