export default async function handler(req, res) {
  const API_KEY = process.env.RIOT_API_KEY;

  const players = [
    { gameName: "Hugo Peña", tagLine: "HPT" },
    { gameName: "Gavaba29", tagLine: "Ytube" },
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

        const accRes = await fetch(
          `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(p.gameName)}/${encodeURIComponent(p.tagLine)}`,
          {
            headers: { "X-Riot-Token": API_KEY }
          }
        );

        if (!accRes.ok) {
          return {
            name: `${p.gameName}#${p.tagLine}`,
            solo: { rank: "UNRANKED", division: "", lp: 0 },
            flex: { rank: "UNRANKED", division: "", lp: 0 }
          };
        }

        const accData = await accRes.json();
        const puuid = accData.puuid;

        const rankRes = await fetch(
          `https://euw1.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`,
          {
            headers: { "X-Riot-Token": API_KEY }
          }
        );

        const rankData = await rankRes.json();

        const soloQ = rankData.find(r => r.queueType === "RANKED_SOLO_5x5");
        const flex = rankData.find(r => r.queueType === "RANKED_FLEX_SR");

        return {
          name: `${p.gameName}#${p.tagLine}`,

          solo: {
            rank: soloQ ? soloQ.tier : "UNRANKED",
            division: soloQ ? soloQ.rank : "",
            lp: soloQ ? soloQ.leaguePoints : 0
          },

          flex: {
            rank: flex ? flex.tier : "UNRANKED",
            division: flex ? flex.rank : "",
            lp: flex ? flex.leaguePoints : 0
          }
        };
      })
    );

    results.sort((a, b) => (b.solo.lp || 0) - (a.solo.lp || 0));

    res.status(200).json(results);

  } catch (error) {
    res.status(500).json({
      error: "API ERROR",
      detail: error.message
    });
  }
}
