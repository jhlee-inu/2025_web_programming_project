export default function SearchBar({ error,setError,onSearch, value, setValue, darkMode }) {

  const handleSubmit = (e) => {
    e.preventDefault(); //오류제어 폼 미제출 방지
    if (value.trim()) {
      setError("");
      onSearch(value);
    } else {
      setError("아무것도 입력하지않았습니다!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (error) setError("");
        }}
        placeholder="찾으시는 게임이 있나요?"
      />
      <button
        type="submit"
        style={{
          backgroundColor: darkMode ? "#444" : "#dcdcdc",
          color: darkMode ? "#f1f1f1" : "#1a1a1a",
          textAlign: "center",
        }}
      >
        검색
      </button>
      {error && (
        <div style={{ color: "red", marginTop: "8px" }}>{error}</div>
      )}
    </form>
  );
}
