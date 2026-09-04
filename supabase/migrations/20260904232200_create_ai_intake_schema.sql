create extension if not exists pgcrypto;

create table if not exists public.intakes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_activity_at timestamptz not null default now(),
  completed_at timestamptz,
  status text not null default 'started' check (status in ('started','in_progress','completed','contacted','archived')),
  completion_percent integer not null default 0 check (completion_percent between 0 and 100),
  current_step text,
  source text not null default 'ai_intake',
  client_token_hash text unique,

  name text,
  business_name text,
  email text,
  phone text,
  business_description text,
  current_website text,
  website_goals text,
  success_definition text,
  friction_points jsonb not null default '[]'::jsonb,
  pages_needed jsonb not null default '[]'::jsonb,
  integrations jsonb not null default '[]'::jsonb,
  color_preferences jsonb not null default '[]'::jsonb,
  inspiration_notes text,
  desired_domain text,
  current_domain text,
  hosting_provider text,
  budget_range text,
  desired_timeline text,
  additional_notes text,
  structured_brief jsonb not null default '{}'::jsonb,
  client_summary text
);

create table if not exists public.intake_messages (
  id uuid primary key default gen_random_uuid(),
  intake_id uuid not null references public.intakes(id) on delete cascade,
  created_at timestamptz not null default now(),
  role text not null check (role in ('user','assistant')),
  content text not null,
  was_redacted boolean not null default false,
  redaction_kinds text[] not null default '{}'::text[]
);

create table if not exists public.intake_uploads (
  id uuid primary key default gen_random_uuid(),
  intake_id uuid not null references public.intakes(id) on delete cascade,
  created_at timestamptz not null default now(),
  kind text not null check (kind in ('logo','inspiration','photo','other')),
  storage_path text not null unique,
  original_name text not null,
  mime_type text,
  size_bytes bigint check (size_bytes is null or size_bytes >= 0)
);

create index if not exists intakes_status_idx on public.intakes(status);
create index if not exists intakes_email_idx on public.intakes(lower(email));
create index if not exists intakes_last_activity_idx on public.intakes(last_activity_at desc);
create index if not exists intake_messages_intake_created_idx on public.intake_messages(intake_id, created_at);
create index if not exists intake_uploads_intake_created_idx on public.intake_uploads(intake_id, created_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists intakes_set_updated_at on public.intakes;
create trigger intakes_set_updated_at
before update on public.intakes
for each row execute function public.set_updated_at();

alter table public.intakes enable row level security;
alter table public.intake_messages enable row level security;
alter table public.intake_uploads enable row level security;

revoke all on table public.intakes from anon, authenticated;
revoke all on table public.intake_messages from anon, authenticated;
revoke all on table public.intake_uploads from anon, authenticated;

grant all on table public.intakes to service_role;
grant all on table public.intake_messages to service_role;
grant all on table public.intake_uploads to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'intake-assets',
  'intake-assets',
  false,
  10485760,
  array['image/jpeg','image/png','image/webp']::text[]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- No storage.objects policies are intentionally created. Uploads and reads
-- will go through the trusted Next.js server using the server-only secret key.
