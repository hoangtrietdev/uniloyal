create table if not exists public.mock_accounts (
  id text primary key,
  email text unique not null,
  password text not null,
  name text not null,
  avatar text not null,
  is_admin boolean not null default false
);

create table if not exists public.user_profiles (
  id text primary key,
  name text not null,
  email text not null,
  phone text not null default '',
  avatar text not null,
  member_since text not null,
  vip_code text not null,
  address text not null default '',
  occupation text,
  is_admin boolean not null default false,
  brands jsonb not null default '[]'::jsonb,
  transactions jsonb not null default '[]'::jsonb,
  integrations jsonb not null default '[]'::jsonb
);

create table if not exists public.merchant_settings (
  id text primary key,
  points_to_cash_rate integer not null,
  silver_threshold integer not null,
  gold_threshold integer not null,
  diamond_threshold integer not null
);

create table if not exists public.crm_rules (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  trigger text not null,
  condition text not null,
  action text not null,
  status text not null,
  times_triggered integer not null default 0,
  created_at timestamptz not null default now()
);

insert into public.mock_accounts (id, email, password, name, avatar, is_admin)
values
  (
    'user-1',
    'user1@uniloyal.local',
    'user123',
    'User One',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    false
  ),
  (
    'admin-1',
    'admin1@uniloyal.local',
    'admin123',
    'Admin One',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    true
  )
on conflict (email) do update set
  password = excluded.password,
  name = excluded.name,
  avatar = excluded.avatar,
  is_admin = excluded.is_admin;

insert into public.merchant_settings (id, points_to_cash_rate, silver_threshold, gold_threshold, diamond_threshold)
values ('uniloyal', 10000, 0, 500, 1200)
on conflict (id) do update set
  points_to_cash_rate = excluded.points_to_cash_rate,
  silver_threshold = excluded.silver_threshold,
  gold_threshold = excluded.gold_threshold,
  diamond_threshold = excluded.diamond_threshold;

insert into public.user_profiles (
  id,
  name,
  email,
  phone,
  avatar,
  member_since,
  vip_code,
  address,
  occupation,
  is_admin,
  brands,
  transactions,
  integrations
)
values
  (
    'user-1',
    'User One',
    'user1@uniloyal.local',
    '',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    '2026-01-12',
    'UL-2048-GOLD',
    '',
    'Member',
    false,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb
  ),
  (
    'admin-1',
    'Admin One',
    'admin1@uniloyal.local',
    '',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    '2025-11-01',
    'UL-9001-ADMIN',
    '',
    'Operations Manager',
    true,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb
  )
on conflict (id) do update set
  name = excluded.name,
  email = excluded.email,
  phone = excluded.phone,
  avatar = excluded.avatar,
  member_since = excluded.member_since,
  vip_code = excluded.vip_code,
  address = excluded.address,
  occupation = excluded.occupation,
  is_admin = excluded.is_admin;
