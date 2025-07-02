import React, { useState } from "react";

function App() {
  const [selectedDistrict, setSelectedDistrict] = useState("none");
  const [selectedType, setSelectedType] = useState("none");
  const [selectedPrice, setSelectedPrice] = useState("none");
  const [keyword, setKeyword] = useState("");
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isReadyToShow, setIsReadyToShow] = useState(false);

  const handleSearch = async () => {
    let district = selectedDistrict;
    let typeParam = selectedType;
    let priceParam = selectedPrice;

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
      let query = `https://ksrecommend-back.onrender.com/api/restaurants?district=${district}&type=${typeParam}`;
      if (priceParam !== "none") {
        query += `&price=${priceParam}`;
      }

      const res = await fetch(query);
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
    <div className="min-h-screen w-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: !searchTriggered && !isLoading ? "url('/bg-food.png')" : "none",
        backgroundColor: "red",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* 標題列 */}
      <div style={{ backgroundColor: "#7DA0CA" }} className="text-black py-14 px-8 w-full">
        <h1
          onClick={() => window.location.reload()}
          className="text-3xl font-bold cursor-pointer hover:underline"
          title="點擊重新整理"
        >
          高雄呷飽未 🍜
        </h1>
      </div>

      {/* 查詢區塊 */}
      <div style={{ backgroundColor: "#7DA0CA" }} className="w-full py-6 px-4 flex flex-col md:flex-row md:justify-center items-center gap-4">
        <input
          type="text"
          placeholder="可直接輸入行政區查詢，如『苓雅區』，或使用下拉選單"
          className="w-full max-w-xs px-4 py-2 rounded-md text-black bg-white text-center truncate"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value.trim());
            setSelectedDistrict("none");
          }}
        />

        <select
          value={selectedDistrict}
          onChange={(e) => {
            setSelectedDistrict(e.target.value);
            setSelectedType("none");
            setKeyword("");
          }}
          className="w-full max-w-xs px-4 py-2 rounded-md text-black bg-white text-center"
        >
          <option value="none">選擇行政區</option>
          {["鼓山區", "左營區", "楠梓區", "三民區", "新興區", "前金區", "苓雅區", "前鎮區", "小港區", "鳳山區", "鹽埕區"].map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          disabled={selectedDistrict === "none" && keyword === ""}
          className={`w-full max-w-xs px-4 py-2 rounded-md text-center ${
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
          <option value="美式">美式</option>
          <option value="義式">義式</option>
          <option value="泰式">泰式</option>
          <option value="甜點">甜點</option>
        </select>

        <select
          value={selectedPrice}
          onChange={(e) => setSelectedPrice(e.target.value)}
          disabled={selectedDistrict === "none" && keyword === ""}
          className={`w-full max-w-xs px-4 py-2 rounded-md text-center ${
            selectedDistrict === "none" && keyword === ""
              ? "text-gray-400 cursor-not-allowed bg-gray-100"
              : "text-black bg-white"
          }`}
        >
          <option value="none">選擇價格範圍</option>
          <option value="0-500">NT$0 - 500</option>
          <option value="500-1000">NT$500 - 1000</option>
          <option value="1000-2000">NT$1000 - 2000</option>
          <option value="2000+">NT$2000 以上</option>
        </select>

        <button
          onClick={handleSearch}
          className="w-full max-w-xs font-semibold px-4 py-2 rounded-md"
          style={{ backgroundColor: "#C1E8FF", color: "#000" }}
        >
          查詢
        </button>
      </div>

      {/* 結果區塊 */}
      <div
        className="w-full flex-1 px-6 py-10 bg-white bg-opacity-90 relative"
      >
        {!searchTriggered && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-gray-800 bg-white bg-opacity-80 px-4">
            <h2 className="text-3xl font-bold mb-4">🍜 歡迎來到高雄呷飽未</h2>
            <p className="text-lg mb-2">請輸入行政區與菜系開始查詢</p>
            <p className="text-sm text-gray-500">背景圖片為吉卜力風格插畫</p>
          </div>
        )}

        {isLoading ? (
          <p className="text-center text-gray-600 text-lg font-semibold">查詢中，請稍候...</p>
        ) : (
          searchTriggered &&
          isReadyToShow && (
            <>
              {results.length === 0 ? (
                <p className="text-gray-700 text-center">找不到符合條件的餐廳</p>
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
                        <div className="flex items-center justify-between">
                          <a
                            href={r.maps_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lg font-bold text-blue-700 hover:underline"
                          >
                            {r.name}
                          </a>
                          <div className="flex items-center gap-1 text-yellow-600 text-sm whitespace-nowrap ml-2">
                            <span>⭐</span>
                            <span>{r.rating ? `${r.rating} / 5` : "尚無評分"}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {r.district}｜{r.price_range || "未提供"}
                        </p>
                        <p className="text-sm mt-2 text-gray-800">📍 {r.address}</p>
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
