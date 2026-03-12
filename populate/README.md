# Populate — Scripts d'administration

Scripts TypeScript pour administrer la base Supabase du projet Euro 2024.

## Setup

```bash
npm install
```

Créer un fichier `.env` à la racine de `populate/` :

```env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run bets:display` | Affiche tous les paris avec scores |
| `npm run bets:check-scores` | Vérifie la cohérence des scores |
| `npm run bets:who-dont-bet` | Liste les utilisateurs qui n'ont pas parié |
| `npm run bets:who-have-no-winner` | Liste les utilisateurs sans vainqueur final |
| `npm run bets:find-cheaters` | Détecte les paris après le début d'un match |
| `npm run ranking:global` | Classement global |
| `npm run ranking:by-groups` | Classement par groupes |
| `npm run stats:good-bet-strike` | Meilleure série de paris gagnants |
| `npm run groups:by-user` | Groupes de chaque utilisateur |
| `npm run groups:who-have-no-group` | Utilisateurs sans groupe |
