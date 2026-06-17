export default async function handler(req, res) {
  const API_KEY = process.env.RIOT_API_KEY;

  const summoners = [
    "Hugo Peña",
    "Gabriel Valiente",
    "EL BAIFO",
    "elbaifoo",
    "JUNGLE",
    "Wensel",
    "Guerra",
    "Poli Sama",
    "PONABE ZzZ"
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
            level: 0
          };
        }

        const data = await r.json();

        return {
          name: data.name,
          level: data.summonerLevel
        };
      })
    );

    res.status(200).json(results);

  } catch (error) {
    res.status(500).json({
      error: "Error en API LoL"
    });
  }
}
