export default function GameDetail({
  selectedGame,
  darkMode,
  handleBack,
  toggleFavorite,
  favorites,
}) {
  return (
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
        {selectedGame.genres?.map((g) => g.name).join(", ") || "정보 없음"}
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
        <strong>게임 상세정보:</strong>
        <div style={{ marginTop: "0.5rem", whiteSpace: "pre-line" }}>
          {selectedGame.nodetail ? (
            <p>이 게임은 상세 정보가 없습니다.</p>
          ) : (
            selectedGame.description_raw
          )}
        </div>
      </div>

      <div style={{ margin: "1rem 0" }}>
        <strong>공식 홈페이지:</strong>{" "}
        {selectedGame.nodetail || selectedGame.nowebsite ? (
          <span style={{ color: darkMode ? "#e0e0e0" : "#222" }}>
            이 게임은 웹사이트가 등록되어 있지 않습니다.
          </span>
        ) : (
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
        )}
      </div>

      <button
        onClick={() => {
          toggleFavorite();
        }}
        
        style={{
          margin: "1rem 0",
          color: darkMode ? "#f1f1f1" : "#1a1a1a",
          backgroundColor: darkMode ? "#444" : "#dcdcdc",
        }}
        className="keyword-button"
      >
        {favorites.some((fav) => fav.id === selectedGame.id)
          ? "★ 즐겨찾기 해제"
          : "☆ 즐겨찾기 추가"}
      </button>
    </div>
  );
}
