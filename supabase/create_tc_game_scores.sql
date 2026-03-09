create table if not exists public.tc_game_scores (
  id uuid primary key default gen_random_uuid(),
  player_name text not null,
  grid_size integer not null check (grid_size in (3,4,5)),
  completion_time numeric not null,
  created_at timestamptz not null default now()
);

create index if not exists tc_game_scores_grid_size_idx
  on public.tc_game_scores (grid_size);

create index if not exists tc_game_scores_time_idx
  on public.tc_game_scores (completion_time);

create index if not exists tc_game_scores_created_at_idx
  on public.tc_game_scores (created_at desc);
