# AGENTS.md — Paris Entre Potos

Instructions pour les agents IA travaillant sur ce projet.

## Apercu du projet

Application PWA de pronostics entre amis pour la Coupe du Monde 2026. Les utilisateurs se connectent via Google, parient sur les matchs, rejoignent des "tribus" (groupes), et suivent un classement en temps reel.

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 19, React Router 7, TypeScript 5 |
| Styling | Tailwind CSS 3, CSS custom dans `index.css` |
| Backend | Supabase (Auth + PostgreSQL) |
| Edge Functions | Deno (Supabase Edge Functions) |
| Build | Vite 6, vite-plugin-pwa |
| Hosting | GitHub Pages (deploy automatique via GitHub Actions) |
| Icons | lucide-react |
| Dates | date-fns |
| Toasts | react-hot-toast |

## Structure du projet

```
src/
├── assets/          # Images, drapeaux SVG
├── components/      # Composants partages (Avatar, Flag, Placeholder, Reversible, InstallPrompt)
├── contexts/        # AuthContext (session, profil, auth Google)
├── hooks/           # Hooks de donnees (useMatches, useBet, useTeams, useGroups, etc.)
├── lib/             # Client Supabase (supabase.ts) + types DB generes (database.types.ts)
├── screens/         # Pages de l'app (HomePage, Matches, Ranking, Groups, Profile, etc.)
├── index.css        # Tailwind + styles globaux
└── main.tsx         # Point d'entree

supabase/
├── functions/       # Edge Functions (update-results, update-odds)
└── migrations/      # Migrations SQL (schema, RLS, triggers, vues, cron)

populate/            # Scripts admin
```

## Conventions de code

### Nommage
- **Composants** : PascalCase (`InstallPrompt.tsx`)
- **Hooks** : prefix `use` (`useMatches`, `useBet`, `useIsUserAdmin`)
- **Screens** : PascalCase (`HomePage`, `MatchesPage`)
- **Tables/colonnes DB** : snake_case (`bet_team_a`, `display_name`)

### Organisation des fichiers
- **Composants** : Les composants simples sont placés directement à la racine de `components/` (ex: `InstallPrompt.tsx`). S'il y a des sous-composants, ils peuvent avoir leur propre dossier.
- **Screens** : Les écrans simples sont placés directement à la racine de `screens/` (ex: `Analytics.tsx`). Les dossiers sont réservés aux écrans complexes. Plus de fichiers `index.js` ou `index.ts` pour les ré-exports de composants.
- **Hooks** : fichiers plats dans `hooks/`
- **Contexts** : fichiers plats dans `contexts/`

### Style de code
- Prettier : `semi: false`, `trailingComma: "all"`, `singleQuote: true`
- TypeScript : `strict: false`, `noImplicitAny: false`
- `baseUrl: "src"` dans tsconfig — les imports depuis `src/` sont absolus (ex: `import { useAuth } from 'contexts/AuthContext'`)
- Aliases Vite : `components`, `hooks`, `utils` resolvent vers `src/`
- Langue de l'UI : francais

### Regles strictes
- Ne jamais utiliser d'assertions de type TypeScript (comme `as const`, `as Type`, `as any`). Privilégier un typage explicite (ex: `const foo: Record<string, string> = ...`) ou des méthodes qui infèrent correctement (comme `flatMap` au lieu de `filter(Boolean) as Type[]`).
- Ne jamais coder de fonction d'une seule ligne (privilegier la duplication)
- Ne jamais definir une fonction a l'interieur d'une autre fonction — utiliser un fichier helper ou service dedie
- Ne jamais ajouter de commentaires narratifs evidents

## Base de donnees (Supabase PostgreSQL)

### Tables principales
| Table | Role |
|-------|------|
| `profiles` | Profils utilisateurs (lie a `auth.users`) |
| `teams` | Equipes (code, nom, groupe, cotes) |
| `matches` | Matchs (equipes, scores, cotes, phase, termine) |
| `bets` | Paris des utilisateurs par match |
| `competitions` | Config de la competition (dates) |
| `groups` | Tribus avec membres |
| `group_apply` | Demandes d'adhesion aux tribus |

### Vues
- `matches_with_teams` — matchs + noms/codes des equipes
- `bets_with_profiles` — paris + display_name/avatar
- `ranking` — profils classes par score

### Triggers importants
- `calculate_match_scores` — recalcule les points des paris quand un score de match est mis a jour
- `handle_group_apply` — auto-valide et met a jour les groupes a l'insertion
- `prevent_role_escalation` — empeche un non-admin de changer les roles

### RLS (Row Level Security)
- Toutes les tables ont RLS active
- Fonction helper `is_admin()` (SECURITY DEFINER) pour verifier le role admin
- Les vues utilisent `security_invoker = true`
- Les Edge Functions utilisent `service_role` key (bypass RLS)

## Edge Functions (Deno)

| Fonction | Role | Cron |
|----------|------|------|
| `update-results` | Recupere les resultats via RapidAPI, met a jour `matches` | Toutes les 3 min, 13h-22h |
| `update-odds` | Recupere les cotes via RapidAPI, met a jour `matches` | Quotidien a 1h |

Variables d'environnement requises : `RAPIDAPI_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

## Variables d'environnement

### Frontend (prefixe `VITE_`)
- `VITE_SUPABASE_URL` — URL du projet Supabase
- `VITE_SUPABASE_PUBLISHABLE_KEY` — Cle anon Supabase

### Edge Functions / Populate
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RAPIDAPI_KEY`

Ne jamais commiter de fichiers `.env`, credentials, ou cles d'API.

## Scripts npm

| Script | Description |
|--------|-------------|
| `npm run dev` | Serveur de dev Vite (port 3000) |
| `npm run build` | Type-check (`tsc --noEmit`) + build dans `build/` |
| `npm run preview` | Preview du build de production |
| `npm run lint` | ESLint sur `src/` |
| `npm run prettier:check` | Verification du formatage |
| `npm run prettier:write` | Formatage automatique |

## Deploiement

Push sur `main` declenche le workflow `.github/workflows/deploy.yml` :
1. `supabase db push` (migrations)
2. Deploy des Edge Functions (`update-results`, `update-odds`)
3. Build frontend + deploy sur GitHub Pages

## Points d'attention

- Les types DB sont generes dans `src/lib/database.types.ts` — les regenerer apres toute modification de schema
- Le dossier `populate/` contient des scripts de reference pour la migration vers Supabase
- L'app est une PWA avec Service Worker (vite-plugin-pwa), manifest genere dans `vite.config.ts`
- Theme couleur : `#19194b` (fond sombre), `#bcffff` (fond clair)
