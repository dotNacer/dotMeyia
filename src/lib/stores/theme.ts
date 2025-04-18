import { writable } from 'svelte/store'

function createThemeStore() {
    const { subscribe, set, update } = writable(false)

    return {
        subscribe,
        initialize: () => {
            if (typeof window === 'undefined') return false

            const isDark =
                localStorage.theme === 'dark' ||
                (!('theme' in localStorage) &&
                    window.matchMedia('(prefers-color-scheme: dark)').matches)

            set(isDark)
            updateTheme(isDark)
            return isDark
        },
        toggle: () => {
            update((isDark) => {
                const newValue = !isDark
                updateTheme(newValue)
                return newValue
            })
        },
    }
}

function updateTheme(isDark: boolean) {
    if (typeof window === 'undefined') return

    if (isDark) {
        document.documentElement.classList.add('dark')
        localStorage.theme = 'dark'
    } else {
        document.documentElement.classList.remove('dark')
        localStorage.theme = 'light'
    }
}

export const themeStore = createThemeStore()
