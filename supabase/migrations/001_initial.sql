-- FreeFindr — initial schema
-- Run this in your Supabase SQL editor or via supabase db push

-- ─── Users ────────────────────────────────────────────────────────────────────

create table if not exists users (
  id                     uuid primary key default gen_random_uuid(),
  email                  text unique,
  phone                  text,
  home_zip               text,
  home_lat               numeric(9,6),
  home_lng               numeric(9,6),
  radius_miles           integer default 10,
  notifications_enabled  boolean default true,
  do_not_disturb         boolean default false,
  only_items_with_image  boolean default true,
  created_at             timestamptz default now()
);

-- Insert the dev user so FK constraints work in dev
insert into users (id, email, home_zip, radius_miles)
values ('00000000-0000-0000-0000-000000000001', 'dev@freefindr.com', '77002', 25)
on conflict (id) do nothing;

-- ─── Sources ──────────────────────────────────────────────────────────────────

create table if not exists sources (
  id         uuid primary key default gen_random_uuid(),
  code       text unique not null,
  name       text not null,
  is_enabled boolean default true,
  created_at timestamptz default now()
);

insert into sources (code, name) values
  ('facebook_marketplace', 'Facebook'),
  ('craigslist',           'Craigslist'),
  ('nextdoor',             'Nextdoor'),
  ('offerup',              'OfferUp'),
  ('trashnothing',         'TrashNothing')
on conflict (code) do nothing;

-- ─── Listings ─────────────────────────────────────────────────────────────────

create table if not exists listings (
  id                uuid primary key default gen_random_uuid(),
  source_id         uuid references sources(id) on delete set null,
  source_listing_id text not null,
  title             text not null,
  description       text,
  category          text default 'miscellaneous',
  image_url         text,
  image_urls        jsonb default '[]'::jsonb,
  source_url        text,
  city              text,
  state             text,
  zip               text,
  lat               numeric(9,6),
  lng               numeric(9,6),
  posted_at         timestamptz,
  scraped_at        timestamptz default now(),
  is_active         boolean default true,
  has_image         boolean default false,
  raw_payload       jsonb default '{}'::jsonb,
  created_at        timestamptz default now(),
  unique (source_id, source_listing_id)
);

create index if not exists listings_posted_at_idx    on listings (posted_at desc);
create index if not exists listings_is_active_idx    on listings (is_active);
create index if not exists listings_category_idx     on listings (category);
create index if not exists listings_source_id_idx    on listings (source_id);
create index if not exists listings_zip_idx          on listings (zip);

-- ─── Keywords ─────────────────────────────────────────────────────────────────

create table if not exists keywords (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references users(id) on delete cascade,
  keyword    text not null,
  is_active  boolean default true,
  created_at timestamptz default now(),
  unique (user_id, keyword)
);

create index if not exists keywords_user_id_idx on keywords (user_id);

-- ─── User Source Preferences ──────────────────────────────────────────────────

create table if not exists user_source_preferences (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid references users(id) on delete cascade,
  source_id             uuid references sources(id) on delete cascade,
  feed_enabled          boolean default true,
  notifications_enabled boolean default true,
  created_at            timestamptz default now(),
  unique (user_id, source_id)
);

-- ─── User Category Preferences ────────────────────────────────────────────────

create table if not exists user_category_preferences (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references users(id) on delete cascade,
  category   text not null,
  is_enabled boolean default true,
  created_at timestamptz default now(),
  unique (user_id, category)
);

-- ─── Matches ──────────────────────────────────────────────────────────────────

create table if not exists matches (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid references users(id) on delete cascade,
  listing_id           uuid references listings(id) on delete cascade,
  matched_keyword      text,
  created_at           timestamptz default now(),
  notification_sent_at timestamptz,
  clicked_at           timestamptz,
  unique (user_id, listing_id)
);

create index if not exists matches_user_id_idx on matches (user_id);

-- ─── Leads ────────────────────────────────────────────────────────────────────

create table if not exists leads (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid references listings(id) on delete set null,
  user_id     uuid references users(id)    on delete set null,
  name        text not null,
  phone       text not null,
  email       text,
  zip         text,
  message     text,
  lead_type   text default 'pickup_help',
  status      text default 'new',
  assigned_to text,
  created_at  timestamptz default now()
);

create index if not exists leads_created_at_idx  on leads (created_at desc);
create index if not exists leads_listing_id_idx  on leads (listing_id);
create index if not exists leads_status_idx      on leads (status);

-- ─── Analytics Events ─────────────────────────────────────────────────────────

create table if not exists analytics_events (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references users(id)    on delete set null,
  listing_id uuid references listings(id) on delete set null,
  event_type text not null,
  metadata   jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists analytics_events_event_type_idx on analytics_events (event_type);
create index if not exists analytics_events_created_at_idx on analytics_events (created_at desc);

-- ─── Row Level Security (disabled for MVP dev, enable before production) ──────
-- alter table listings  enable row level security;
-- alter table leads     enable row level security;
-- alter table keywords  enable row level security;
-- See: https://supabase.com/docs/guides/auth/row-level-security
