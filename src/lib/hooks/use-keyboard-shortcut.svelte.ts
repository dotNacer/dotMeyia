import { onMount, onDestroy } from 'svelte';

interface KeyboardShortcutOptions {
	key: string;
	ctrl?: boolean;
	meta?: boolean;
	shift?: boolean;
	alt?: boolean;
}

export function useKeyboardShortcut(
	callback: () => void,
	options: KeyboardShortcutOptions
): void {
	const handleKeydown = (e: KeyboardEvent) => {
		const { key, ctrl = false, meta = false, shift = false, alt = false } = options;

		const ctrlOrMeta = ctrl || meta;
		const matchesModifiers =
			(!ctrlOrMeta || (e.ctrlKey || e.metaKey)) &&
			(shift === e.shiftKey) &&
			(alt === e.altKey);

		if (matchesModifiers && e.key.toLowerCase() === key.toLowerCase()) {
			e.preventDefault();
			callback();
		}
	};

	onMount(() => {
		document.addEventListener('keydown', handleKeydown);
	});

	onDestroy(() => {
		document.removeEventListener('keydown', handleKeydown);
	});
}
