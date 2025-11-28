import { embed } from 'ai'
import google from '$lib/server/ai'

export async function generateEmbedding(text: string) {
	try {
		const { embedding } = await embed({
			model: google.textEmbeddingModel('text-embedding-004'),
			value: text,
		})
		return embedding
	} catch (error) {
		console.error('Error generating embedding:', error)
		return null
	}
}
