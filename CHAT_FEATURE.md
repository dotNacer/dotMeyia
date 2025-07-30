# Fonctionnalité de Chat avec l'IA

## Vue d'ensemble

La fonctionnalité de chat avec l'IA permet aux utilisateurs de créer des conversations interactives avec l'intelligence artificielle, en utilisant des contextes personnalisés existants ou en démarrant une conversation générale.

## Fonctionnalités principales

### 1. Création de chats
- **Chat général** : Créer un chat sans contexte spécifique
- **Chat avec contexte** : Créer un chat en utilisant un contexte existant pour guider l'IA
- **Titre personnalisé** : Donner un titre descriptif à chaque conversation

### 2. Gestion des conversations
- **Liste des chats** : Voir tous les chats existants avec aperçu du dernier message
- **Navigation fluide** : Accéder rapidement aux conversations précédentes
- **Informations contextuelles** : Voir le contexte associé à chaque chat

### 3. Interface de chat
- **Messages en temps réel** : Envoi et réception instantanée des messages
- **Formatage markdown** : L'IA peut formater ses réponses avec du markdown
- **Historique complet** : Tous les messages sont sauvegardés et accessibles
- **Indicateurs visuels** : Distinction claire entre messages utilisateur et IA

### 4. Sauvegarde automatique
- **Persistance des données** : Tous les chats et messages sont sauvegardés en base
- **Synchronisation** : Les conversations sont disponibles sur tous les appareils
- **Sécurité** : Chaque utilisateur ne voit que ses propres conversations

## Architecture technique

### Modèles de données

#### Chat
```prisma
model Chat {
  id        String   @id @default(uuid())
  title     String
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  contextId String?
  context   AIContext? @relation(fields: [contextId], references: [id], onDelete: SetNull)
  messages  ChatMessage[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### ChatMessage
```prisma
model ChatMessage {
  id        String   @id @default(uuid())
  content   String
  role      MessageRole
  chatId    String
  chat      Chat     @relation(fields: [chatId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}

enum MessageRole {
  USER
  ASSISTANT
}
```

### API Endpoints

#### GET /api/chats
Récupère la liste de tous les chats de l'utilisateur connecté.

#### POST /api/chats
Crée un nouveau chat avec un titre et optionnellement un contexte.

#### GET /api/chats/[id]
Récupère un chat spécifique avec tous ses messages.

#### POST /api/chats/[id]/messages
Envoie un message à l'IA et récupère la réponse.

## Configuration requise

### Variables d'environnement
```env
# Base de données PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/database"

# Clé API Google AI (Gemini)
GOOGLE_GENERATIVE_AI_API_KEY="your-api-key"

# Secret d'authentification
AUTH_SECRET="your-auth-secret"
```

### Dépendances
- `@ai-sdk/google` : SDK pour l'intégration avec Google AI
- `@ai-sdk/svelte` : Composants Svelte pour l'IA
- `ai` : Framework AI pour le streaming
- `marked` : Parser markdown pour les réponses de l'IA

## Utilisation

### 1. Accéder aux chats
- Cliquer sur "Chats" dans la navigation principale
- Voir la liste de tous les chats existants

### 2. Créer un nouveau chat
- Cliquer sur "Nouveau Chat"
- Entrer un titre pour la conversation
- Optionnellement sélectionner un contexte existant
- Cliquer sur "Créer le chat"

### 3. Converser avec l'IA
- Taper un message dans la zone de saisie
- Appuyer sur Entrée ou cliquer sur l'icône d'envoi
- Attendre la réponse de l'IA
- Continuer la conversation

### 4. Naviguer entre les chats
- Utiliser le bouton "Retour" pour revenir à la liste
- Cliquer sur n'importe quel chat pour le reprendre

## Fonctionnalités avancées

### Contextes personnalisés
- Les contextes existants peuvent être utilisés pour guider l'IA
- L'IA respecte le prompt du contexte sélectionné
- Possibilité de changer de contexte en créant un nouveau chat

### Formatage des réponses
- L'IA peut utiliser le markdown pour formater ses réponses
- Support des listes, titres, code, liens, etc.
- Rendu automatique dans l'interface

### Performance
- Messages envoyés de manière asynchrone
- Indicateurs de chargement pendant la génération
- Gestion des erreurs avec messages utilisateur

## Sécurité

- Authentification requise pour tous les endpoints
- Isolation des données par utilisateur
- Validation des entrées utilisateur
- Protection contre les injections SQL via Prisma

## Maintenance

### Base de données
```bash
# Appliquer les migrations
npx prisma db push

# Générer le client Prisma
npx prisma generate
```

### Développement
```bash
# Démarrer le serveur de développement
npm run dev

# Vérifier les types
npm run check
```

## Évolutions futures

- Support du streaming en temps réel
- Partage de conversations
- Export des conversations
- Intégration avec d'autres modèles d'IA
- Fonctionnalités de recherche dans les conversations