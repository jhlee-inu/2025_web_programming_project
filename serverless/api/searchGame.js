export default async function handler(req, res) {
  // ✅ CORS 헤더 설정
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Preflight 요청 처리
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ error: "검색어가 없습니다." });
  }

  const apiKey = process.env.RAWG_API_KEY;
  const url = `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(
    query
  )}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json({ results: data.results });
  } catch (err) {
    console.error("❗ 서버리스 오류:", err);
    res.status(500).json({ error: "게임명을 다시 입력해주세요" });
  }
}
