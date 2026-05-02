// ─── Supabase config ─────────────────────────────────────────────────────────
// Replace the two placeholder values below with your Supabase project's
// URL and anon/public key (Settings → API in the Supabase dashboard).
const SUPABASE_URL      = 'https://emlwpbeyfntwiukbotpq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtbHdwYmV5Zm50d2l1a2JvdHBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MTgyNjIsImV4cCI6MjA5MzI5NDI2Mn0.q24PQ_tuNcm_sVjBIvxD1QXqvqqgP-N1G-GcBELwwPY';

// PIN for brothers' entry page  (change to whatever you like)
const ENTRY_PIN = '0509';

// Only these emails can log in to the admin dashboard
const ADMIN_EMAILS = ['emi.emelda25@gmail.com', 'parth.reddy@live.com'];

// Supabase client — available on all pages that load this file
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ─── Supabase setup — run once in your SQL Editor ───────────────────────────

-- 1. GIFTS TABLE
create table if not exists gifts (
  id            uuid        default gen_random_uuid() primary key,
  created_at    timestamptz default now(),
  giver_name    text        not null,
  type          text        not null check (type in ('angpau','gift')),
  amount        numeric,
  currency      text        default 'MYR',
  description   text,
  side          text        check (side in ('bride','groom','both')),
  notes         text,
  thank_you_sent boolean    default false
);

-- 2. GUESTS / SEATING TABLE
create table if not exists guests (
  id            uuid  default gen_random_uuid() primary key,
  name          text  not null,
  table_number  text  not null,
  table_label   text,
  side          text  check (side in ('bride','groom','both'))
);

-- 3. ROW LEVEL SECURITY
alter table gifts  enable row level security;
alter table guests enable row level security;

-- gifts: anyone (keyer) can insert; only logged-in admin can read/edit/delete
create policy "keyers can insert gifts"
  on gifts for insert to anon with check (true);
create policy "admins can view gifts"
  on gifts for select to authenticated using (true);
create policy "admins can update gifts"
  on gifts for update to authenticated using (true);
create policy "admins can delete gifts"
  on gifts for delete to authenticated using (true);

-- guests: anyone can search their table; only admin can manage
create policy "guests can search seating"
  on guests for select to anon using (true);
create policy "admins can manage seating"
  on guests for all to authenticated using (true) with check (true);

-- 4. ENABLE REALTIME for gifts (Supabase dashboard → Database → Replication)
--    Toggle ON the "gifts" table.

-- 5. AUTH SETTINGS (Supabase dashboard → Authentication → URL Configuration)
--    Add to "Redirect URLs":  https://emilyandparth.pages.dev/admin.html

─────────────────────────────────────────────────────────────────────────── */
