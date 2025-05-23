import { FaGamepad, FaStar, FaMoon, FaSun } from "react-icons/fa";
export default function Header({
  topRef,
  favoritesRef,
  darkMode,
  setDarkMode,
  setShowFavorites,
  setSelectedGame,
  scrollTo,
  handleFirst,
  useotheruser,
}) {
  return (
    <div>
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
            trans
            style={{ cursor: "pointer" }}
            onClick={() => {
              scrollTo(topRef);
              handleFirst();
            }}
            className="icon"
          />
          <FaStar
            size={24}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setShowFavorites(true);
              setSelectedGame(null);
              scrollTo(favoritesRef);
            }}
            className="icon"
          />
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <span
            style={{
              padding: "5px 5px 0px",
              color: darkMode ? "#f1f1f1" : "#1a1a1a",
            }}
          >
            {localStorage.getItem("username") || "guest"}
          </span>

          <button
            onClick={useotheruser}
            style={{
              color: darkMode ? "#f1f1f1" : "#1a1a1a",
              backgroundColor: darkMode ? "#444" : "#dcdcdc",
            }}
            className="keyword-button"
          >
            유저변경
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: darkMode ? "#f1f1f1" : "#1a1a1a",
            }}
            className="icon"
          >
            {darkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
          </button>
        </div>
      </div>
    </div>
  );
}
