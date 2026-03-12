# Paris Entre Potos - Coupe du Monde 2026

Application de pronostics entre amis pour la Coupe du Monde 2026.

**Stack** : React 19, Vite 6, TypeScript 5, Supabase (Auth + PostgreSQL), MUI 6, Tailwind CSS 3.

---

## Prérequis

- Node.js >= 20
- Un compte [Supabase](https://supabase.com) (plan gratuit suffisant pour le PoC)

---

## Setup Supabase

### 1. Créer un projet

Rendez-vous sur [app.supabase.com](https://app.supabase.com) et créez un nouveau projet.
Notez l'**URL du projet** et la **clé anon (publique)** depuis `Settings > API`.

### 2. Activer l'authentification Google

1. **Google Cloud Console** :
   - Aller sur [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
   - Créer un projet (ou en sélectionner un existant)
   - `Create Credentials > OAuth Client ID` → Application type: **Web application**
   - **Authorized redirect URIs** : ajouter `https://<votre-projet-ref>.supabase.co/auth/v1/callback`
   - Copier le **Client ID** et le **Client Secret**

2. **Dashboard Supabase** :
   - Aller dans `Authentication > Providers > Google`
   - Activer le provider
   - Coller le **Client ID** et **Client Secret**
   - Sauvegarder

3. **Redirect URL** (si GitHub Pages) :
   - Dans `Authentication > URL Configuration`, ajouter votre domaine dans **Redirect URLs** :
     - `https://<username>.github.io/euro-2024/`
     - `http://localhost:3000/euro-2024/` (pour le dev local)

### 3. Créer le schéma de base de données

> **Note** : Si le projet a été configuré via Supabase MCP, le schéma est déjà en place.

Allez dans `SQL Editor` dans le dashboard Supabase et exécutez le script suivant :

```sql
-- Table profiles (extension de auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  email TEXT,
  winner_team TEXT,
  score INTEGER DEFAULT 0,
  nb_connections INTEGER DEFAULT 0,
  last_connection TIMESTAMPTZ,
  role TEXT DEFAULT 'user'
);

-- Table teams
CREATE TABLE teams (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  group_name TEXT,
  name TEXT NOT NULL,
  win_odd NUMERIC,
  elimination BOOLEAN DEFAULT FALSE,
  unveiled BOOLEAN DEFAULT FALSE
);

-- Table matches
CREATE TABLE matches (
  id TEXT PRIMARY KEY,
  date_time TIMESTAMPTZ,
  city TEXT,
  team_a TEXT REFERENCES teams(id),
  team_b TEXT REFERENCES teams(id),
  streaming TEXT,
  score_a INTEGER,
  score_b INTEGER,
  odds_a NUMERIC,
  odds_b NUMERIC,
  odds_draw NUMERIC,
  phase TEXT,
  finished BOOLEAN DEFAULT FALSE,
  api_id TEXT
);

-- Table bets
CREATE TABLE bets (
  id TEXT PRIMARY KEY,
  match_id TEXT REFERENCES matches(id),
  user_id UUID REFERENCES auth.users(id),
  bet_team_a INTEGER,
  bet_team_b INTEGER,
  points_won INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table competitions (config globale)
CREATE TABLE competitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  launch_bet TIMESTAMPTZ,
  start_date TIMESTAMPTZ
);

-- Table groups (tribus)
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  join_key TEXT UNIQUE,
  created_by UUID REFERENCES auth.users(id),
  members UUID[] DEFAULT '{}',
  awaiting_members UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table group_apply (demandes d'adhésion)
CREATE TABLE group_apply (
  id TEXT PRIMARY KEY,
  group_id UUID REFERENCES groups(id),
  user_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'sent',
  validated_at TIMESTAMPTZ
);

-- Création auto d'un profil à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insérer une compétition par défaut
INSERT INTO competitions (launch_bet, start_date)
VALUES ('2026-06-11T08:00:00Z', '2026-06-11T18:00:00Z');
```

### 4. Row Level Security (RLS)

Les RLS policies sont définies dans `supabase/migrations/20260312140000_enable_rls_policies.sql`.

| Table | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| **profiles** | authenticated | own (`id = auth.uid()`) | own | admin |
| **teams** | public | admin | admin | admin |
| **matches** | public | admin | admin | admin |
| **bets** | authenticated | own (`user_id`) | own (`user_id`) | admin |
| **competitions** | public | admin | admin | admin |
| **groups** | authenticated | own (`created_by`) | creator ou admin | creator ou admin |
| **group_apply** | authenticated | own (`user_id`) | own (`user_id`) | admin |

**Points clés :**
- Fonction helper `is_admin()` (SECURITY DEFINER) pour vérifier le rôle admin sans récursion RLS.
- Trigger `prevent_role_escalation` empêche un utilisateur de modifier son propre rôle.
- Les vues (`matches_with_teams`, `bets_with_profiles`, `ranking`) utilisent `security_invoker = true` pour respecter les RLS des tables sous-jacentes.
- Les Edge Functions utilisent le `service_role` key qui bypass les RLS.
- Les fonctions trigger (`calculate_match_scores`, `handle_group_apply`) sont SECURITY DEFINER.

Pour rendre un utilisateur admin :
```sql
UPDATE profiles SET role = 'admin' WHERE id = '<user-uuid>';
```

---

## Installation locale

```bash
# Cloner le projet
git clone <url-du-repo>
cd euro-2024

# Copier le fichier d'environnement
cp .env.example .env

# Remplir les variables dans .env :
# VITE_SUPABASE_URL=https://xxxxx.supabase.co
# VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...

# Installer les dépendances
npm install

# Lancer le serveur de dev
npm run dev
```

L'app tourne sur [http://localhost:3000/euro-2024/](http://localhost:3000/euro-2024/).

---

## Scripts

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement (Vite) |
| `npm run build` | Type-check + build de production dans `/build` |
| `npm run preview` | Prévisualiser le build de production |
| `npm run prettier:write` | Formater le code |

---

## Déploiement GitHub Pages

Le projet est configuré pour se déployer automatiquement sur GitHub Pages via GitHub Actions.

1. Aller dans `Settings > Pages` du repo GitHub
2. Source : **GitHub Actions**
3. Ajouter les secrets du repo (`Settings > Secrets > Actions`) :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
4. Pusher sur `main` → déploiement automatique

---

## Structure du projet

```
src/
├── assets/          # Images, icônes, drapeaux
├── components/      # Composants partagés (Avatar, Flag, Placeholder)
├── contexts/        # AuthContext (Supabase Auth)
├── hooks/           # Hooks de données TypeScript (bets, matches, teams, groups)
├── lib/             # Client Supabase + types DB générés
│   ├── supabase.ts
│   └── database.types.ts
├── screens/         # Pages de l'application
│   ├── App/         # Layout principal + routing
│   ├── FAQ/
│   ├── Groups/      # Gestion des tribus
│   ├── HomePage/    # Page d'accueil + vainqueur final
│   ├── Matches/     # Pronostics et résultats
│   ├── Profile/
│   ├── Ranking/     # Classement par tribu
│   ├── Rules/
│   └── User/        # Profil d'un joueur
├── index.css        # Tailwind + styles globaux
├── main.tsx         # Entry point React 19
└── theme.ts         # MUI theme
```

---

## Ce qui reste à faire (hors PoC)

- ~~**Row Level Security**~~ : ✅ RLS policies configurées
- **Edge Functions** : Migrer les Cloud Functions (cron scores, cotes, notifications)
- **Notifications push** : Remplacer Firebase Cloud Messaging
- **Populate scripts** : Adapter les scripts de peuplement vers Supabase
- **Tests** : Réécrire les tests unitaires
- **Code splitting** : Optimiser le bundle size (actuellement ~1MB)

---

## Ancienne stack (legacy)

Les dossiers `functions/` et `populate/` contiennent le code des Cloud Functions Firebase
et des scripts de peuplement. Ils ne sont plus utilisés par l'application frontend
mais sont conservés comme référence pour la future migration vers Supabase Edge Functions.
