import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const RAPIDAPI_KEY = Deno.env.get("RAPIDAPI_KEY")!;
const COEFF_MULTIPLIER = 110;

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

async function getOddsGames() {
  const res = await fetch(
    "https://api-foot.p.rapidapi.com/odds?league=69&season=2023&bookmaker=6&bet=1",
    {
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "api-foot.p.rapidapi.com",
      },
    }
  );
  const data = await res.json();
  return data.response;
}

Deno.serve(async (_req: Request) => {
  try {
    const oddsGames = await getOddsGames();
    const results = [];

    for (const matchData of oddsGames) {
      const apiId = matchData.game.id.toString();

      const { data: matches } = await supabase
        .from("matches")
        .select("*")
        .eq("api_id", apiId)
        .limit(1);

      if (!matches?.length) continue;
      const match = matches[0];
      if (match.finished) continue;

      const bets = matchData.bookmakers?.[0]?.bets?.[0]?.values;
      if (!bets) continue;

      const { error: updateError } = await supabase
        .from("matches")
        .update({
          odds_a: Math.round(bets[0].odd * COEFF_MULTIPLIER),
          odds_draw: Math.round(bets[1].odd * COEFF_MULTIPLIER),
          odds_b: Math.round(bets[2].odd * COEFF_MULTIPLIER),
        })
        .eq("id", match.id);

      results.push({
        match: match.id,
        success: !updateError,
      });
    }

    return new Response(JSON.stringify({ results }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
