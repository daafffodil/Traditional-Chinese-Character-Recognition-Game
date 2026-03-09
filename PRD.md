# Product Requirement Document (PRD)

## Product Name
Traditional Chinese Character Recognition Game

## Version
MVP v1.2

## Target Users
Primary school students learning to recognize Traditional Chinese characters.

## Product Goal
Help students build Traditional Chinese character recognition through simple, repeatable game loops suitable for classroom and after-class practice.

---

## Learning Modes

The product now includes two defined game modes:

### Mode 1: `single_mapping` (Current Completed MVP)
- One simplified Chinese character maps to one traditional Chinese character.
- Learner sees a simplified character prompt and selects the matching traditional character from a grid.
- This mode is already implemented and connected to Supabase for score/history recording.
- This remains the currently completed MVP mode and must stay stable.

### Mode 2: `multi_mapping` (Next MVP Development Phase)
- One simplified Chinese character can map to multiple traditional Chinese characters depending on context.
- Gameplay uses **contextual sentence/phrase fill-in**.
- A single question contains **multiple blanks**.
- Blanks are answered with **sequential blank highlighting** (one target blank at a time).
- Interaction is **click-to-fill** (player clicks candidate characters/words to fill blanks).
- First runnable version targets only **10–15 questions**.
- The question bank is stored **locally in code** (not in database).

---

## Current Development Priority
1. Keep `single_mapping` stable as the active, playable MVP mode.
2. Implement the first runnable `multi_mapping` MVP with multi-blank contextual fill-in.

---

## Gameplay Requirements by Mode

### `single_mapping` Round Flow (Already Live)
1. Show a simplified Chinese character.
2. Show a grid of traditional Chinese options (e.g., 3×3, 4×4, 5×5).
3. Player clicks the correct traditional character.
4. Timer records completion time from round start until correct click.
5. Save score/history to Supabase.

### `multi_mapping` Question Flow (In MVP Development)
1. Show a sentence/phrase with multiple blanks.
2. Highlight the current blank to answer.
3. Player clicks a candidate option to fill the highlighted blank.
4. Move highlight to the next blank and continue until all blanks are filled.
5. Evaluate correctness for the full question and show feedback.
6. Record gameplay results in existing score/history pipeline as needed.

---

## UI Layout

### Shared
- Timer / progress indicators
- Correct/incorrect feedback audio + visual state

### `single_mapping`
- Center: traditional character option grid
- Bottom: difficulty controls (3×3 / 4×4 / 5×5)

### `multi_mapping`
- Sentence/phrase display area with multiple blanks
- Sequential blank highlight state
- Clickable option bank for fill-in

---

## Data Scope

### Content / Question Bank
- `single_mapping` character mapping content remains local in code.
- `multi_mapping` question bank (10–15 MVP questions) also remains local in code.
- No gameplay content is required in database for the MVP phases.

### Database Usage
- Supabase is used for **scores, play history, and leaderboard-related records only**.
- Database is not the source of truth for mode content/questions in MVP.

---

## Audio
- Pronunciation or assistive cues can be played via TTS (e.g., Web Speech API).

---

## Technology

### Frontend
- React
- Next.js

### Backend
- Supabase (scores/history/leaderboard records)

### Database Table (Current MVP)

#### `scores`
| field | type |
|---|---|
| id | integer |
| player_name | text |
| grid_size | integer |
| completion_time | float |
| created_at | timestamp |

---

## Scope Summary

### Completed / Live
- `single_mapping` one-to-one mapping gameplay
- Character prompt + traditional grid selection
- Timer and completion tracking
- Correct/incorrect feedback
- Score/history persistence via Supabase

### In Current MVP Development
- `multi_mapping` contextual one-to-many gameplay
- Sentence/phrase-based multi-blank fill-in
- Sequential blank highlighting
- Click-to-fill interaction
- Initial 10–15 local-code questions

---

## Success Criteria
- Students understand `single_mapping` gameplay within 10 seconds.
- `single_mapping` remains stable while new features are added.
- First runnable `multi_mapping` MVP supports complete playthrough of 10–15 questions.
