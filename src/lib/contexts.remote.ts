import { query, command, getRequestEvent } from '$app/server'
import { requireAuth } from '$lib/server/authUtils'
import prisma from '$lib/server/prisma'
import type { AIContext, Note } from '@prisma/client'
import * as v from 'valibot'

// Types pour les contexts avec leurs notes
type ContextWithNotes = AIContext & { notes: Note[] }

// Schemas pour la validation
const contextIdSchema = v.pipe(v.string(), v.minLength(1))
const createContextSchema = v.object({
	title: v.pipe(v.string(), v.minLength(1)),
	prompt: v.string(),
	notes_ids: v.array(v.pipe(v.string(), v.minLength(1))),
})
const updateContextSchema = v.object({
	id: v.pipe(v.string(), v.minLength(1)),
	title: v.optional(v.pipe(v.string(), v.minLength(1))),
	prompt: v.optional(v.string()),
	notes_ids: v.optional(v.array(v.pipe(v.string(), v.minLength(1)))),
})

/**
 * Récupère tous les contexts de l'utilisateur authentifié avec leurs notes
 */
export const getContexts = query(async (): Promise<ContextWithNotes[]> => {
	const event = getRequestEvent()
	const user = await requireAuth(event)

	const contexts = await prisma.aIContext.findMany({
		where: { userId: user.id },
		include: { notes: true },
		orderBy: { createdAt: 'desc' },
	})

	return contexts
})

/**
 * Récupère un context spécifique par son ID avec ses notes
 */
export const getContext = query(
	contextIdSchema,
	async (id: string): Promise<ContextWithNotes | null> => {
		const event = getRequestEvent()
		const user = await requireAuth(event)

		const context = await prisma.aIContext.findFirst({
			where: {
				id,
				userId: user.id,
			},
			include: { notes: true },
		})

		return context
	}
)

/**
 * Crée un nouveau context pour l'utilisateur authentifié
 */
export const createContext = command(
	createContextSchema,
	async ({
		title,
		prompt,
		notes_ids,
	}: {
		title: string
		prompt: string
		notes_ids: string[]
	}): Promise<ContextWithNotes> => {
		const event = getRequestEvent()
		const user = await requireAuth(event)

		// Vérifier que toutes les notes appartiennent à l'utilisateur
		const userNotes = await prisma.note.findMany({
			where: {
				id: { in: notes_ids },
				userId: user.id,
			},
		})

		if (userNotes.length !== notes_ids.length) {
			throw new Error('Some notes do not belong to the user')
		}

		const context = await prisma.aIContext.create({
			data: {
				title,
				prompt,
				userId: user.id,
				notes: {
					connect: notes_ids.map((id) => ({ id })),
				},
			},
			include: { notes: true },
		})

		return context
	}
)

/**
 * Met à jour un context existant
 */
export const updateContext = command(
	updateContextSchema,
	async ({
		id,
		title,
		prompt,
		notes_ids,
	}: {
		id: string
		title?: string
		prompt?: string
		notes_ids?: string[]
	}): Promise<ContextWithNotes | null> => {
		const event = getRequestEvent()
		const user = await requireAuth(event)

		// Vérifier que le context appartient à l'utilisateur
		const existingContext = await prisma.aIContext.findFirst({
			where: { id, userId: user.id },
		})

		if (!existingContext) {
			return null
		}

		// Si des notes sont spécifiées, vérifier qu'elles appartiennent à l'utilisateur
		if (notes_ids) {
			const userNotes = await prisma.note.findMany({
				where: {
					id: { in: notes_ids },
					userId: user.id,
				},
			})

			if (userNotes.length !== notes_ids.length) {
				throw new Error('Some notes do not belong to the user')
			}
		}

		// Construire les données de mise à jour
		const updateData: any = {}
		if (title !== undefined) updateData.title = title
		if (prompt !== undefined) updateData.prompt = prompt
		if (notes_ids !== undefined) {
			updateData.notes = {
				set: notes_ids.map((id) => ({ id })),
			}
		}

		const updatedContext = await prisma.aIContext.update({
			where: { id },
			data: updateData,
			include: { notes: true },
		})

		return updatedContext
	}
)

/**
 * Supprime un context
 */
export const deleteContext = command(contextIdSchema, async (id: string): Promise<boolean> => {
	const event = getRequestEvent()
	const user = await requireAuth(event)

	// Vérifier que le context appartient à l'utilisateur
	const existingContext = await prisma.aIContext.findFirst({
		where: { id, userId: user.id },
	})

	if (!existingContext) {
		return false
	}

	await prisma.aIContext.delete({
		where: { id },
	})

	return true
})
