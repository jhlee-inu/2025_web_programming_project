import { useEffect } from "react";
import SearchBar from "../components/SearchBar";

const popularKeywords = [
  "Grand Theft Auto: San Andreas",
  "Black Myth: Wukong",
  "palworld",
  "The Witcher 3: Wild Hunt",
  "Portal",
  "FIFA 24",
  "Overwatch",
];
 //첫페이지
export default function FirstPage({
  darkMode,
  showFavorites,
  handleSearch,
  searchInput,
  setSearchInput,
  searchRef,
  error,
  setError
}) {
  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (!savedUsername) {
      const username = prompt("사용자 이름을 입력하세요:");
      localStorage.setItem("username", username?.trim() || "guest");
    }
  }, []);
  return (
    <>
      <div ref={searchRef}></div>
      <h1
        style ={{
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
              error={error}
              setError={setError}
              onSearch={handleSearch}
              darkMode={darkMode}
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
    </>
  );
}
