import prisma from './prisma';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

/**
 * Extract keywords from content using simple NLP techniques
 */
function extractKeywords(text: string): string[] {
	// Remove common stop words and get unique important words
	const stopWords = new Set([
		'a',
		'an',
		'the',
		'is',
		'are',
		'was',
		'were',
		'be',
		'been',
		'being',
		'have',
		'has',
		'had',
		'do',
		'does',
		'did',
		'will',
		'would',
		'should',
		'could',
		'may',
		'might',
		'must',
		'can',
		'of',
		'at',
		'by',
		'for',
		'with',
		'about',
		'against',
		'between',
		'into',
		'through',
		'during',
		'before',
		'after',
		'above',
		'below',
		'to',
		'from',
		'up',
		'down',
		'in',
		'out',
		'on',
		'off',
		'over',
		'under',
		'again',
		'further',
		'then',
		'once',
		'here',
		'there',
		'when',
		'where',
		'why',
		'how',
		'all',
		'both',
		'each',
		'few',
		'more',
		'most',
		'other',
		'some',
		'such',
		'no',
		'nor',
		'not',
		'only',
		'own',
		'same',
		'so',
		'than',
		'too',
		'very',
		'and',
		'or',
		'but',
		'if',
		'as',
		'until',
		'while'
	]);

	const words = text
		.toLowerCase()
		.replace(/[^\w\s]/g, ' ')
		.split(/\s+/)
		.filter((word) => word.length > 3 && !stopWords.has(word));

	// Get unique words with their frequency
	const wordFreq = new Map<string, number>();
	words.forEach((word) => {
		wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
	});

	// Return top keywords sorted by frequency
	return Array.from(wordFreq.entries())
		.sort((a, b) => b[1] - a[1])
		.slice(0, 10)
		.map(([word]) => word);
}

/**
 * Calculate keyword-based similarity between two texts
 */
function calculateKeywordSimilarity(keywords1: string[], keywords2: string[]): number {
	const set1 = new Set(keywords1);
	const set2 = new Set(keywords2);
	const intersection = new Set([...set1].filter((x) => set2.has(x)));

	if (set1.size === 0 && set2.size === 0) return 0;

	const union = new Set([...set1, ...set2]);
	return intersection.size / union.size;
}

/**
 * Use AI to determine semantic similarity between texts
 */
async function calculateSemanticSimilarity(text1: string, text2: string): Promise<number> {
	try {
		const prompt = `Compare the following two texts and rate their semantic similarity on a scale from 0.0 to 1.0, where:
- 0.0 means completely unrelated topics
- 0.3-0.5 means somewhat related or tangentially connected
- 0.6-0.8 means closely related or about the same general topic
- 0.9-1.0 means virtually identical or extremely similar

Text 1: "${text1.slice(0, 500)}"
Text 2: "${text2.slice(0, 500)}"

Respond with ONLY a number between 0.0 and 1.0, nothing else.`;

		const { text } = await generateText({
			model: google('gemini-2.0-flash-exp'),
			prompt,
			maxTokens: 10
		});

		const similarity = parseFloat(text.trim());
		return isNaN(similarity) ? 0 : Math.max(0, Math.min(1, similarity));
	} catch (error) {
		console.error('Error calculating semantic similarity:', error);
		return 0;
	}
}

/**
 * Detect similar notes using hybrid approach (keywords + AI embeddings)
 */
export async function detectSimilarNotes(
	content: string,
	userId: string
): Promise<Array<{ id: string; title: string; similarity: number }>> {
	const userNotes = await prisma.note.findMany({
		where: { userId },
		select: { id: true, title: true, content: true }
	});

	if (userNotes.length === 0) {
		return [];
	}

	const inputKeywords = extractKeywords(content);
	const similarities: Array<{ id: string; title: string; similarity: number }> = [];

	// Calculate similarities for each note
	for (const note of userNotes) {
		const noteKeywords = extractKeywords(`${note.title} ${note.content}`);
		const keywordSimilarity = calculateKeywordSimilarity(inputKeywords, noteKeywords);

		// Only calculate semantic similarity for notes with some keyword match
		let semanticSimilarity = 0;
		if (keywordSimilarity > 0.1) {
			semanticSimilarity = await calculateSemanticSimilarity(
				content,
				`${note.title} ${note.content}`
			);
		}

		// Combine both similarities (weighted average: 40% keywords, 60% semantic)
		const combinedSimilarity = keywordSimilarity * 0.4 + semanticSimilarity * 0.6;

		if (combinedSimilarity > 0.3) {
			// Only include notes with > 30% similarity
			similarities.push({
				id: note.id,
				title: note.title,
				similarity: combinedSimilarity
			});
		}
	}

	// Return top 3 most similar notes
	return similarities.sort((a, b) => b.similarity - a.similarity).slice(0, 3);
}

/**
 * Generate a meaningful title from note content using AI
 */
export async function generateNoteTitle(content: string): Promise<string> {
	try {
		const prompt = `Generate a concise, descriptive title (max 60 characters) for the following note content. The title should capture the main topic or key idea. Respond with ONLY the title, nothing else.

Content: "${content.slice(0, 500)}"`;

		const { text } = await generateText({
			model: google('gemini-2.0-flash-exp'),
			prompt,
			maxTokens: 20
		});

		const title = text.trim().replace(/^["']|["']$/g, ''); // Remove quotes if present
		return title || 'Quick Note';
	} catch (error) {
		console.error('Error generating title:', error);
		// Fallback: use first line or first few words
		const firstLine = content.split('\n')[0].trim();
		return firstLine.slice(0, 60) || 'Quick Note';
	}
}
