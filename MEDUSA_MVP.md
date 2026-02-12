# MVP Commande et Paiement - Medusa JS v2

MVP fonctionnel pour la fonctionnalité de commande et paiement utilisant le SDK JavaScript Medusa JS v2.

## Configuration

1. **Variables d'environnement** : ajoutez dans `.env` :

```
MEDUSA_BACKEND_URL=http://localhost:9000
```

2. **Backend Medusa** : un backend Medusa v2 doit être démarré et accessible à l'URL configurée.
   - Créer des régions, produits et variantes dans l'admin Medusa
   - Configurer un provider de paiement (ex: Stripe, manual) pour la région

## Flux utilisateur

1. **Boutique** (`/store`) : liste des produits, ajout au panier
2. **Panier** (`/store/cart`) : sélection de la région, gestion des articles
3. **Checkout** (`/store/checkout`) : options de livraison, paiement, finalisation
4. **Confirmation** (`/store/order/[id]`) : récapitulatif de la commande

## API Routes (proxy vers Medusa)

- `GET /api/medusa/regions` - Liste des régions
- `GET /api/medusa/products` - Liste des produits
- `POST /api/medusa/cart` - Créer un panier
- `GET/PATCH /api/medusa/cart/[id]` - Récupérer/mettre à jour un panier
- `POST /api/medusa/cart/[id]/items` - Ajouter un article
- `PATCH/DELETE /api/medusa/cart/[id]/items/[lineId]` - Modifier/supprimer un article
- `POST /api/medusa/cart/[id]/shipping` - Ajouter une méthode d'expédition
- `POST /api/medusa/cart/[id]/complete` - Finaliser la commande
- `GET /api/medusa/shipping-options?cart_id=` - Options de livraison
- `GET /api/medusa/payment-providers?region_id=` - Fournisseurs de paiement
- `POST /api/medusa/payment/initiate` - Initialiser une session de paiement
- `GET /api/medusa/orders/[id]` - Récupérer une commande

## Paiement

- **Stripe** : si configuré, `initiatePaymentSession` peut retourner une URL de redirection vers Stripe Checkout
- **Manual** : pour les tests, le provider "manual" permet de finaliser sans paiement réel

## Améliorations possibles

- Formulaire d'adresse de livraison
- Sélection de variante (taille, couleur) avant ajout au panier
- Authentification client Medusa pour lier panier aux comptes
- Gestion des retours après paiement (success/cancel URLs)
