
create table if not exists public.shared_message_drafts (
  id text primary key,
  department text not null,
  subject text not null,
  html text not null,
  plain_text text not null default '',
  created_at timestamptz not null default now(),
  week_label text not null default '',
  start_date text not null default '',
  label text not null default '',
  snapshot jsonb
);

create index if not exists shared_message_drafts_created_at_idx
  on public.shared_message_drafts (created_at desc);
