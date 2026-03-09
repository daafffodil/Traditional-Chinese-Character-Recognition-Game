import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const getSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey);
};

export async function POST(request: NextRequest) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ success: false, message: 'Supabase is not configured.' }, { status: 503 });
  }

  const body = await request.json();
  const playerName = typeof body.playerName === 'string' && body.playerName.trim() ? body.playerName.trim() : 'Anonymous';
  const gridSize = Number(body.gridSize);
  const completionTime = Number(body.completionTime);

  if (!Number.isFinite(gridSize) || !Number.isFinite(completionTime)) {
    return NextResponse.json({ success: false, message: 'Invalid score payload.' }, { status: 400 });
  }

  const { error } = await supabase
    .schema('public')
    .from('tc_game_scores')
    .insert({
      player_name: playerName,
      grid_size: gridSize,
      completion_time: completionTime,
    });

  if (error) {
    return NextResponse.json({ success: false, message: `Save failed: ${error.message}` }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function GET(request: NextRequest) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ history: [], leaderboard: [] });
  }

  const searchParams = request.nextUrl.searchParams;
  const historyLimit = Number(searchParams.get('historyLimit') ?? 8);
  const leaderboardLimit = Number(searchParams.get('leaderboardLimit') ?? 10);
  const gridSize = Number(searchParams.get('gridSize') ?? 3);

  const [historyResult, leaderboardResult] = await Promise.all([
    supabase
      .schema('public')
      .from('tc_game_scores')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(historyLimit),
    supabase
      .schema('public')
      .from('tc_game_scores')
      .select('*')
      .eq('grid_size', gridSize)
      .order('completion_time', { ascending: true })
      .limit(leaderboardLimit),
  ]);

  return NextResponse.json({
    history: historyResult.error || !historyResult.data ? [] : historyResult.data,
    leaderboard: leaderboardResult.error || !leaderboardResult.data ? [] : leaderboardResult.data,
  });
}
