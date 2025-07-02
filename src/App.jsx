import React, { useState } from "react";

function App() {
  const [selectedDistrict, setSelectedDistrict] = useState("none");
  const [selectedType, setSelectedType] = useState("none");
  const [keyword, setKeyword] = useState("");
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isReadyToShow, setIsReadyToShow] = useState(false);

  const handleSearch = async () => {
    let district = selectedDistrict;
    let typeParam = selectedType;

    if (district === "none" && keyword) {
      district = keyword;
    }

    if (district === "none" || district === "") {
      alert("請輸入或選擇行政區");
      setResults([]);
      setSearchTriggered(false);
      return;
    }

    if ((selectedDistrict === "none" && keyword !== "") && selectedType === "none") {
      typeParam = "all";
    }
    if (selectedDistrict !== "none" && selectedType === "none") {
      typeParam = "all";
    }

    setIsLoading(true);
    setIsReadyToShow(false);
    setSearchTriggered(false);

    try {
      const res = await fetch(
        `https://ksrecommend-back.onrender.com/api/restaurants?district=${district}&type=${typeParam}`
      );
      const data = await res.json();
      setResults(data);
      setSearchTriggered(true);
      setIsLoading(false);

      setTimeout(() => {
        alert("查詢完成！請按 OK 查看結果");
        setIsReadyToShow(true);
      }, 300);
    } catch (err) {
      console.error("拉資料失敗:", err);
      alert("資料取得失敗，請稍後再試");
      setResults([]);
      setSearchTriggered(true);
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/foodbg.jpg')",
        colorScheme: "light",
      }}
    >
      {/* 頁首 */}
      <div className="bg-amber-700 text-white py-14 px-8 w-full">
        <h1 className="text-3xl font-bold">高雄呷飽未 🍜</h1>
      </div>

      {/* 搜尋區 */}
      <div className="bg-amber-500 w-full py-6 px-4 flex flex-col md:flex-row md:justify-center items-center gap-4">
        {/* 手動輸入 */}
        <input
          type="text"
          placeholder="可直接輸入行政區查詢，如『苓雅區』，或使用下拉選單"
          className="w-full max-w-xs px-4 py-2 rounded-md text-black bg-white text-center truncate overflow-hidden whitespace-nowrap"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value.trim());
            setSelectedDistrict("none");
          }}
        />

        {/* 行政區選單（帶箭頭） */}
        <div className="relative w-full max-w-xs">
          <select
            value={selectedDistrict}
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              setSelectedType("none");
              setKeyword("");
            }}
            className="w-full px-4 py-2 rounded-md text-center appearance-none bg-white text-black"
          >
            <option value="none">選擇行政區</option>
            <option value="鼓山區">鼓山區</option>
            <option value="左營區">左營區</option>
            <option value="楠梓區">楠梓區</option>
            <option value="三民區">三民區</option>
            <option value="新興區">新興區</option>
            <option value="前金區">前金區</option>
            <option value="苓雅區">苓雅區</option>
            <option value="前鎮區">前鎮區</option>
            <option value="小港區">小港區</option>
            <option value="鳳山區">鳳山區</option>
            <option value="鹽埕區">鹽埕區</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* 菜系選單（帶箭頭） */}
        <div className="relative w-full max-w-xs">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            disabled={selectedDistrict === "none" && keyword === ""}
            className={`w-full px-4 py-2 rounded-md text-center appearance-none ${
              selectedDistrict === "none" && keyword === ""
                ? "text-gray-400 cursor-not-allowed bg-gray-100"
                : "text-black bg-white"
            }`}
          >
            <option value="none">選擇菜系</option>
            <option value="all">全部類型</option>
            <option value="中式">中式</option>
            <option value="日式">日式</option>
            <option value="韓式">韓式</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* 查詢按鈕 */}
        <button
          onClick={handleSearch}
          className="w-full max-w-xs bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-white font-semibold text-center"
        >
          查詢
        </button>
      </div>

      {/* 結果區塊 */}
      <div className="w-full flex-1 px-6 py-10 bg-white bg-opacity-90">
        {isLoading ? (
          <p className="text-center text-gray-600 text-lg font-semibold">
            查詢中，請稍候...
          </p>
        ) : (
          searchTriggered &&
          isReadyToShow && (
            <>
              {results.length === 0 ? (
                <p className="text-gray-700 text-center">
                  找不到符合條件的餐廳
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {results.map((r) => (
                    <div
                      key={r.name}
                      className="bg-white shadow-md rounded-lg overflow-hidden"
                    >
                      {r.image && (
                        <img
                          src={r.image}
                          alt={r.name}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-4 text-left">
                        <a
                          href={r.maps_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg font-bold text-blue-700 hover:underline block"
                        >
                          {r.name}
                        </a>
                        <p className="text-sm text-gray-600 mt-1">
                          {r.district}｜{r.price_range || "未提供"}
                        </p>
                        <p className="text-sm mt-2 text-gray-800">
                          📍 {r.address}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )
        )}
      </div>
    </div>
  );
}

export default App;
