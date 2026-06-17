export default async function handler(req, res) {
  const API_KEY = process.env.RIOT_API_KEY;

  const summoners = [
    "Hugo Peña#HPT",
    "Gabriel Valiente#GGB",
    "EL BAIFO#MVP",
    "elbaifoo#mvp",
    "JUNGLE#CAPI",
    "Wensel#777",
    "Guerra#SFC",
    "Poli Sama#091",
    "PONABE ZzZ#AKN"
  ];

  try {
    const results = await Promise.all(
      summoners.map(async (name) => {

        const url = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(name)}`;

        const r = await fetch(url, {
          headers: {
            "X-Riot-Token": API_KEY
          }
        });

        if (!r.ok) {
          return {
            name,
            level: null,
            error: "not found"
          };
        }

        const data = await r.json();

        return {
          name: data.name,
          level: data.summonerLevel
        };
      })
    );

    return res.status(200).json(results);

  } catch (error) {
    return res.status(500).json({
      error: "API ERROR",
      detail: error.message
    });
  }
}
