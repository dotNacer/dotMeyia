import { writable } from 'svelte/store'
import type { ApiKey } from '@prisma/client'

type ApiKeyDTO = Pick<ApiKey, 'name' | 'expiresAt'>
type ApiKeyWithMaskedToken = Omit<ApiKey, 'token'> & { token: string }

function createApiKeyStore() {
    const { subscribe, set, update } = writable<ApiKeyWithMaskedToken[]>([])

    return {
        subscribe,

        async fetch() {
            try {
                const response = await fetch('/api/api-keys')
                if (response.ok) {
                    const apiKeys = await response.json()
                    set(apiKeys)
                } else {
                    console.error('Erreur lors du chargement des clés API')
                }
            } catch (error) {
                console.error('Erreur:', error)
                throw error
            }
        },

        async create(apiKeyData: ApiKeyDTO): Promise<ApiKey | null> {
            try {
                const response = await fetch('/api/api-keys', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(apiKeyData),
                })

                if (response.ok) {
                    const newApiKey = await response.json()
                    // Rafraîchir la liste
                    this.fetch()
                    return newApiKey
                } else {
                    const error = await response.json()
                    console.error('Erreur lors de la création:', error)
                    return null
                }
            } catch (error) {
                console.error('Erreur:', error)
                return null
            }
        },

        async delete(id: string): Promise<boolean> {
            try {
                const response = await fetch(`/api/api-keys/${id}`, {
                    method: 'DELETE',
                })

                if (response.ok) {
                    update((apiKeys) => apiKeys.filter((key) => key.id !== id))
                    return true
                } else {
                    console.error('Erreur lors de la suppression')
                    return false
                }
            } catch (error) {
                console.error('Erreur:', error)
                return false
            }
        },

        async toggleActive(id: string, isActive: boolean): Promise<boolean> {
            try {
                const response = await fetch(`/api/api-keys/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ isActive }),
                })

                if (response.ok) {
                    const updatedApiKey = await response.json()
                    update((apiKeys) =>
                        apiKeys.map((key) =>
                            key.id === id
                                ? { ...key, isActive: updatedApiKey.isActive }
                                : key
                        )
                    )
                    return true
                } else {
                    console.error('Erreur lors de la mise à jour')
                    return false
                }
            } catch (error) {
                console.error('Erreur:', error)
                return false
            }
        },
    }
}

export const apiKeys = createApiKeyStore()
