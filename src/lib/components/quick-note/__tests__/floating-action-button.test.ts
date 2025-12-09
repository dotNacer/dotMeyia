import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import FloatingActionButton from '../floating-action-button.svelte';

describe('FloatingActionButton', () => {
	it('should render button', () => {
		const { getByRole } = render(FloatingActionButton);
		const button = getByRole('button');

		expect(button).toBeTruthy();
	});

	it('should call onclick handler when clicked', async () => {
		const handleClick = vi.fn();
		const { getByRole } = render(FloatingActionButton, { onclick: handleClick });
		const button = getByRole('button');

		await fireEvent.click(button);

		expect(handleClick).toHaveBeenCalledOnce();
	});

	it('should have proper accessibility attributes', () => {
		const { getByRole } = render(FloatingActionButton);
		const button = getByRole('button');

		expect(button.getAttribute('type')).toBe('button');
		expect(button.querySelector('.sr-only')).toBeTruthy();
	});

	it('should apply custom className', () => {
		const { getByRole } = render(FloatingActionButton, { class: 'custom-class' });
		const button = getByRole('button');

		expect(button.classList.contains('custom-class')).toBe(true);
	});

	it('should be hidden on desktop (md breakpoint)', () => {
		const { getByRole } = render(FloatingActionButton);
		const button = getByRole('button');

		expect(button.classList.contains('md:hidden')).toBe(true);
	});
});
