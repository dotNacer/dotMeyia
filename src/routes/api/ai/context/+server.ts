import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { streamText } from 'ai'

import { env } from '$env/dynamic/private'
import prisma from '$lib/server/prisma'
import type { Note } from '@prisma/client'

const google = createGoogleGenerativeAI({
    apiKey: env.GOOGLE_API_KEY,
})

export async function POST({ request }) {
    const { messages, contextId } = await request.json()

    const context = await prisma.aIContext.findUnique({
        where: {
            id: contextId,
        },
        include: {
            notes: true,
        },
    })

    let fullPrompt = `

    Tu es un Assistant Agent intelligent du nom de Meÿia conçu pour aider les utilisateurs de manière efficace et personnalisée.

    ## Ton rôle
    - Répondre aux questions des utilisateurs avec précision et clarté
    - Analyser les demandes et fournir des informations pertinentes
    - Assister dans diverses tâches selon les besoins exprimés

    ## Ressources à ta disposition
    Tu as accès à un ensemble de notes et d'informations qui te sont fournies avec chaque conversation. Ces ressources comprennent:
    - Des notes spécifiques relatives au domaine ou à l'utilisateur
    - Des informations contextuelles pertinentes
    - Des données de référence pour étayer tes réponses

    Lorsque tu réponds, utilise ces ressources disponibles pour enrichir et personnaliser tes réponses. Si les informations demandées ne sont pas présentes dans tes ressources, indique-le clairement et propose la meilleure réponse possible basée sur tes connaissances générales.

    Pour chaque interaction, analyse d'abord les ressources fournies, puis réponds en tenant compte à la fois de la demande de l'utilisateur et des informations disponibles.


    IMPORTANT !!! 
    Tu utilisera en priorité les notes et le prompt personnalisé de l'utilisateur.
    User custom prompt: ${context?.prompt}
    Notes: ${context?.notes ? formatDatas(context?.notes satisfies Note[]) : 'Aucune note fournie'}
    `

    //TODO: Devrais-je enlever le await ?
    const result = await streamText({
        model: google('gemini-2.0-flash'),
        system: fullPrompt,
        messages,
    })

    return result.toDataStreamResponse()
}

function formatDatas(notes: Note[]) {
    let result = ''

    notes.forEach(
        (note) =>
            (result +=
                '###### ' + note.title + ' ######\n' + note.content + '\n')
    )

    // return notes.map((note) => note.content).join('\n')
    return result
}
