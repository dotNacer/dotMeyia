import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Creates a debounced function that delays invoking the provided function
 * until after the specified wait time has elapsed since the last time it was invoked.
 *
 * @param fn The function to debounce
 * @param delay The number of milliseconds to delay
 * @returns A debounced version of the provided function
 */
export function debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay: number = 300
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    return (...args: Parameters<T>): void => {
        // Clear previous timeout
        if (timeoutId) {
            clearTimeout(timeoutId)
        }

        // Set new timeout
        timeoutId = setTimeout(() => {
            fn(...args)
        }, delay)
    }
}

export const PLACEHOLDER_CONTENTS = [
    'Who is Meÿia ?',
    "What's on your mind?",
    'What was Mido doing last night ?',
]
