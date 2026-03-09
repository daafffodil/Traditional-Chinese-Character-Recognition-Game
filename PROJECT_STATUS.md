# Project Status

## 1. Current Product Direction
- **single_mapping** remains the stable, primary learning mode and keeps Supabase-backed score saving.
- **multi_mapping (MVP)** is now added as a lightweight second mode focused on sentence context with multiple blanks.

## 2. What Has Been Completed
- **single_mapping is stable and connected**:
  - Simplified prompt + Traditional grid selection remains unchanged.
  - Timer, correctness feedback, and restart flow remain available.
  - Supabase score save + history/leaderboard refresh path remains active.
- **multi_mapping MVP has been added** using local data from `data/multiBlankQuestions.ts`:
  - mode switcher now supports `single_mapping` and `multi_mapping`.
  - simplified character hint is shown first.
  - sentence with multiple blanks is rendered.
  - current blank is highlighted sequentially.
  - candidate Traditional options are shown as large click buttons.
  - click-to-fill places the selected character into the current blank.
  - auto-advance moves to the next blank.
  - after all blanks are filled, full-answer checking runs.
  - success/error feedback is shown.
  - explanation text is shown after answer checking.
  - reset current question and next-question actions are available.
- **UI kept simple and child-friendly**:
  - large text,
  - clear button-based interactions,
  - no drag-and-drop.

## 3. Remaining Gaps / Follow-ups
- **multi_mapping score persistence** is not yet saved to Supabase.
  - Current code includes a TODO note where this can be added with a dedicated schema/strategy.
- **Score sidebar currently reflects single_mapping leaderboard/history only** (existing table structure and APIs are unchanged).
- **Further polish opportunities**:
  - per-blank immediate correctness hints,
  - multi_mapping-specific progress/session tracking,
  - optional multi_mapping leaderboard model if required.

## Immediate Next Action
- [ ] Define minimal Supabase schema/API extension for `multi_mapping` results (if product wants score tracking for this mode).
- [ ] Add optional loading/saving UI state for async actions.
- [ ] Add basic regression tests for mode switching and multi blank-fill flow.
