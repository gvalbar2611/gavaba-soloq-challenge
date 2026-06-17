export default async function handler(req, res) {
  const API_KEY = process.env.RIOT_API_KEY;

  const players = [
    { gameName: "Hugo Peña", tagLine: "HPT" },
    { gameName: "Gabriel Valiente", tagLine: "GGB" },
    { gameName: "EL BAIFO", tagLine: "MVP" },
    { gameName: "elbaifoo", tagLine: "mvp" },
    { gameName: "JUNGLE", tagLine: "CAPI" },
    { gameName: "Wensel", tagLine: "777" },
    { gameName: "Guerra", tagLine: "SFC" },
    { gameName: "Poli Sama", tagLine: "091" },
    { gameName: "PONABE ZzZ", tagLine: "AKN" }
  ];

  try {
    const results = await Promise.all(
      players.map(async (p) => {

        const url = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(p.gameName)}/${encodeURIComponent(p.tagLine)}`;

        const r = await fetch(url, {
          headers: {
            "X-Riot-Token": API_KEY
          }
        });

        if (!r.ok) {
          return {
            name: `${p.gameName}#${p.tagLine}`,
            level: null,
            error: "account not found"
          };
        }

        const data = await r.json();

        return {
          name: `${p.gameName}#${p.tagLine}`,
          puuid: data.puuid
        };
      })
    );

    res.status(200).json(results);

  } catch (error) {
    res.status(500).json({
      error: "API ERROR",
      detail: error.message
    });
  }
}
