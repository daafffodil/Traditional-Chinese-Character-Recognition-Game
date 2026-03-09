# Product Requirement Document (PRD)

## Product Name
Traditional Chinese Character Recognition Game

## Version
MVP v1.1

## Target Users
Primary school students learning to recognize Traditional Chinese characters.

## Product Goal
Help students build Traditional Chinese character recognition through a simple, repeatable game loop that is suitable for classroom and after-class practice.

---

## Learning Modes

The product roadmap defines two learning modes:

### Mode 1 (Current MVP Scope): One-to-One Mapping
- Learner sees a **simplified Chinese character** prompt.
- Learner chooses the matching **single traditional Chinese character** from a grid.
- This mode focuses on direct simplified-to-traditional mapping where one simplified character maps to one primary traditional form in the dataset.

### Mode 2 (Future Scope): One-to-Many Mapping with Context
- Learner handles cases where one simplified character maps to **multiple traditional forms**.
- The game provides a sentence/context prompt so the learner picks the correct traditional character by meaning and usage.
- This mode is **not included in MVP** and is planned for a later phase.

---

## MVP Gameplay (Mode 1)

### Round Flow
1. Show a simplified Chinese character.
2. Show a grid of traditional Chinese character options (e.g., 3×3, 4×4, 5×5).
3. Player clicks the correct traditional Chinese character.
4. Timer records completion time from round start until correct click.
5. Save score/history to Supabase.

### Feedback
- Correct click: reward sound + visual correct state.
- Incorrect click: error sound + visual incorrect state.

---

## UI Layout

### Left Panel
- Timer (current round time)

### Center Area
- Traditional character option grid

### Bottom Area
- Difficulty controls (3×3 / 4×4 / 5×5)

---

## Data Scope (MVP)

### Character Dataset
- Character mapping dataset remains **local in code** for MVP.
- Dataset includes simplified character, traditional character, and optional pinyin.

Example:

| Simplified | Traditional | Pinyin |
|---|---|---|
| 爱 | 愛 | ai4 |
| 学 | 學 | xue2 |
| 国 | 國 | guo2 |

### Database Usage (MVP)
- Supabase is used **only** for score/history storage in MVP.
- Character mapping is **not** stored in database in MVP.

---

## Grid Generation Logic (Mode 1)
1. Randomly pick a simplified character from local dataset.
2. Read its corresponding traditional character.
3. Place correct traditional character into grid.
4. Fill remaining grid cells with random traditional distractors.
5. Shuffle grid positions.

---

## Audio
- Pronunciation can be played via TTS (e.g., Web Speech API) as an assistive cue.

---

## Technology (MVP)

### Frontend
- React
- Next.js

### Backend
- Supabase (scores/history only)

### Database Table (MVP)

#### scores
| field | type |
|---|---|
| id | integer |
| player_name | text |
| grid_size | integer |
| completion_time | float |
| created_at | timestamp |

---

## MVP Scope Summary
Included in MVP:
- Mode 1 one-to-one mapping gameplay
- Character prompt + traditional grid selection
- Timer and completion time tracking
- Correct/incorrect feedback
- Score/history persistence to Supabase

Not included in MVP:
- Mode 2 one-to-many context-based gameplay
- Sentence fill-in and contextual disambiguation system

---

## Future Phase (Post-MVP)

### Mode 2: Context-Based Sentence Fill-in
For one-to-many mappings, players complete sentence/context tasks and choose the correct traditional character based on meaning and usage.

Possible additions:
- Adaptive difficulty
- Daily challenges
- Achievement system
- Learning progress analytics

---

## Success Criteria
- Students understand Mode 1 gameplay within 10 seconds.
- Students can complete a round within 30 seconds.
- Students replay multiple rounds for practice.
