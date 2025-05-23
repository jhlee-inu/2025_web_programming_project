import { useState, useRef, useEffect } from "react";
import { FaGamepad, FaStar, FaMoon, FaSun } from "react-icons/fa";
import SearchBar from "../components/SearchBar";
import GameCard from "../components/GameCard";

export default function Home() {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites") || "[]")
  );
  const [review, setReview] = useState("");
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

  // 리뷰 저장: localStorage에 { [gameId]: [리뷰, ...] } 형태로 저장
  const saveReview = (gameId, reviewText) => {
    const reviews = JSON.parse(localStorage.getItem("reviews") || "{}");
    if (!reviews[gameId]) reviews[gameId] = [];
    reviews[gameId].push(reviewText);
    localStorage.setItem("reviews", JSON.stringify(reviews));
  };

  // 특정 게임의 리뷰 목록 가져오기
  const getReviews = (gameId) => {
    const reviews = JSON.parse(localStorage.getItem("reviews") || "{}");
    return reviews[gameId] || [];
  };

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
          <div
            style={{
              padding: "3rem",
              backgroundColor: darkMode ? "#2b2b2b" : "#fff",
              borderRadius: "12px",
              position: "relative",
              minWidth: "750px",
            }}
          >
            <button
              onClick={handleBack}
              style={{
                background: "transparent",
                border: "none",
                position: "absolute",
                top: "3px",
                left: "5px",
                fontSize: "1.5rem",
                cursor: "pointer",
                color: darkMode ? "#fff" : "#000",
              }}
            >
              ✖
            </button>
            {selectedGame.short_screenshots?.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  overflowX: "auto",
                  paddingBottom: "1rem",
                }}
              >
                {selectedGame.short_screenshots.map((s, idx) => (
                  <img
                    key={idx}
                    src={s.image}
                    alt={`screenshot-${idx}`}
                    style={{
                      width: "400px",
                      height: "170px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      flexShrink: 0,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                ))}
              </div>
            ) : (
              <img
                src={selectedGame.background_image}
                alt={selectedGame.name}
                style={{
                  width: "650px",
                  height: "370px",
                  borderRadius: "12px",
                  marginBottom: "1px",
                }}
              />
            )}

            <h2>{selectedGame.name}</h2>
            <p>
              <strong>출시일:</strong> {selectedGame.released}
            </p>
            <p>
              <strong>평점:</strong> ⭐ {selectedGame.rating} / 5
            </p>
            <p>
              <strong>평점 수:</strong> {selectedGame.ratings_count}
            </p>
            <p>
              <strong>장르:</strong>{" "}
              {selectedGame.genres?.map((g) => g.name).join(", ") ||
                "정보 없음"}
            </p>
            <p>
              <strong>플랫폼:</strong>{" "}
              {selectedGame.platforms && selectedGame.platforms.length > 0 ? (
                <>
                  {selectedGame.platforms
                    .slice(0, 6)
                    .map((p) => p.platform.name)
                    .join(", ")}
                  {selectedGame.platforms.length > 6 && (
                    <>
                      <br />
                      {selectedGame.platforms
                        .slice(6)
                        .map((p) => p.platform.name)
                        .join(", ")}
                    </>
                  )}
                </>
              ) : (
                "정보 없음"
              )}
            </p>
            {selectedGame.description_raw && (
              <div
                style={{
                  margin: "1.5rem 0",
                  background: darkMode ? "#232323" : "#f7f7f7",
                  borderRadius: "8px",
                  padding: "1rem 1.5rem",
                  fontSize: "1.08rem",
                  lineHeight: 1.6,
                  color: darkMode ? "#e0e0e0" : "#222",
                }}
              >
                <strong>게임 줄거리:</strong>
                <div style={{ marginTop: "0.5rem", whiteSpace: "pre-line" }}>
                  {selectedGame.description_raw}
                </div>
              </div>
            )}
            {selectedGame.website && (
              <div style={{ margin: "1rem 0" }}>
                <strong>공식 홈페이지:</strong>{" "}
                <a
                  href={selectedGame.website}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: darkMode ? "#7ecfff" : "#0077cc",
                    textDecoration: "underline",
                    wordBreak: "break-all",
                  }}
                >
                  {selectedGame.website}
                </a>
              </div>
            )}

            <button onClick={toggleFavorite} style={{ margin: "1rem 0" }}>
              {favorites.some((fav) => fav.id === selectedGame.id)
                ? "★ 즐겨찾기 해제"
                : "☆ 즐겨찾기 추가"}
            </button>
          </div>
          {/* 리뷰 등록/목록: 오른쪽에 배치 */}
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            {/* 리뷰 등록창 */}
            <div
              style={{
                background: darkMode ? "#232323" : "#f9f9f9",
                borderRadius: "12px",
                padding: "1.5rem",
                boxShadow: darkMode
                  ? "0 2px 8px rgba(0,0,0,0.5)"
                  : "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <h3 style={{ marginTop: 0 }}>리뷰 등록</h3>
              <textarea
                placeholder="리뷰를 작성하세요"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                style={{
                  width: "100%",
                  height: "80px",
                  padding: "5px",
                  margin: "0px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  background: darkMode ? "#222" : "#fff",
                  color: darkMode ? "#f1f1f1" : "#1a1a1a",
                }}
              />
              <button
                onClick={() => {
                  if (review.trim()) {
                    saveReview(selectedGame.id, review.trim());
                    setReview("");
                  }
                }}
                style={{
                  marginTop: "10px",
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: darkMode ? "#444" : "#dcdcdc",
                  color: darkMode ? "#f1f1f1" : "#1a1a1a",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                리뷰 제출
              </button>
            </div>
            {/* 리뷰 목록 */}
            <div
              style={{
                background: darkMode ? "#232323" : "#f9f9f9",
                borderRadius: "12px",
                padding: "1.5rem",
                marginBottom: "1.5rem",
                boxShadow: darkMode
                  ? "0 2px 8px rgba(0,0,0,0.5)"
                  : "0 2px 8px rgba(0,0,0,0.08)",
                flex: 1,
                overflowY: "auto",
                maxHeight: "350px",
              }}
            >
              <h3 style={{ marginTop: 0 }}>리뷰</h3>
              {getReviews(selectedGame.id).length === 0 ? (
                <p style={{ color: "#888" }}>아직 리뷰가 없습니다.</p>
              ) : (
                getReviews(selectedGame.id).map((r, i) => (
                  <div
                    key={i}
                    style={{
                      background: darkMode ? "#333" : "#fff",
                      borderRadius: "8px",
                      padding: "0.5rem 1rem",
                      marginBottom: "0.5rem",
                      fontSize: "0.98rem",
                    }}
                  >
                    {r}
                  </div>
                ))
              )}
            </div>
          </div>
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
