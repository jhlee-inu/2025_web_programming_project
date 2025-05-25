import React, { useState, useEffect } from "react";

export default function ReviewSection({ selectedGame, darkMode }) {
  const [username, setUsername] = useState("");
  const [review, setReview] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("username");
    if (stored) setUsername(stored);
  }, []);

  // 리뷰 저장
  const saveReview = (gameId, username, reviewText) => {
    const reviews = JSON.parse(localStorage.getItem("reviews") || "{}");
    if (!reviews[gameId]) reviews[gameId] = [];
    reviews[gameId].push({ user: username, text: reviewText });
    localStorage.setItem("reviews", JSON.stringify(reviews));
  };

  // 리뷰 삭제
  const deleteReview = (gameId, index) => {
    const reviews = JSON.parse(localStorage.getItem("reviews") || "{}");
    if (!reviews[gameId]) return;
    reviews[gameId].splice(index, 1);
    localStorage.setItem("reviews", JSON.stringify(reviews));
    // 강제 리렌더링 위해 상태 업데이트
    setReview((r) => r + " ");
    setReview((r) => r.trim());
  };

  const getReviews = (gameId) => {
    const reviews = JSON.parse(localStorage.getItem("reviews") || "{}");
    return reviews[gameId] || [];
  };

  return (
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
            if (review.trim() && username.trim()) {
              saveReview(selectedGame.id, username, review.trim());
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
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>
                <strong>{r.user}:</strong> {r.text}
              </span>
              {r.user === username && (
                <button
                  onClick={() => {
                    deleteReview(selectedGame.id, i);
                    alert("리뷰가 삭제되었습니다.");
                  }}
                  style={{
                    marginLeft: "1rem",
                    background: "transparent",
                    border: "none",
                    color: "red",
                    cursor: "pointer",
                  }}
                >
                  삭제
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
