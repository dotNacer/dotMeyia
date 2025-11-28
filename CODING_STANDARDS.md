# Coding Standards - DotMeyia

## General Principles

### Code Philosophy
- **Readability First** : Code must be easy to read and understand
- **Simplicity** : Prefer simple and direct solutions
- **Consistency** : Maintain consistency across the entire codebase
- **Maintainability** : Write code that will be easy to maintain and evolve

### SOLID Principles
- **Single Responsibility** : Each function/component has a single responsibility
- **Open/Closed** : Open for extension, closed for modification
- **Liskov Substitution** : Subtypes are substitutable for their base types
- **Interface Segregation** : Prefer multiple specific interfaces over one general interface
- **Dependency Inversion** : Depend on abstractions, not concretions

## Structure and Organization

### Folder Architecture
```
src/
├── lib/
│   ├── components/          # Reusable components
│   │   ├── ui/             # Base UI components (Button, Input, etc.)
│   │   ├── feature/        # Feature-specific components
│   │   └── layout/         # Layout components
│   ├── stores/             # Svelte stores for global state
│   ├── server/             # Server-side only code
│   ├── utils/              # Utilities and helpers
│   └── types/              # Shared TypeScript types
├── routes/                 # SvelteKit routes
│   ├── (app)/              # Protected routes
│   ├── (auth)/             # Authentication routes
│   └── api/                # API routes
└── app.html               # Main HTML template
```

### Naming Conventions

#### Files and Folders
- **kebab-case** for file and folder names : `user-profile.svelte`
- **PascalCase** for Svelte components : `UserProfile.svelte`
- **camelCase** for utility files : `formatDate.ts`
- **UPPER_SNAKE_CASE** for constants : `API_ENDPOINTS`

#### Variables and Functions
- **camelCase** for variables and functions : `getUserData()`
- **PascalCase** for classes and types : `UserProfile`
- **UPPER_SNAKE_CASE** for global constants : `MAX_RETRY_ATTEMPTS`

#### Svelte Components
- **PascalCase** for component names : `<UserCard />`
- **kebab-case** for props : `user-data`, `is-loading`
- **camelCase** for events : `onUserSelect`, `onDataLoad`

## Svelte Standards

### Svelte 5 Syntax (Runes)
```typescript
// ✅ Good - Using Svelte 5 runes
let count = $state(0);
let doubled = $derived(count * 2);
let { data } = $props();

// ❌ Avoid - Old Svelte 4 syntax
let count = writable(0);
let doubled = derived(count, $count => $count * 2);
```

### Component Structure
```svelte
<script lang="ts">
  // 1. External imports
  import { onMount } from 'svelte';
  import { Button } from '$lib/components/ui/button';
  
  // 2. Internal imports
  import type { User } from '$lib/types';
  import { formatDate } from '$lib/utils/date';
  
  // 3. Props and state
  let { user } = $props<{ user: User }>();
  let isLoading = $state(false);
  let error = $state<string | null>(null);
  
  // 4. Computed values
  let displayName = $derived(user?.name || 'Anonymous');
  
  // 5. Lifecycle
  onMount(() => {
    // Initialization
  });
  
  // 6. Event handlers
  function handleClick() {
    // Logic
  }
</script>

<!-- Template -->
<div class="user-card">
  <h2>{displayName}</h2>
  <Button on:click={handleClick}>Action</Button>
</div>

<style>
  /* Scoped styles */
  .user-card {
    /* ... */
  }
</style>
```

### State Management
```typescript
// ✅ Good - Simple and reactive stores
import { writable } from 'svelte/store';

export const userStore = writable<User | null>(null);

// Actions to manipulate state
export const userActions = {
  setUser: (user: User) => userStore.set(user),
  clearUser: () => userStore.set(null),
  updateUser: (updates: Partial<User>) => {
    userStore.update(user => user ? { ...user, ...updates } : null);
  }
};
```

## TypeScript Standards

### Strict Typing
```typescript
// ✅ Good - Explicit typing
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

// ❌ Avoid - any or implicit types
function createUser(userData: any): any {
  return userData;
}
```

### Utility Types
```typescript
// Common types
type ApiResponse<T> = {
  data: T;
  error: string | null;
  success: boolean;
};

type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Props types for components
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  on:click?: () => void;
}
```

## CSS/Tailwind Standards

### Tailwind Classes
```svelte
<!-- ✅ Good - Organized and readable classes -->
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

<!-- ❌ Avoid - Mixed and hard-to-read classes -->
<div class="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:text-white">
```

### Custom CSS Utilities
```css
/* ✅ Good - Reusable utility classes */
.btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors;
}

.card {
  @apply bg-white rounded-lg shadow-sm p-6 dark:bg-gray-800;
}

/* ❌ Avoid - Inline styles or too specific */
.user-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
```

## Error Handling

### Try-catch Patterns
```typescript
// ✅ Good - Structured error handling
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

### Error Components
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
      <Button on:click={onRetry}>Retry</Button>
    {/if}
  </div>
{/if}
```

## Performance

### Svelte Optimizations
```svelte
<!-- ✅ Good - Using keyed each -->
{#each items as item (item.id)}
  <ItemCard {item} />
{/each}

<!-- ✅ Good - Lazy loading components -->
<script>
  import { lazy } from 'svelte';
  const HeavyComponent = lazy(() => import('./HeavyComponent.svelte'));
</script>

{#if showHeavyComponent}
  <HeavyComponent />
{/if}
```

### Memoization
```typescript
// ✅ Good - Using $derived for memoization
let items = $state([]);
let filteredItems = $derived(
  items.filter(item => item.isActive)
);

// ✅ Good - Pure functions for complex calculations
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

## Testing and Quality

### Test Structure
```typescript
// ✅ Good - Unit tests with vitest
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

### Data Validation
```typescript
// ✅ Good - Validation with Zod
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

### Code Comments
```typescript
/**
 * Calculates similarity score between two users
 * @param user1 - First user
 * @param user2 - Second user
 * @returns Score between 0 and 1, where 1 = identical
 */
function calculateUserSimilarity(user1: User, user2: User): number {
  // Similarity algorithm based on common preferences
  const commonPreferences = user1.preferences.filter(p => 
    user2.preferences.includes(p)
  );
  
  return commonPreferences.length / Math.max(
    user1.preferences.length, 
    user2.preferences.length
  );
}
```

### Component Documentation
```svelte
<!--
  UserCard - User display component
  
  Props:
  - user: User - User data
  - showEmail: boolean - Show email (default: false)
  - onSelect: (user: User) => void - Selection callback
  
  Events:
  - select: User - Emitted when user is selected
-->
<script lang="ts">
  let { user, showEmail = false } = $props<{
    user: User;
    showEmail?: boolean;
  }>();
</script>
```

## Security

### Input Validation
```typescript
// ✅ Good - Client AND server-side validation
function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

// ✅ Good - Props validation
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

### XSS Protection
```svelte
<!-- ✅ Good - Automatic Svelte escaping -->
<p>{userInput}</p>

<!-- ❌ Avoid - @html without validation -->
<p>{@html userInput}</p>
```

## Git and Collaboration

### Commit Messages
```
feat: add note search functionality
fix: fix mobile display bug
docs: update API documentation
refactor: simplify validation logic
test: add tests for UserCard
style: improve login button appearance
```

### Branches
- `main` - Production code
- `develop` - Development branch
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `hotfix/urgent-fix` - Urgent fixes

## Tools and Automation

### NPM Scripts
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

### Tool Configuration
- **Prettier** : Automatic code formatting
- **ESLint** : Linting and error detection
- **Svelte Check** : Svelte type checking
- **Husky** : Git hooks for code quality