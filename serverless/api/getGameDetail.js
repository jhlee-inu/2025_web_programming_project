export default async function handler(req, res) {
  // ✅ CORS 헤더 설정
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Preflight 요청 처리
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  const { id } = req.query;
  const apiKey = process.env.RAWG_API_KEY;

  if (!id) {
    return res.status(400).json({ error: "게임 ID가 필요합니다." });
  }

  try {
    const url = `https://api.rawg.io/api/games/${id}?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "게임 상세 정보를 불러오는 데 실패했습니다." });
  }
}
