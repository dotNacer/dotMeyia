# Standards de Codage - DotMeyia

## Principes généraux

### Philosophie du code
- **Lisibilité avant tout** : Le code doit être facile à lire et à comprendre
- **Simplicité** : Privilégier les solutions simples et directes
- **Cohérence** : Maintenir une cohérence dans tout le codebase
- **Maintenabilité** : Écrire du code qui sera facile à maintenir et à faire évoluer

### Principes SOLID
- **Single Responsibility** : Chaque fonction/composant a une seule responsabilité
- **Open/Closed** : Ouvert à l'extension, fermé à la modification
- **Liskov Substitution** : Les sous-types sont substituables à leurs types de base
- **Interface Segregation** : Préférer plusieurs interfaces spécifiques à une interface générale
- **Dependency Inversion** : Dépendre d'abstractions, pas de concretions

## Structure et organisation

### Architecture des dossiers
```
src/
├── lib/
│   ├── components/          # Composants réutilisables
│   │   ├── ui/             # Composants UI de base (Button, Input, etc.)
│   │   ├── feature/        # Composants spécifiques aux fonctionnalités
│   │   └── layout/         # Composants de mise en page
│   ├── stores/             # Stores Svelte pour l'état global
│   ├── server/             # Code côté serveur uniquement
│   ├── utils/              # Utilitaires et helpers
│   └── types/              # Types TypeScript partagés
├── routes/                 # Routes SvelteKit
│   ├── (app)/              # Routes protégées
│   ├── (auth)/             # Routes d'authentification
│   └── api/                # Routes API
└── app.html               # Template HTML principal
```

### Convention de nommage

#### Fichiers et dossiers
- **kebab-case** pour les noms de fichiers et dossiers : `user-profile.svelte`
- **PascalCase** pour les composants Svelte : `UserProfile.svelte`
- **camelCase** pour les fichiers utilitaires : `formatDate.ts`
- **UPPER_SNAKE_CASE** pour les constantes : `API_ENDPOINTS`

#### Variables et fonctions
- **camelCase** pour les variables et fonctions : `getUserData()`
- **PascalCase** pour les classes et types : `UserProfile`
- **UPPER_SNAKE_CASE** pour les constantes globales : `MAX_RETRY_ATTEMPTS`

#### Composants Svelte
- **PascalCase** pour les noms de composants : `<UserCard />`
- **kebab-case** pour les props : `user-data`, `is-loading`
- **camelCase** pour les événements : `onUserSelect`, `onDataLoad`

## Standards Svelte

### Syntaxe Svelte 5 (Runes)
```typescript
// ✅ Bon - Utilisation des runes Svelte 5
let count = $state(0);
let doubled = $derived(count * 2);
let { data } = $props();

// ❌ Éviter - Ancienne syntaxe Svelte 4
let count = writable(0);
let doubled = derived(count, $count => $count * 2);
```

### Structure des composants
```svelte
<script lang="ts">
  // 1. Imports externes
  import { onMount } from 'svelte';
  import { Button } from '$lib/components/ui/button';
  
  // 2. Imports internes
  import type { User } from '$lib/types';
  import { formatDate } from '$lib/utils/date';
  
  // 3. Props et état
  let { user } = $props<{ user: User }>();
  let isLoading = $state(false);
  let error = $state<string | null>(null);
  
  // 4. Computed values
  let displayName = $derived(user?.name || 'Anonymous');
  
  // 5. Lifecycle
  onMount(() => {
    // Initialisation
  });
  
  // 6. Event handlers
  function handleClick() {
    // Logique
  }
</script>

<!-- Template -->
<div class="user-card">
  <h2>{displayName}</h2>
  <Button on:click={handleClick}>Action</Button>
</div>

<style>
  /* Styles scoped */
  .user-card {
    /* ... */
  }
</style>
```

### Gestion de l'état
```typescript
// ✅ Bon - Stores simples et réactifs
import { writable } from 'svelte/store';

export const userStore = writable<User | null>(null);

// Actions pour manipuler l'état
export const userActions = {
  setUser: (user: User) => userStore.set(user),
  clearUser: () => userStore.set(null),
  updateUser: (updates: Partial<User>) => {
    userStore.update(user => user ? { ...user, ...updates } : null);
  }
};
```

## Standards TypeScript

### Typage strict
```typescript
// ✅ Bon - Typage explicite
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

function createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
  return {
    id: generateId(),
    ...userData,
    createdAt: new Date()
  };
}

// ❌ Éviter - any ou types implicites
function createUser(userData: any): any {
  return userData;
}
```

### Types utilitaires
```typescript
// Types communs
type ApiResponse<T> = {
  data: T;
  error: string | null;
  success: boolean;
};

type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Props types pour les composants
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  on:click?: () => void;
}
```

## Standards CSS/Tailwind

### Classes Tailwind
```svelte
<!-- ✅ Bon - Classes organisées et lisibles -->
<div class="
  flex items-center justify-between
  p-4 bg-white rounded-lg shadow-sm
  hover:shadow-md transition-shadow
  dark:bg-gray-800 dark:text-white
">
  <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
    {title}
  </h2>
</div>

<!-- ❌ Éviter - Classes mélangées et difficiles à lire -->
<div class="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:text-white">
```

### Utilitaires CSS personnalisés
```css
/* ✅ Bon - Classes utilitaires réutilisables */
.btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors;
}

.card {
  @apply bg-white rounded-lg shadow-sm p-6 dark:bg-gray-800;
}

/* ❌ Éviter - Styles inline ou trop spécifiques */
.user-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
```

## Gestion des erreurs

### Try-catch patterns
```typescript
// ✅ Bon - Gestion d'erreur structurée
async function fetchUserData(userId: string): Promise<ApiResponse<User>> {
  try {
    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return { data, error: null, success: true };
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false
    };
  }
}
```

### Composants d'erreur
```svelte
<script lang="ts">
  let { error, onRetry } = $props<{
    error: string | null;
    onRetry?: () => void;
  }>();
</script>

{#if error}
  <div class="error-container">
    <p class="error-message">{error}</p>
    {#if onRetry}
      <Button on:click={onRetry}>Réessayer</Button>
    {/if}
  </div>
{/if}
```

## Performance

### Optimisations Svelte
```svelte
<!-- ✅ Bon - Utilisation de keyed each -->
{#each items as item (item.id)}
  <ItemCard {item} />
{/each}

<!-- ✅ Bon - Lazy loading des composants -->
<script>
  import { lazy } from 'svelte';
  const HeavyComponent = lazy(() => import('./HeavyComponent.svelte'));
</script>

{#if showHeavyComponent}
  <HeavyComponent />
{/if}
```

### Mémoisation
```typescript
// ✅ Bon - Utilisation de $derived pour la mémoisation
let items = $state([]);
let filteredItems = $derived(
  items.filter(item => item.isActive)
);

// ✅ Bon - Fonctions pures pour les calculs complexes
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

## Tests et qualité

### Structure des tests
```typescript
// ✅ Bon - Tests unitaires avec vitest
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import UserCard from './UserCard.svelte';

describe('UserCard', () => {
  it('should display user name', () => {
    const user = { id: '1', name: 'John Doe', email: 'john@example.com' };
    const { getByText } = render(UserCard, { props: { user } });
    
    expect(getByText('John Doe')).toBeInTheDocument();
  });
});
```

### Validation des données
```typescript
// ✅ Bon - Validation avec Zod
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  email: z.string().email(),
  createdAt: z.date()
});

function validateUser(data: unknown): User {
  return UserSchema.parse(data);
}
```

## Documentation

### Commentaires de code
```typescript
/**
 * Calcule le score de similarité entre deux utilisateurs
 * @param user1 - Premier utilisateur
 * @param user2 - Deuxième utilisateur
 * @returns Score entre 0 et 1, où 1 = identique
 */
function calculateUserSimilarity(user1: User, user2: User): number {
  // Algorithme de similarité basé sur les préférences communes
  const commonPreferences = user1.preferences.filter(p => 
    user2.preferences.includes(p)
  );
  
  return commonPreferences.length / Math.max(
    user1.preferences.length, 
    user2.preferences.length
  );
}
```

### Documentation des composants
```svelte
<!--
  UserCard - Composant d'affichage d'un utilisateur
  
  Props:
  - user: User - Données de l'utilisateur
  - showEmail: boolean - Afficher l'email (défaut: false)
  - onSelect: (user: User) => void - Callback lors de la sélection
  
  Events:
  - select: User - Émis lors de la sélection de l'utilisateur
-->
<script lang="ts">
  let { user, showEmail = false } = $props<{
    user: User;
    showEmail?: boolean;
  }>();
</script>
```

## Sécurité

### Validation des entrées
```typescript
// ✅ Bon - Validation côté client ET serveur
function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

// ✅ Bon - Validation des props
function validateProps(props: unknown): ButtonProps {
  if (!props || typeof props !== 'object') {
    throw new Error('Invalid props');
  }
  
  const { variant, size, disabled } = props as any;
  
  if (variant && !['primary', 'secondary', 'danger'].includes(variant)) {
    throw new Error('Invalid variant');
  }
  
  return { variant, size, disabled };
}
```

### Protection XSS
```svelte
<!-- ✅ Bon - Échappement automatique de Svelte -->
<p>{userInput}</p>

<!-- ❌ Éviter - @html sans validation -->
<p>{@html userInput}</p>
```

## Git et collaboration

### Messages de commit
```
feat: ajouter la fonctionnalité de recherche de notes
fix: corriger le bug d'affichage sur mobile
docs: mettre à jour la documentation API
refactor: simplifier la logique de validation
test: ajouter des tests pour UserCard
style: améliorer l'apparence du bouton de connexion
```

### Branches
- `main` - Code de production
- `develop` - Branche de développement
- `feature/feature-name` - Nouvelles fonctionnalités
- `fix/bug-description` - Corrections de bugs
- `hotfix/urgent-fix` - Corrections urgentes

## Outils et automation

### Scripts npm
```json
{
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "format": "prettier --write .",
    "lint": "prettier --check . && eslint .",
    "test": "vitest",
    "test:coverage": "vitest --coverage"
  }
}
```

### Configuration des outils
- **Prettier** : Formatage automatique du code
- **ESLint** : Linting et détection d'erreurs
- **Svelte Check** : Vérification de types Svelte
- **Husky** : Hooks Git pour la qualité du code