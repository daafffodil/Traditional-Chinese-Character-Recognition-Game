# Product Requirement Document (PRD)

## Product Name
Traditional Chinese Character Recognition Game

## Version
MVP v1.0

## Target Users
Primary school students who need to learn or recognize Traditional Chinese characters.

## Product Goal
Help students improve their ability to recognize Traditional Chinese characters through an interactive game.

The product combines:
- Listening recognition
- Visual search
- Reaction speed training

The game should be simple, intuitive, and suitable for classroom use.

---

# Core Gameplay

## Game Concept

The system plays the pronunciation of a Chinese character.

Students must quickly find and click the **correct Traditional Chinese character** from a grid of characters.

Only one character in the grid is correct.

Other characters act as distractors.

---

# Game Flow

## Step 1: Play Audio

The system plays the pronunciation of a character.

Example:

爱 (ài)

The pronunciation can be generated using Text-to-Speech.

---

## Step 2: Display Character Grid

The screen displays a grid of Traditional Chinese characters.

The grid size can be selected:

- 3 × 3 (Easy)
- 4 × 4 (Medium)
- 5 × 5 (Hard)

Example grid:

愛   曖   受  
爲   爭   亂  
學   覺   觀  

Only one character is the correct answer.

---

## Step 3: Student Clicks Answer

The student clicks the character they believe is correct.

Example:

Audio: 爱

Correct answer: 愛

---

## Step 4: Feedback

### Correct Answer

- Play reward sound
- The correct character turns green

### Wrong Answer

- Play error sound
- The clicked character turns red

---

# UI Layout

The interface should contain three main areas.

## Left Panel

Timer

Shows the current game time.

Example:

00:12

---

## Center Area

Character grid

Displays the Traditional Chinese characters.

---

## Bottom Area

Difficulty selection

Buttons:

3×3  
4×4  
5×5

---

# Game Timer

A timer starts when the round begins.

The timer stops when the correct character is selected.

The final time is recorded.

---

# Game History

The system stores previous results.

Each record includes:

- Date
- Grid size
- Completion time

Example:

| Date | Grid | Time |
|-----|-----|-----|
| 2026-03-09 | 3×3 | 10s |
| 2026-03-09 | 4×4 | 15s |

---

# Competition Feature

Students can compare scores.

Two comparison modes:

### Personal Best

Students can try to beat their own best time.

### Classroom Competition

Multiple students can compare times in a leaderboard.

Example:

| Rank | Name | Time |
|-----|-----|-----|
| 1 | Student A | 8s |
| 2 | Student B | 10s |
| 3 | Student C | 12s |

---

# Character Data

The game requires a simplified-to-traditional character mapping.

Example dataset:

| Simplified | Traditional | Pinyin |
|-----------|-------------|-------|
| 爱 | 愛 | ai4 |
| 学 | 學 | xue2 |
| 国 | 國 | guo2 |
| 书 | 書 | shu1 |
| 车 | 車 | che1 |

The system randomly selects characters from this dataset.

---

# Grid Generation Logic

When a round starts:

1. Select a random simplified character
2. Find its Traditional equivalent
3. Place the correct Traditional character in the grid
4. Fill remaining cells with random Traditional characters from the dataset
5. Shuffle the grid

---

# Audio System

The system should generate pronunciation audio using TTS.

Possible implementation:

Web Speech API

---

# Basic Technology Stack

Recommended stack for MVP:

Frontend:
- React
- Next.js

Backend:
- Supabase (for storing scores and history)

Database tables:

scores
characters

---

# Database Design

## characters table

| field | type |
|-----|-----|
| id | integer |
| simplified | text |
| traditional | text |
| pinyin | text |

---

## scores table

| field | type |
|-----|-----|
| id | integer |
| player_name | text |
| grid_size | integer |
| completion_time | float |
| created_at | timestamp |

---

# MVP Scope

Version 1 only includes:

- Character audio playback
- Character grid
- Click recognition
- Correct / incorrect feedback
- Timer
- Game history
- Leaderboard

Advanced game mechanics will be added in future versions.

---

# Future Features (Not in MVP)

- Combo system
- Achievement system
- Daily challenges
- Memory mode
- Adaptive difficulty

---

# Success Criteria

Students should be able to:

- Understand the gameplay within 10 seconds
- Complete a round within 30 seconds
- Replay the game multiple times

The game should be simple, fast, and engaging.
