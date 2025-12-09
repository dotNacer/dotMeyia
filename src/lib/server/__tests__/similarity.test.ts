import { describe, it, expect, beforeEach, vi } from 'vitest';
import { detectSimilarNotes, generateNoteTitle } from '../similarity';
import prisma from '../prisma';

// Mock Prisma
vi.mock('../prisma', () => ({
	default: {
		note: {
			findMany: vi.fn()
		}
	}
}));

// Mock AI SDK
vi.mock('ai', () => ({
	generateText: vi.fn()
}));

describe('Similarity Detection', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('detectSimilarNotes', () => {
		it('should return empty array when user has no notes', async () => {
			vi.mocked(prisma.note.findMany).mockResolvedValue([]);

			const result = await detectSimilarNotes('Test content', 'user-id');

			expect(result).toEqual([]);
		});

		it('should detect similar notes based on keywords', async () => {
			const mockNotes = [
				{
					id: '1',
					title: 'JavaScript Tips',
					content: 'Some JavaScript programming tips and tricks'
				},
				{
					id: '2',
					title: 'Python Guide',
					content: 'A guide to Python programming language'
				},
				{
					id: '3',
					title: 'Cooking Recipe',
					content: 'How to make a delicious pasta'
				}
			];

			vi.mocked(prisma.note.findMany).mockResolvedValue(mockNotes as any);

			// Mock AI responses
			const { generateText } = await import('ai');
			vi.mocked(generateText).mockResolvedValue({ text: '0.8' } as any);

			const result = await detectSimilarNotes('JavaScript programming tutorial', 'user-id');

			expect(result.length).toBeGreaterThan(0);
			expect(result[0].id).toBe('1'); // JavaScript note should be most similar
		});

		it('should return top 3 most similar notes', async () => {
			const mockNotes = Array.from({ length: 10 }, (_, i) => ({
				id: `${i}`,
				title: `Note ${i}`,
				content: `Content about programming and development ${i}`
			}));

			vi.mocked(prisma.note.findMany).mockResolvedValue(mockNotes as any);

			const { generateText } = await import('ai');
			vi.mocked(generateText).mockResolvedValue({ text: '0.5' } as any);

			const result = await detectSimilarNotes('Programming tutorial', 'user-id');

			expect(result.length).toBeLessThanOrEqual(3);
		});
	});

	describe('generateNoteTitle', () => {
		it('should generate a title using AI', async () => {
			const { generateText } = await import('ai');
			vi.mocked(generateText).mockResolvedValue({ text: 'Generated Title' } as any);

			const result = await generateNoteTitle('This is some note content about programming');

			expect(result).toBe('Generated Title');
		});

		it('should fallback to first line if AI fails', async () => {
			const { generateText } = await import('ai');
			vi.mocked(generateText).mockRejectedValue(new Error('AI error'));

			const content = 'First line of content\nSecond line';
			const result = await generateNoteTitle(content);

			expect(result).toBe('First line of content');
		});

		it('should use "Quick Note" as ultimate fallback', async () => {
			const { generateText } = await import('ai');
			vi.mocked(generateText).mockRejectedValue(new Error('AI error'));

			const result = await generateNoteTitle('');

			expect(result).toBe('Quick Note');
		});
	});
});
