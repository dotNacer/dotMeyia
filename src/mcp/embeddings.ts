import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { embed } from 'ai'

const apiKey = process.env.GOOGLE_API_KEY
if (!apiKey) {
	throw new Error('GOOGLE_API_KEY environment variable is required')
}

const google = createGoogleGenerativeAI({ apiKey })

const EMBEDDING_MODEL = 'text-embedding-004'
const EMBEDDING_DIMENSION = 768

const embeddingModel = google.textEmbeddingModel(EMBEDDING_MODEL, {
	outputDimensionality: EMBEDDING_DIMENSION,
	taskType: 'SEMANTIC_SIMILARITY',
})

export async function generateEmbedding(text: string): Promise<number[]> {
	const { embedding } = await embed({
		model: embeddingModel,
		value: text,
	})
	return embedding
}

export function formatNoteForEmbedding(title: string, content: string): string {
	return `${title}\n\n${content}`.trim()
}
