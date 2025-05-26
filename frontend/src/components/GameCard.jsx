export default function GameCard({ game }) { // 게임 카드 컴포넌트
  if (!game) return null; // 게임 정보가 없으면 아무것도 렌더링하지 않음
  return (
    <div className="game-card">
      <img src={game.background_image} alt={game.name} />
      <h3>{game.name}</h3>
      <p>출시일: {game.released}</p>
      <p>평점: {game.rating}</p>
      <p>장르: {game.genres?.map((g) => g.name).join(", ") || "정보 없음"}</p>
    </div>
  );
}
