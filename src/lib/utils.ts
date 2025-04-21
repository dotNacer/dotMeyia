import { type ClassValue, clsx } from 'clsx'
import { User, BrainCircuit } from 'lucide-svelte'
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

export const SETTINGS_CATEGORIES = [
    {
        id: 'ai-settings',
        title: 'AI Settings',
        icon: BrainCircuit,
    },
    {
        id: 'user-settings',
        title: 'User Settings',
        icon: User,
    },
]

// Helper to safely access localStorage (for SSR compatibility)
export const getFromLocalStorage = (key: string): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(key)
    }
    return null
}

export const saveToLocalStorage = (key: string, value: string | null): void => {
    if (typeof window !== 'undefined') {
        if (value === null) {
            localStorage.removeItem(key)
        } else {
            localStorage.setItem(key, value)
        }
    }
}
