import { useState, useRef, useEffect } from "react";
import { FaGamepad, FaStar, FaMoon, FaSun } from "react-icons/fa";
import SearchBar from "../components/SearchBar";
import GameCard from "../components/GameCard";
import GameDetail from "../components/GameDetail";
import ReviewSection from "../components/ReviewSection";

export default function Home() {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites") || "[]")
  );
  const [darkMode, setDarkMode] = useState(false);

  const topRef = useRef(null);
  const searchRef = useRef(null);
  const favoritesRef = useRef(null);

  const scrollTo = (ref) => ref.current?.scrollIntoView({ behavior: "smooth" });

  const handleSearch = async (query) => {
    try {
      const url = `/api/searchGame?query=${encodeURIComponent(query)}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("API 호출 실패");
      const data = await res.json();
      setGames(data.results || []);
    } catch (err) {
      console.error("❗ API 호출 오류:", err);
      alert("게임 정보를 가져오는 데 실패했습니다.");
    }
  };

  const fetchGameDetail = async (id) => {
    try {
      const res = await fetch(`/api/getGameDetail?id=${id}`);
      const data = await res.json();
      setSelectedGame((prev) => ({ ...prev, ...data })); // 기존 요약 + 상세 덮어쓰기
    } catch (err) {
      console.error("상세정보 불러오기 실패:", err);
    }
  };

  const toggleFavorite = () => {
    let updated;
    if (favorites.some((fav) => fav.id === selectedGame.id)) {
      updated = favorites.filter((fav) => fav.id !== selectedGame.id);
    } else {
      updated = [...favorites, selectedGame];
    }
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  // 초기화면으로 돌아가기: 검색어, 검색 결과, 선택된 게임 모두 초기화
  const handleFirst = () => {
    setSearchInput("");
    setGames([]);
    setSelectedGame(null);
    setShowFavorites(false);
  };

  const handleBack = () => {
    if (selectedGame) {
      setSelectedGame(null);
    } else {
      setGames([]);
    }
  };

  const themeStyle = {
    backgroundColor: darkMode ? "#1e1e1e" : "#f5f7fa",
    color: darkMode ? "#f1f1f1" : "#1a1a1a",
    minHeight: "100vh",
    width: "100%",
    overflowX: "hidden",
    transition: "all 0.3s ease",
    padding: "1rem",
    boxSizing: "border-box",
    margin: "0",
  };

  const popularKeywords = [
    "Grand Theft Auto: San Andreas",
    "Black Myth: Wukong",
    "palworld",
    "The Witcher 3: Wild Hunt",
    "Portal",
    "FIFA 24",
    "Overwatch",
  ];

  // 즐겨찾기 게임 목록을 보여줄지 여부
  const [showFavorites, setShowFavorites] = useState(false);



  useEffect(() => {
    if (selectedGame && !selectedGame.description_raw) {
      fetchGameDetail(selectedGame.id); // 상세 정보 없으면 호출
    }
  }, [selectedGame]);

  return (
    <div style={themeStyle}>
      <div ref={topRef}></div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 0",
        }}
      >
        <div style={{ display: "flex", gap: "1rem" }}>
          <FaGamepad
            size={24}
            style={{ cursor: "pointer" }}
            onClick={() => {
              scrollTo(topRef);
              handleFirst();  
            }}
          />
          <FaStar
            size={24}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setShowFavorites(true);
              setSelectedGame(null);
              scrollTo(favoritesRef);
            }}
          />
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: darkMode ? "#f1f1f1" : "#1a1a1a",
          }}
        >
          {darkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
        </button>
      </div>

      {selectedGame ? (
        <div
          style={{
            alignItems: "flex-start",
          }}
        >
          {/* 게임 상세 */}
          
          <GameDetail
            selectedGame={ selectedGame}
            darkMode = {darkMode}
            handleBack = {handleBack}
            toggleFavorite = {toggleFavorite}
            favorites = {favorites}
          />

            {/* 리뷰 등록/목록: 오른쪽에 배치 */}
          <ReviewSection selectedGame={selectedGame} darkMode={darkMode}/>
          </div>
      ) : (
        <div>
          <div ref={searchRef}></div>
          <h1
            style={{
              textAlign: "center",
              fontSize: "2.5rem",
              color: darkMode ? "#ffffff" : "#1a1a1a",
            }}
          >
            🎮 GameFinder에 오신 것을 환영합니다 🎮
          </h1>
          <p style={{ textAlign: "center", marginTop: "0.5rem" }}>
            원하는 게임을 검색하고 즐겨찾기와 리뷰를 남겨보세요!
          </p>
          {/* 검색창에 입력값 상태 추가 */}
          {!showFavorites && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "1.5rem 0",
                }}
              >
                <SearchBar
                  onSearch={handleSearch}
                  darkMode={darkMode}
                  // 검색어 상태와 setter 전달
                  value={searchInput}
                  setValue={setSearchInput}
                />
              </div>
              <div style={{ textAlign: "center" }}>
                <p> 인기 검색어</p>
                {popularKeywords.map((word) => (
                  <button
                    style={{
                      backgroundColor: darkMode ? "#444" : "#dcdcdc",
                      color: darkMode ? "#f1f1f1" : "#1a1a1a",
                    }}
                    key={word}
                    onClick={() => {
                      setSearchInput(word);
                      handleSearch(word);
                    }}
                    className="keyword-button"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </>
          )}
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
              {(showFavorites ? favorites : games).map((game) => (
                <div key={game.id} onClick={() => setSelectedGame(game)}>
                  <GameCard game={game} />
                </div>
              ))}
              {showFavorites && favorites.length === 0 && (
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
        </div>
      )}
    </div>
  );
}
