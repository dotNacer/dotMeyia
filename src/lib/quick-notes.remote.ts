import { query, command, getRequestEvent } from '$app/server';
import { requireAuth } from '$lib/server/authUtils';
import prisma from '$lib/server/prisma';
import { detectSimilarNotes, generateNoteTitle } from '$lib/server/similarity';
import type { Note } from '@prisma/client';
import * as v from 'valibot';

const createQuickNoteSchema = v.object({
	content: v.pipe(v.string(), v.minLength(1)),
	mergeWithNoteId: v.optional(v.string())
});

export const findSimilarNotes = query(
	v.pipe(v.string(), v.minLength(1)),
	async (
		content: string
	): Promise<Array<{ id: string; title: string; similarity: number }>> => {
		const event = getRequestEvent();
		const user = await requireAuth(event);

		const similarNotes = await detectSimilarNotes(content, user.id);
		return similarNotes;
	}
);

export const createQuickNote = command(
	createQuickNoteSchema,
	async ({
		content,
		mergeWithNoteId
	}: {
		content: string;
		mergeWithNoteId?: string;
	}): Promise<{ note: Note; merged: boolean }> => {
		const event = getRequestEvent();
		const user = await requireAuth(event);

		// If merging with existing note
		if (mergeWithNoteId) {
			const existingNote = await prisma.note.findFirst({
				where: {
					id: mergeWithNoteId,
					userId: user.id
				}
			});

			if (!existingNote) {
				throw new Error('Note not found');
			}

			// Append content to existing note with a separator
			const updatedContent = `${existingNote.content}\n\n---\n\n${content}`;

			const updatedNote = await prisma.note.update({
				where: { id: mergeWithNoteId },
				data: {
					content: updatedContent,
					updatedAt: new Date()
				}
			});

			return { note: updatedNote, merged: true };
		}

		// Create new note
		const title = await generateNoteTitle(content);

		const note = await prisma.note.create({
			data: {
				title,
				content,
				userId: user.id
			}
		});

		return { note, merged: false };
	}
);
