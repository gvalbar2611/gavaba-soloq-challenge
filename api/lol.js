export default async function handler(req, res) {
  const API_KEY = process.env.RIOT_API_KEY;

  const players = [
    { gameName: "Hugo Peña", tagLine: "HPT" },
    { gameName: "Gabriel Valiente", tagLine: "GGB" },
    { gameName: "EL BAIFO", tagLine: "MVP" },
    { gameName: "elbaifoo", tagLine: "MVP" },
    { gameName: "JUNGLE", tagLine: "CAPI" },
    { gameName: "Wensel", tagLine: "777" },
    { gameName: "Guerra", tagLine: "SFC" },
    { gameName: "Poli Sama", tagLine: "091" },
    { gameName: "PONABE ZzZ", tagLine: "AKN" }
  ];

  try {
    const results = await Promise.all(
      players.map(async (p) => {

        // 1️⃣ Riot ID → PUUID
        const accRes = await fetch(
          `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(p.gameName)}/${encodeURIComponent(p.tagLine)}`,
          {
            headers: { "X-Riot-Token": API_KEY }
          }
        );

        if (!accRes.ok) {
          return {
            name: `${p.gameName}#${p.tagLine}`,
            rank: "UNRANKED",
            lp: 0
          };
        }

        const accData = await accRes.json();

        const puuid = accData.puuid;

        // 2️⃣ PUUID → ranked info
        const rankRes = await fetch(
          `https://euw1.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`,
          {
            headers: { "X-Riot-Token": API_KEY }
          }
        );

        const rankData = await rankRes.json();

        const soloQ = rankData.find(r => r.queueType === "RANKED_SOLO_5x5");

        return {
          name: `${p.gameName}#${p.tagLine}`,
          rank: soloQ ? soloQ.tier : "UNRANKED",
          lp: soloQ ? soloQ.leaguePoints : 0,
          wins: soloQ ? soloQ.wins : 0,
          losses: soloQ ? soloQ.losses : 0
        };
      })
    );

    // ordenar por LP
    results.sort((a, b) => (b.lp || 0) - (a.lp || 0));

    res.status(200).json(results);

  } catch (error) {
    res.status(500).json({
      error: "RIOT API ERROR",
      detail: error.message
    });
  }
}
