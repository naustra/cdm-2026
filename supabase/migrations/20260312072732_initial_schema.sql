CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  display_name TEXT,
  avatar_url TEXT,
  email TEXT,
  winner_team TEXT,
  score INTEGER DEFAULT 0,
  nb_connections INTEGER DEFAULT 0,
  last_connection TIMESTAMPTZ,
  role TEXT DEFAULT 'user'
);

CREATE TABLE teams (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  group_name TEXT,
  name TEXT NOT NULL,
  win_odd NUMERIC,
  elimination BOOLEAN DEFAULT false,
  unveiled BOOLEAN DEFAULT false
);

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
  finished BOOLEAN DEFAULT false,
  api_id TEXT
);

CREATE TABLE bets (
  id TEXT PRIMARY KEY,
  match_id TEXT REFERENCES matches(id),
  user_id UUID REFERENCES auth.users(id),
  bet_team_a INTEGER,
  bet_team_b INTEGER,
  points_won INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE competitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  launch_bet TIMESTAMPTZ,
  start_date TIMESTAMPTZ
);

CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  join_key TEXT UNIQUE,
  created_by UUID REFERENCES auth.users(id),
  members UUID[] DEFAULT '{}',
  awaiting_members UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE group_apply (
  id TEXT PRIMARY KEY,
  group_id UUID REFERENCES groups(id),
  user_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'sent',
  validated_at TIMESTAMPTZ
);
