export default function handler(req, res) {
  console.log("API FUNCIONA ✔");

  res.status(200).json({
    ok: true,
    time: Date.now()
  });
}
