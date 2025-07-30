<script lang="ts">
	import { marked } from 'marked';
	import { onMount } from 'svelte';

	interface Props {
		content: string;
		class?: string;
	}

	let { content, class: className = '' } = $props<Props>();
	let container = $state<HTMLElement>();
	let htmlContent = $derived(marked(content));

	onMount(() => {
		if (container) {
			// Appliquer les styles Tailwind aux éléments markdown
			const elements = container.querySelectorAll('*');
			elements.forEach((element) => {
				const tagName = element.tagName.toLowerCase();
				
				switch (tagName) {
					case 'p':
						element.classList.add('mb-3', 'last:mb-0');
						break;
					case 'h1':
						element.classList.add('text-lg', 'font-semibold', 'mb-2', 'mt-4', 'first:mt-0');
						break;
					case 'h2':
						element.classList.add('text-base', 'font-semibold', 'mb-2', 'mt-4', 'first:mt-0');
						break;
					case 'h3':
					case 'h4':
					case 'h5':
					case 'h6':
						element.classList.add('text-sm', 'font-semibold', 'mb-2', 'mt-4', 'first:mt-0');
						break;
					case 'ul':
						element.classList.add('mb-3', 'pl-5', 'list-disc');
						break;
					case 'ol':
						element.classList.add('mb-3', 'pl-5', 'list-decimal');
						break;
					case 'li':
						element.classList.add('mb-1');
						break;
					case 'blockquote':
						element.classList.add('border-l-4', 'border-gray-300', 'dark:border-gray-600', 'pl-4', 'italic', 'my-3');
						break;
					case 'code':
						if (element.parentElement?.tagName.toLowerCase() === 'pre') {
							element.classList.add('bg-transparent', 'p-0');
						} else {
							element.classList.add('bg-gray-200', 'dark:bg-gray-700', 'px-1', 'py-0.5', 'rounded', 'text-xs');
						}
						break;
					case 'pre':
						element.classList.add('bg-gray-100', 'dark:bg-gray-800', 'p-3', 'rounded-lg', 'overflow-x-auto', 'my-3');
						break;
					case 'a':
						element.classList.add('text-blue-600', 'dark:text-blue-400', 'underline');
						break;
					case 'strong':
						element.classList.add('font-semibold');
						break;
					case 'em':
						element.classList.add('italic');
						break;
				}
			});
		}
	});
</script>

<div 
	bind:this={container}
	class="text-sm leading-relaxed {className}"
	set:html={htmlContent}
/>