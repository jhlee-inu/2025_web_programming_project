import GameCard from "../components/GameCard";

export default function Favorites({
  games,
  showFavorites,
  favorites, //all에서 favorites로 관리하는 즐겨찾기 상태태
  setSelectedGame,
  favoritesRef,
  darkMode,
}) {  
  const displayedGames = showFavorites ? favorites : games; //favorites상태 그대로받음음

  return (
    <div
      ref={favoritesRef}
      style={{
        marginTop: "2rem",
        backgroundColor: darkMode ? "#2b2b2b" : "#fff",
      }}
    >
      <div
        style={{
          display: "grid",
          gap: "20px",
          gridTemplateColumns: "repeat(4,1fr)",
        }}
      >
        {displayedGames.map((game) => (
          <div key={game.id} onClick={() => setSelectedGame(game)}>
            <GameCard game={game} />
          </div>
        ))}
        {showFavorites && favorites.length === 0 && ( //상태그대로 받음 
          <div
            style={{
              gridColumn: "1/-1",
              textAlign: "center",
              color: "#888",
            }}
          >
            즐겨찾기한 게임이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
