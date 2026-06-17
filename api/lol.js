export default async function handler(req, res) {
  res.status(200).json({
    ok: true,
    env: process.env.RIOT_API_KEY ? "KEY OK" : "NO KEY"
  });
}
