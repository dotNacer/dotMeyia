import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { embed } from 'ai'
import { env } from '$env/dynamic/private'

const google = createGoogleGenerativeAI({
	apiKey: env.GOOGLE_API_KEY,
})

const EMBEDDING_MODEL = 'text-embedding-004'
const EMBEDDING_DIMENSION = 768

const embeddingModel = google.textEmbeddingModel(EMBEDDING_MODEL, {
	outputDimensionality: EMBEDDING_DIMENSION,
	taskType: 'SEMANTIC_SIMILARITY',
})

/**
 * Génère un embedding pour un texte
 * Utilisé pour indexer les notes (document) et rechercher (query Fast Note)
 */
export async function generateEmbedding(text: string): Promise<number[]> {
	const { embedding } = await embed({
		model: embeddingModel,
		value: text,
	})
	return embedding
}

/**
 * Formate le texte d'une note pour l'embedding (title + content)
 */
export function formatNoteForEmbedding(title: string, content: string): string {
	return `${title}\n\n${content}`.trim()
}

export { EMBEDDING_DIMENSION }
