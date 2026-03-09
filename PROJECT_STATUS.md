# Project Status

## 1. Current Product Direction
- **single_mapping** remains the stable, primary learning mode and keeps Supabase-backed score saving.
- **multi_mapping (MVP)** is now added as a lightweight second mode focused on sentence context with multiple blanks.

## 2. What Has Been Completed
- **Database fields for multi_mapping are ready in `public.tc_game_scores`**:
  - `game_mode`
  - `target_simplified`
  - `question_type`
  - `blank_count`
  - `is_correct`
- **Score saving now supports both modes using the same table (`public.tc_game_scores`)**:
  - `single_mapping` saves with `game_mode=single_mapping`, `question_type=single_choice`, `blank_count=1`, `is_correct=true`, and current simplified character.
  - `multi_mapping` saves with `game_mode=multi_mapping`, `question_type=multi_blank`, per-question blank count, full-question correctness, and current simplified character.
- **History and leaderboard now support mode filtering**:
  - queries default to current mode,
  - single_mapping pages remain compatible,
  - multi_mapping history can show simplified target and blank count.
- **Fallback behavior improved**:
  - if Supabase insert/select fails, gameplay continues locally,
  - users get a small helpful message instead of a crash.

## 3. Remaining Gaps / Follow-ups
- **multi_mapping completion_time currently uses a placeholder value (`0`)**.
  - If product wants timing-based ranking for multi mode, add a dedicated timer model for multi_mapping.
- **Further polish opportunities**:
  - per-blank immediate correctness hints,
  - multi_mapping-specific progress/session tracking,
  - optional custom leaderboard sorting for multi_mapping correctness-first ranking.

## Immediate Next Action
- [ ] Add optional loading/saving UI state for async actions.
- [ ] Add basic regression tests for mode switching and multi blank-fill flow.
- [ ] Decide final ranking strategy for multi_mapping records (time vs correctness-weighted).
