# Issue #10 — Fast Note : Spécifications validées

## Implémentation

L'implémentation est en place. Pour activer :

1. **PostgreSQL + pgvector** : Activer l'extension sur la base :

    ```sql
    CREATE EXTENSION IF NOT EXISTS vector;
    ```

2. **Migration** : Exécuter la migration ou `prisma db push` :

    ```bash
    npx prisma migrate deploy
    # ou si vous utilisez db push :
    npx prisma db push
    ```

3. **Variables d'environnement** : `GOOGLE_API_KEY` (déjà utilisé pour Gemini)

---

Document de référence pour l'issue [dotNacer/dotMeyia#10](https://github.com/dotNacer/dotMeyia/issues/10).

---

## Spécifications validées

| Point             | Décision                                                                     |
| ----------------- | ---------------------------------------------------------------------------- |
| Format saisie     | Texte uniquement                                                             |
| Historique        | Oui — stocker référence (texte, noteId, date) + affichage timeline dans l'UI |
| Catégories        | Pas de gestion pour le moment                                                |
| Fusion            | Ajout en fin de note : `[Date - Contenu du Fast Note]`                       |
| Champs vectorisés | `title` + `content`                                                          |
| Embeddings        | Gemini Embedding API                                                         |
| Indexation        | Synchrone (à chaque création/modification de note)                           |
| Volume cible      | ~100 notes par utilisateur                                                   |
| Notes existantes  | Pas de migration d'indexation                                                |

---

## Plan technique détaillé

### 1. Modèle de données

- **Note** : ajouter champ `embedding` (vector via pgvector) pour `title` + `content`
- **FastNote** (nouveau) : `id`, `content`, `noteId`, `userId`, `createdAt` — historique des Fast Notes
- Activer l'extension **pgvector** dans PostgreSQL
- Pas de migration pour les notes existantes (indexation à la prochaine modification)

### 2. API / Backend

- **`/api/ai/fast-note`** (POST) :
    - Reçoit le contenu du Fast Note
    - Génère l'embedding du contenu (Gemini)
    - Recherche vectorielle (pgvector) → top-K notes similaires
    - Optionnel : LLM pour affiner si plusieurs candidats proches
    - Retourne : note(s) candidates OU proposition création nouvelle note
- **Confirmation fusion** : exécuter la fusion et créer l'entrée FastNote
- **Indexation** : à chaque `create`/`update` de Note, générer embedding et mettre à jour (synchrone)

### 3. UI / Frontend

- Zone de saisie Fast Note (emplacement à définir : accueil, sidebar, modal)
- Affichage des propositions → confirmation utilisateur avant fusion
- **Page / section Timeline** : affichage de l'historique des Fast Notes (date, contenu, note liée)
- Raccourci clavier à envisager (ex: `Ctrl+Shift+N`)

### 4. Stack

- **pgvector** : extension PostgreSQL pour les vecteurs
- **Prisma** : champ vectoriel (Unsupported ou extension)
- **Gemini Embedding API** : pour générer les embeddings
- **OpenRouter** (ou Gemini) : pour le LLM de raffinement si nécessaire

---

## Points ouverts

1. **Validation utilisateur** : Toujours demander confirmation avant de fusionner ?
2. **Raccourci clavier** : `Ctrl+Shift+N` pour ouvrir le Fast Note ?
3. **Emplacement zone de saisie** : page d'accueil, sidebar, ou modal global ?
