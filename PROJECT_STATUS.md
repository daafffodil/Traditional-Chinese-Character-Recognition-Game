# PROJECT_STATUS

## Current Progress

The repository already contains a complete **MVP skeleton and core implementation** for the Traditional Chinese Character Recognition Game:

- **Framework and tooling setup** is in place:
  - Next.js 14 (App Router), React, TypeScript, Tailwind CSS, ESLint.
  - Root config files are present (`package.json`, `tsconfig.json`, `next.config.mjs`, `tailwind.config.ts`, `postcss.config.js`).
- **Main game page** is implemented in `app/page.tsx`:
  - Player name input (optional)
  - Difficulty selector (3×3 / 4×4 / 5×5)
  - Start/Restart button
  - Replay audio button
  - Live timer display
  - Status message area
  - Integrated recent history and leaderboard panels
- **Gameplay logic** is implemented:
  - Random target character selection
  - Grid generation with one correct Traditional Chinese answer and shuffled distractors
  - Correct/incorrect click feedback (green/red highlights)
  - Timer start/stop and elapsed time handling
- **Audio support** is implemented via browser TTS (`SpeechSynthesisUtterance`) in `lib/audio.ts`.
- **Character starter dataset** is included locally (`data/characters.ts`), so gameplay works without DB seeding.
- **Supabase integration** exists and is scoped to the required table:
  - Reads/writes use `public.tc_game_scores`
  - Save score after correct answer
  - Fetch recent history and difficulty-filtered leaderboard
  - Graceful fallback when env vars are missing (game remains playable)
- **Database SQL file** is provided at `supabase/create_tc_game_scores.sql`.
- **README and env template** are present for local setup and deployment.

---

## Missing Features

Compared to `PRD.md`, most MVP items are implemented. Remaining gaps or partial areas are:

1. **Reward/error sounds are not implemented**
   - PRD mentions playing a reward sound and error sound.
   - Current app provides visual feedback and TTS for prompts, but no dedicated SFX files or audio cues for right/wrong clicks.

2. **No explicit personal-best view per player**
   - PRD competition section includes personal best and classroom comparison.
   - Current leaderboard is global (and filtered by grid size), but there is no dedicated “my best time” panel tied to current player name.

3. **No automated test suite**
   - MVP behavior is implemented, but there are no unit/integration/E2E tests included in the repo.

4. **Production-hardening details are minimal**
   - PRD asks for simple and reliable MVP (which is mostly done), but robustness around DB policy configuration and runtime observability is not documented in depth.

---

## Next Development Steps

Recommended next steps (ordered by impact):

1. **Add lightweight sound feedback for answer results**
   - Add short local audio assets for success/failure.
   - Trigger them on correct/incorrect clicks.
   - Keep TTS flow unchanged.

2. **Add “Personal Best” section**
   - Query `public.tc_game_scores` by current `player_name` and selected `grid_size`.
   - Show best time and date to align with PRD competition requirement.

3. **Add basic automated checks**
   - At minimum: `npm run lint` + `npm run build` in CI.
   - Optional: simple unit tests for `createRoundGrid` to validate:
     - one correct answer only
     - proper grid size
     - no duplicate correct answer in distractors

4. **Document Supabase policy requirements clearly**
   - Add a README section for RLS policy examples so inserts/selects work in deployed environments.

5. **Polish UX for classroom use**
   - Improve mobile/tablet spacing for 5×5 mode.
   - Consider larger touch targets on smaller screens.

---

## Possible Issues

Potential deployment/runtime issues to watch for:

1. **Supabase environment variables missing in hosting platform**
   - If `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` are not set, score save/read will silently degrade to fallback behavior.
   - Gameplay still works, but history/leaderboard remain empty.

2. **Supabase RLS/policies may block reads/writes**
   - Even with correct env vars, if `public.tc_game_scores` policies are not configured for anon key access, inserts/selects fail.

3. **Table/schema mismatch risk**
   - App is hardcoded to `public.tc_game_scores` and specific columns.
   - Any manual schema deviation (different table name, missing columns, wrong types) will break leaderboard/history/save.

4. **`gen_random_uuid()` availability**
   - SQL uses `gen_random_uuid()` default.
   - In environments where required extension support differs, table creation could fail unless function is available.

5. **Browser TTS variability**
   - Web Speech API behavior differs across browsers/devices; pronunciation voice/latency may vary.
   - Some clients may require user interaction before playback works reliably.

6. **Build/registry/network constraints in CI**
   - If the deployment/build environment cannot access npm registry or has package policy restrictions, install/build can fail before app start.

