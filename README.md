# Traditional Chinese Character Recognition Game (MVP)

A simple and friendly educational web game for primary school students.

Students listen to a pronunciation and click the correct **Traditional Chinese character** in a grid.

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Supabase (`public.tc_game_scores`)
- Web Speech API (TTS)

## Features

- 3 difficulty levels: 3×3, 4×4, 5×5
- Random round generation with one correct answer and shuffled distractors
- Text-to-speech pronunciation playback + replay button
- Correct / incorrect visual feedback
- Live timer and completion-time recording
- Save score to Supabase after correct answer
- Recent history + leaderboard sections
- Graceful fallback when Supabase env vars are missing

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Copy the example file:

```bash
cp .env.example .env.local
```

Set your values in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> If these variables are missing, gameplay still works, but score saving/reading is disabled.

### 3) Create the database table in Supabase

Run the SQL in `supabase/create_tc_game_scores.sql` inside your Supabase SQL editor.

The app strictly uses:

- Schema: `public`
- Table: `tc_game_scores`
- Columns: `id`, `player_name`, `grid_size`, `completion_time`, `created_at`

### 4) Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

You can deploy to Vercel or any Next.js-compatible platform.

Make sure production environment variables are configured:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Project Structure

- `app/` – main page and global styles
- `components/` – reusable UI components
- `data/` – starter character dataset
- `lib/` – game logic, audio helper, Supabase service
- `types/` – TypeScript types
- `supabase/` – SQL schema file

