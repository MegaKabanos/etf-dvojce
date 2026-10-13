-- Dvojče: leads table. Writes come only from the server (service role key).
-- RLS is enabled with no policies, so anon/authenticated roles can read and write nothing.

create table if not exists public.leads (
  id          bigint generated always as identity primary key,
  email       text        not null check (char_length(email) between 3 and 254),
  fund        text        check (fund is null or fund ~ '^[A-Z]{1,5}$'),
  monthly     integer     check (monthly is null or monthly between 500 and 30000),
  years       smallint    check (years is null or years between 1 and 40),
  variant     text,
  utm_source  text,
  utm_medium  text,
  utm_campaign text,
  utm_content text,
  user_agent  text,
  created_at  timestamptz not null default now()
);

alter table public.leads enable row level security;
revoke all on public.leads from anon, authenticated;

create index if not exists leads_created_at_idx on public.leads (created_at);
create index if not exists leads_email_idx on public.leads (email);
