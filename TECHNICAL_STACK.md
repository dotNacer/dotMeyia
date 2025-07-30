# Stack Technique - DotMeyia

## Vue d'ensemble de l'architecture

DotMeyia utilise une architecture moderne full-stack basée sur SvelteKit avec une approche JAMstack, intégrant des technologies de pointe pour offrir une expérience utilisateur optimale et des performances élevées.

## Frontend

### Framework principal
- **SvelteKit 2.16+** : Framework full-stack moderne avec rendu côté serveur (SSR)
- **Svelte 5.0+** : Framework réactif avec la nouvelle syntaxe runes (`$state`, `$derived`, `$props`)
- **TypeScript 5.0+** : Typage statique pour la sécurité du code et une meilleure DX

### Build tools et bundler
- **Vite 6.2+** : Bundler ultra-rapide avec HMR (Hot Module Replacement)
- **PostCSS** : Post-processeur CSS avec autoprefixer
- **Tailwind CSS 3.4+** : Framework CSS utility-first pour un styling rapide et cohérent

### Styling et UI
- **Tailwind CSS** : Framework CSS utility-first
  - `tailwindcss-animate` : Animations CSS prêtes à l'emploi
  - `tailwind-merge` : Fusion intelligente des classes Tailwind
  - `tailwind-variants` : Création de variants de composants
- **Bits UI** : Composants UI headless pour Svelte
- **clsx** : Utilitaire pour gérer les classes CSS conditionnelles

### Animations et interactions
- **GSAP 3.13+** : Bibliothèque d'animations avancées
- **Svelte Transitions** : Animations natives Svelte (`fly`, `flip`, etc.)
- **Svelte Sonner** : Notifications toast modernes

### Icônes
- **Lucide Svelte 0.488+** : Icônes SVG modernes et cohérentes
- **@lucide/svelte** : Version officielle pour Svelte

## Backend et API

### Framework backend
- **SvelteKit API Routes** : API REST intégrée au framework
- **Hooks Server** : Middleware pour l'authentification et la gestion des sessions

### Base de données
- **PostgreSQL** : Base de données relationnelle robuste
- **Prisma 6.6+** : ORM moderne avec type safety
  - `@prisma/client` : Client généré automatiquement
  - Migrations automatiques
  - Schema-first development

### Authentification
- **Better Auth 1.2+** : Solution d'authentification moderne
  - Support multi-providers (OAuth, credentials)
  - Gestion des sessions sécurisées
  - Protection CSRF intégrée

## Intelligence Artificielle

### SDK et intégrations
- **Google AI SDK 1.2+** : Intégration officielle avec les modèles Google AI
- **AI SDK 4.3+** : Framework pour les applications IA
- **@ai-sdk/svelte 2.1+** : Composants Svelte pour l'IA

### Utilitaires IA
- **Marked 15.0+** : Parser Markdown pour le rendu de contenu IA
- **Crypto 1.0+** : Utilitaires de cryptographie pour la sécurité

## Outils de développement

### Linting et formatting
- **ESLint 9.18+** : Linter JavaScript/TypeScript
  - `@eslint/js` : Configuration JavaScript moderne
  - `eslint-plugin-svelte` : Règles spécifiques à Svelte
  - `typescript-eslint` : Support TypeScript avancé
- **Prettier 3.4+** : Formateur de code
  - `prettier-plugin-svelte` : Support Svelte
  - `prettier-plugin-tailwindcss` : Tri automatique des classes Tailwind

### Type checking
- **Svelte Check 4.0+** : Vérification de types pour Svelte
- **TypeScript** : Compilateur et vérificateur de types

### Mode développement
- **Mode Watcher 1.0+** : Surveillance des changements de mode (dark/light)

## Gestion des dépendances

### Package managers
- **npm** : Gestionnaire de paquets principal
- **Bun** : Alternative rapide (lock file présent)

### Configuration
- **components.json** : Configuration pour les composants UI
- **.npmrc** : Configuration npm
- **nixpacks.toml** : Configuration de déploiement

## Structure des dossiers

```
src/
├── lib/
│   ├── components/     # Composants réutilisables
│   │   ├── ui/        # Composants UI de base
│   │   ├── auth/      # Composants d'authentification
│   │   ├── dashboard/ # Composants du tableau de bord
│   │   └── ...
│   ├── stores/        # Stores Svelte pour l'état global
│   ├── server/        # Code côté serveur
│   └── utils.ts       # Utilitaires partagés
├── routes/            # Routes SvelteKit
│   ├── (app)/         # Routes protégées
│   ├── (auth)/        # Routes d'authentification
│   └── api/           # Routes API
└── app.html           # Template HTML principal
```

## Configuration des outils

### Tailwind CSS
- Configuration personnalisée avec thème étendu
- Support des animations et transitions
- Mode sombre/clair intégré

### Prisma
- Schema avec relations complexes
- Migrations automatiques
- Client généré avec types TypeScript

### Vite
- Configuration optimisée pour SvelteKit
- HMR rapide
- Build optimisé pour la production

## Bonnes pratiques techniques

### Performance
- **Code splitting** automatique avec SvelteKit
- **Lazy loading** des composants
- **Optimisation des images** et assets
- **Bundle analysis** pour optimiser la taille

### Sécurité
- **Authentification** robuste avec better-auth
- **Protection CSRF** intégrée
- **Validation** des données côté serveur
- **Gestion sécurisée** des clés API

### Développement
- **Type safety** avec TypeScript
- **Linting** strict avec ESLint
- **Formatting** automatique avec Prettier
- **Tests** automatisés (à implémenter)

## Déploiement

### Environnements
- **Développement** : Serveur local avec Vite
- **Production** : Adapter auto-détecté avec SvelteKit
- **Preview** : Build de prévisualisation

### Configuration
- **Variables d'environnement** pour les secrets
- **Base de données** PostgreSQL en production
- **CDN** pour les assets statiques

## Évolutivité

### Scalabilité
- **Architecture modulaire** avec SvelteKit
- **API REST** extensible
- **Base de données** relationnelle robuste
- **Cache** et optimisation des performances

### Maintenance
- **Dépendances** à jour avec npm audit
- **Monitoring** des performances
- **Logs** structurés
- **Backup** automatique de la base de données