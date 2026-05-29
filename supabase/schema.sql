create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  pin_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  account text not null,
  ad_set text not null,
  cpl_target numeric not null,
  kill_switch numeric not null,
  reach_target text not null,
  action text not null,
  current_cpl numeric,
  spend_today numeric default 0,
  status text not null default 'active',
  updated_at timestamptz not null default now()
);

create table if not exists briefs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  owner text not null,
  assignee text not null,
  deadline date not null,
  status text not null,
  seen_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  brief_id uuid references briefs(id) on delete cascade,
  uploader text not null,
  file_url text not null,
  note text,
  decision text not null default 'pending',
  reviewer_comment text,
  created_at timestamptz not null default now()
);

create table if not exists weekly_reports (
  id uuid primary key default gen_random_uuid(),
  week_start date not null,
  campaign text not null,
  channel text not null,
  spend numeric not null,
  qualified_leads integer not null,
  previous_real_cpl numeric,
  created_at timestamptz not null default now()
);

create table if not exists status_updates (
  id uuid primary key default gen_random_uuid(),
  member text not null,
  completed_yesterday text not null,
  working_today text not null,
  blockers text not null,
  created_at timestamptz not null default now()
);

create table if not exists creative_requests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  creator text not null,
  assignee text not null,
  channel text not null,
  status text not null default 'Pending',
  manager_comment text,
  file_url text,
  green_light boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor text not null,
  action text not null,
  target text not null,
  created_at timestamptz not null default now()
);
