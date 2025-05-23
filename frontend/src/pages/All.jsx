import { useState, useRef, useEffect } from "react";
import GameDetail from "../components/GameDetail";
import ReviewSection from "../components/ReviewSection";
import FirstPage from "./Firstpage";
import Header from "../components/header";
import Favorites from "./Favorites";

export default function All() {
  const [games, setGames] = useState([]); //게임정보 받기
  const [selectedGame, setSelectedGame] = useState(null); //게임선택했는지 안했는지
  const [searchInput, setSearchInput] = useState(""); //값 입력했는지 안했는지
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites") || "[]") //즐겨찾기
  );

  const [darkMode, setDarkMode] = useState(false); //다크모드

  const topRef = useRef(null);
  const searchRef = useRef(null);
  const favoritesRef = useRef(null);

  const scrollTo = (ref) => ref.current?.scrollIntoView({ behavior: "smooth" }); //스크롤

  const handleSearch = async (query) => {
    try {
      const url = `/api/searchGame?query=${encodeURIComponent(query)}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("API 호출 실패");
      const data = await res.json();
      if (!data.results || data.results.length === 0) {
        setGames([]);
        setError("검색 결과가 없습니다. 다시 입력해주세요");
      } else {
        setGames(data.results);
        setError(null);
      }
    } catch (err) {
      console.error("❗ API 호출 오류:", err);
      setError("게임 정보를 가져오는 데 실패했습니다.");
      setGames([]);
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

  const useotheruser = () => {
    const newUsername = prompt("사용할 다른 사용자를 입력하세요:");
    if (newUsername?.trim()) {
      localStorage.setItem("username", newUsername.trim());
      window.location.reload(); // 다른 사용자이름을 사용할려면,
    }
  };

  const toggleFavorite = () => {
    //즐겨찾기 업데이트
    const username = localStorage.getItem("username") || "guest";
    const stored = JSON.parse(
      localStorage.getItem(`favorites_${username}`) || "[]"
    );

    let updated;
    if (stored.some((fav) => fav.id === selectedGame.id)) {
      updated = stored.filter((fav) => fav.id !== selectedGame.id);
    } else {
      updated = [...stored, selectedGame];
    }

    localStorage.setItem(`favorites_${username}`, JSON.stringify(updated));
    setFavorites(updated); // 상태도 반영
  };

  // 초기화면으로 돌아가기: 검색어, 검색 결과, 선택된 게임 모두 초기화
  const handleFirst = () => {
    setSearchInput("");
    setGames([]);
    setSelectedGame(null);
    setShowFavorites(false);
  };

  const handleBack = () => {
    //바로 뒤로 돌아가기. 게임 선택시 x버튼에 적용
    if (selectedGame) {
      setSelectedGame(null);
    }
  };
  // 즐겨찾기 게임 목록을 보여줄지 여부
  const [showFavorites, setShowFavorites] = useState(false);

  const themeStyle = {
    //전체 테마 스타일 다크모드 구현
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

  useEffect(() => {
    //게임상세정보중 웹사이트와 줄거리는 id를 통해 받아옴 그래서 따로 상세정보가 없다면 id 불러오는 서버리스 함수 호출
    if (selectedGame && !selectedGame.description_raw) {
      fetchGameDetail(selectedGame.id); // 상세 정보 없으면 호출
    }
  }, [selectedGame]);

  return (
    <div style={themeStyle}>
      <Header
        topRef={topRef}
        favoritesRef={favoritesRef}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        setShowFavorites={setShowFavorites}
        setSelectedGame={setSelectedGame}
        scrollTo={scrollTo}
        handleFirst={handleFirst}
        useotheruser={useotheruser}
      />

      {selectedGame ? ( //게임이 선택되었다면?
        <div
          style={{
            alignItems: "flex-start",
          }}
        >
          {/* 게임 상세 */}
          <GameDetail
            selectedGame={selectedGame}
            darkMode={darkMode}
            handleBack={handleBack}
            toggleFavorite={toggleFavorite}
            favorites={favorites}
          />
          {/* 리뷰 등록/목록: 밑에 배치 */}
          <ReviewSection selectedGame={selectedGame} darkMode={darkMode} />
        </div>
      ) : (
        <div>
          {/* 첫화면  */}
          <FirstPage // 첫페이지
            error={error}
            setError={setError}
            darkMode={darkMode}
            showFavorites={showFavorites}
            handleSearch={handleSearch}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            searchRef={searchRef}
          />
          <Favorites // 즐겨찾기페이지
            games={games}
            favorites={favorites}
            showFavorites={showFavorites}
            setSelectedGame={setSelectedGame}
            favoritesRef={favoritesRef}
            darkMode={darkMode}
          />
        </div>
      )}
    </div>
  );
}
