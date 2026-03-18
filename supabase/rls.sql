/*
  Supabase Database Linter Fix
  ---------------------------
  The Supabase linter flags tables in the `public` schema that are exposed to PostgREST
  when Row Level Security (RLS) is disabled.

  This script:
  - Enables RLS on the listed tables
  - Forces RLS (so even table owners don't bypass it via PostgREST)

  IMPORTANT:
  - With RLS enabled and *no policies*, PostgREST access is DENIED by default
    for `anon` and `authenticated`.
  - The `service_role` key bypasses RLS (intended for server-side use).
*/

-- NextAuth / Auth tables
alter table if exists public."User" enable row level security;
alter table if exists public."Account" enable row level security;
alter table if exists public."Session" enable row level security;
alter table if exists public."VerificationToken" enable row level security;

alter table if exists public."User" force row level security;
alter table if exists public."Account" force row level security;
alter table if exists public."Session" force row level security;
alter table if exists public."VerificationToken" force row level security;

-- MediQ domain tables
alter table if exists public."Doctor" enable row level security;
alter table if exists public."Slot" enable row level security;
alter table if exists public."Appointment" enable row level security;

alter table if exists public."Doctor" force row level security;
alter table if exists public."Slot" force row level security;
alter table if exists public."Appointment" force row level security;

-- Optional commerce placeholder tables (present in schema.prisma)
alter table if exists public."Product" enable row level security;
alter table if exists public."Order" enable row level security;
alter table if exists public."OrderItem" enable row level security;

alter table if exists public."Product" force row level security;
alter table if exists public."Order" force row level security;
alter table if exists public."OrderItem" force row level security;

