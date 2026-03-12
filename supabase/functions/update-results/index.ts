import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const RAPIDAPI_KEY = Deno.env.get("RAPIDAPI_KEY")!;
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

async function getGame(id: string) {
  const res = await fetch(
    `https://api-foot.p.rapidapi.com/games/?id=${id}`,
    {
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "api-foot.p.rapidapi.com",
      },
    }
  );
  const data = await res.json();
  return data.response[0];
}

Deno.serve(async (_req: Request) => {
  try {
    const now = new Date();
    const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);

    const { data: matches, error } = await supabase
      .from("matches")
      .select("*")
      .gte("date_time", threeHoursAgo.toISOString())
      .lt("date_time", now.toISOString())
      .eq("finished", false);

    if (error) throw error;
    if (!matches?.length) {
      return new Response(
        JSON.stringify({ message: "No matches to update" }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    const results = [];
    for (const match of matches) {
      if (!match.api_id) continue;

      const gameStatus = await getGame(match.api_id);

      const { error: updateError } = await supabase
        .from("matches")
        .update({
          score_a: gameStatus.scores.home,
          score_b: gameStatus.scores.away,
          finished: gameStatus.status.long === "Finished",
        })
        .eq("id", match.id);

      results.push({
        match: match.id,
        success: !updateError,
        scores: { home: gameStatus.scores.home, away: gameStatus.scores.away },
      });
    }

    return new Response(JSON.stringify({ results }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
