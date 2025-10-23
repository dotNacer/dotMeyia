import google from './server/ai'
import { generateText } from 'ai'
import { getRequestEvent, query } from '$app/server'
import prisma from './server/prisma'
import * as v from 'valibot'
import { requireAuth } from './server/authUtils'
import { extractJSON } from './utils'
export const analyseFastNote = query(v.string(), async (note: string): Promise<object> => {
	const event = getRequestEvent()
	const user = await requireAuth(event)

	const notes = await prisma.note.findMany({
		where: {
			userId: user.id,
		},
	})

	const prompt = `
	Tu es un assistant spécialisé dans la correspondance sémantique de notes. Ta seule tâche est d'analyser si une idée utilisateur correspond à une note existante dans une liste fournie.

## Contexte
Tu recevras :
1. Une liste de notes existantes avec leurs IDs et contenus
2. Une nouvelle idée rédigée par l'utilisateur

## Tâche
Détermine si l'idée de l'utilisateur correspond sémantiquement à l'une des notes existantes. Une correspondance existe si :
- Le sujet principal est identique ou très similaire
- L'intention est la même (même si formulée différemment)
- Les concepts clés se recoupent substantiellement

Une correspondance n'existe PAS si :
- L'idée traite d'un aspect différent du même domaine général
- L'idée est complémentaire mais distincte
- L'idée contredit ou nuance la note existante

## Format de réponse
Tu DOIS retourner uniquement un objet JSON valide, sans texte supplémentaire :

Si une correspondance est trouvée :
{
  "found_note": "ID_DE_LA_NOTE"
}

Si aucune correspondance n'est trouvée :
{
  "found_note": null
}

## Exemples

Exemple 1 - Correspondance trouvée :
Notes : [{"id": "note_123", "content": "Implémenter l'authentification OAuth dans l'application"}]
Idée : "Ajouter le login OAuth"
Réponse : {"found_note": "note_123"}

Exemple 2 - Aucune correspondance :
Notes : [{"id": "note_456", "content": "Optimiser les performances de l'API"}]
Idée : "Créer une documentation pour l'API"
Réponse : {"found_note": null}

## Règles strictes
- Retourne UNIQUEMENT le JSON, sans markdown ni texte explicatif
- Ne compare que le sens, pas la formulation exacte
- En cas de doute, privilégie found_note: null
- N'invente jamais d'ID de note

    ####
	Notes disponibles : ${notes.map((note) => `ID: ${note.id}, Contenu: ${note.content}`).join('\n')}



    ####
    Note à analyser : ${note}
	`

	const response = await generateText({
		model: google('gemini-2.0-flash'),
		system: prompt,
		prompt: note,
	})

	return extractJSON(response.text)
})
