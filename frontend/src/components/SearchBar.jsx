export default function SearchBar({ onSearch, value, setValue, darkMode }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="게임 이름을 입력하세요"
      />
      <button
        type="submit"
        style={{
          backgroundColor: darkMode ? "#444" : "#dcdcdc",
          color: darkMode ? "#f1f1f1" : "#1a1a1a",
        }}
      >
        검색
      </button>
    </form>
  );
}
