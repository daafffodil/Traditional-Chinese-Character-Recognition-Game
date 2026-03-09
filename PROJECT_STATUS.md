# Project Status

## 1. Current Product Direction
- **Mode 1 (one-to-one mapping)** is clearly the current MVP direction: the current game loop asks the learner to listen/read one simplified target and click one matching traditional character in a single grid.
- **Mode 2 (one-to-many mapping with sentence context)** is not implemented yet and should be treated as a later phase after Mode 1 is fully stable end-to-end.

## 2. What Has Been Completed
- **Project structure is in place** with a standard Next.js App Router layout (`app/`, `components/`, `lib/`, `data/`, `types/`, `supabase/`) and runnable scripts (`dev`, `build`, `lint`).
- **Core UI is implemented on the main page**:
  - player name input
  - difficulty selector (3×3 / 4×4 / 5×5)
  - start/restart and replay-audio controls
  - timer display
  - status messaging
  - sidebar score panels
- **Reusable UI components exist**:
  - `GameGrid` renders clickable character cells with correct/incorrect visual states.
  - `ScoreTable` renders both history and leaderboard tables.
- **Local character dataset is present** and wired into gameplay (150 entries from `data/dse_core_characters.json`).
- **Simplified prompt + traditional answer flow is implemented**:
  - each round selects one mapping
  - simplified character is shown as question
  - traditional distractor grid is generated and shuffled.
- **Timer/game logic is implemented for a single round**:
  - timer starts on round start
  - click correctness is checked
  - on success, completion time is computed and displayed.
- **Supabase integration is implemented**:
  - API route supports score insert + history/leaderboard queries.
  - writes target `public.tc_game_scores`.
  - SQL schema for `public.tc_game_scores` is included.
- **Score/history UI is connected**:
  - recent history and difficulty-filtered leaderboard are fetched and rendered.
- **Graceful env-var fallback is present**:
  - if Supabase env vars are missing, gameplay still runs and score panels degrade to empty/fallback behavior.

## 3. What Is Not Yet Completed
For the **current MVP scope**, these are still missing or need strengthening:
- **One-to-one gameplay loop completion (productized)**: current loop works, but there is no multi-round/session progression (e.g., N questions per run, end-of-session summary, restart flow tied to session goals).
- **Click correctness check hardening**: correctness checking exists, but there is no anti-double-submit/locking around async save and no explicit telemetry/error state for repeated taps under latency.
- **Timer completion and save flow hardening**: timer/save works, but no robust handling for save-in-progress, retry, or explicit “saved vs not saved” state beyond status text.
- **Insert to `public.tc_game_scores` validation**: insertion is implemented, but production readiness depends on Supabase RLS/policy setup and matching env keys at deploy time.
- **Leaderboard/history refresh robustness**: refresh runs after save and difficulty changes, but no loading/error UI states and no backoff/retry when Supabase is temporarily unavailable.
- **Graceful fallback UX can be clearer**: fallback exists, but messaging can be further unified so users always know whether they are in offline/local mode and that leaderboard data may be unavailable.

## 4. Next Recommended Step
**Best single next task:**

Implement a **Mode 1 “end-to-end score commit path” hardening pass** that finalizes the correct-answer flow from click → timer stop → save status → panel refresh using `public.tc_game_scores` as the source of truth.

Concretely, do this in one focused PR:
1. Add explicit save states (`idle/saving/saved/error`) to prevent duplicate submits.
2. Show clear UI feedback when a record is stored vs failed.
3. Trigger deterministic leaderboard/history refresh only after save completion.
4. Keep current fallback behavior when env vars are missing, but surface a consistent “local mode” hint.

This gives a fully runnable Mode 1 loop with reliable Supabase persistence.

## 5. Risks / Possible Issues
- **Supabase env vars may be absent/mismatched** between local and deployment environments.
- **RLS policies on `public.tc_game_scores` may block anon insert/select**, causing silent feature degradation if not surfaced clearly.
- **Schema drift risk**: app assumes exact columns (`player_name`, `grid_size`, `completion_time`, `created_at`).
- **Network instability** can cause intermittent save/query failures; current UX has limited retry/error handling.
- **Browser TTS variability** (voice availability, autoplay/user-gesture constraints) may affect the classroom experience.

## Immediate Next Action
- [ ] Add explicit client save-state handling (`saving/saved/error`) around `saveScore` in `app/page.tsx`.
- [ ] Disable grid input and action buttons while score save is in progress to avoid duplicate submissions.
- [ ] Add visible load/error states for history and leaderboard refresh calls.
- [ ] Verify Supabase RLS policies for anon `insert/select` on `public.tc_game_scores` and document them in `README.md`.
