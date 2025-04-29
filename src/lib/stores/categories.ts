import { writable } from 'svelte/store'
import type { Category } from '@prisma/client'

type CategoryDTO = Pick<Category, 'title' | 'weight'>

const createCategoriesStore = () => {
    const { subscribe, set, update } = writable<Category[]>([])

    return {
        subscribe,
        set,
        update,
        fetch: async () => {
            const response = await fetch('/api/categories')
            const data = await response.json()
            set((data satisfies Category[]) || [])
        },
        get: async (id: string) => {
            const response = await fetch(`/api/categories/${id}`)
            const data = await response.json()
            return data satisfies Category | null
        },
        edit: async (id: string, category: CategoryDTO) => {
            const response = await fetch(`/api/categories/${id}`, {
                method: 'PUT',
                body: JSON.stringify(category),
            })
            const data = await response.json()
            update((categories) =>
                categories.map((c) => (c.id === id ? data : c))
            )
        },
        create: async (category: CategoryDTO) => {
            const response = await fetch('/api/categories', {
                method: 'POST',
                body: JSON.stringify(category),
            })
            const data = await response.json()
            update((categories) => [...categories, data satisfies Category])
            return data satisfies Category
        },
        delete: async (id: string) => {
            await fetch(`/api/categories/${id}`, { method: 'DELETE' })
            update((categories) => categories.filter((c) => c.id !== id))
        },
    }
}

export const categories = createCategoriesStore()
