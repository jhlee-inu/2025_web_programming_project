import { useEffect, useState } from "react";
import GameCard from "../components/GameCard";

export default function Favorites({
  games,
  showFavorites,
  setSelectedGame,
  favoritesRef,
  darkMode,
}) {
  const [userFavorites, setUserFavorites] = useState([]);

  useEffect(() => {
    const username = localStorage.getItem("username") || "guest";
    const saved = JSON.parse(
      localStorage.getItem(`favorites_${username}`) || "[]"
    );
    setUserFavorites(saved);
  }, [showFavorites]);

  const displayedGames = showFavorites ? userFavorites : games;

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
        {showFavorites && userFavorites.length === 0 && (
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
