import React, { useState } from "react";

function App() {
  const [selectedDistrict, setSelectedDistrict] = useState("none");
  const [selectedType, setSelectedType] = useState("none");
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [results, setResults] = useState([]);
  const [alertMsg, setAlertMsg] = useState("");

  const handleSearch = async () => {
    if (selectedDistrict === "none" || selectedType === "none") {
      let msg = "";
      if (selectedDistrict === "none") msg += "請選擇行政區\n";
      if (selectedType === "none") msg += "請選擇菜系";
      setAlertMsg(msg);
      setResults([]);
      setSearchTriggered(false);
      return;
    }

    setAlertMsg("");

    try {
      const res = await fetch(
        `https://ksrecommend-back.onrender.com/api/restaurants?district=${selectedDistrict}&type=${selectedType}`
      );
      const data = await res.json();
      setResults(data);
      setSearchTriggered(true);
    } catch (err) {
      console.error("拉資料失敗:", err);
      setResults([]);
      setSearchTriggered(true);
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
      {/* 頁首深咖啡色 */}
      <div className="bg-amber-700 text-white py-14 px-8 w-full">
        <h1 className="text-3xl font-bold">高雄呷飽未 🍜</h1>
      </div>

      {/* 搜尋區塊 淺咖啡色 */}
      <div className="bg-amber-500 w-full py-6 px-8 flex flex-col items-center md:flex-row md:justify-center gap-4">
        <input
          type="text"
          placeholder="請手動輸入關鍵字(非必填)"
          className="px-4 py-2 rounded-md text-black bg-white"
        />

        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="px-4 py-2 rounded-md text-black bg-white"
        >
          <option value="none">選擇行政區</option>
          <option value="鹽埕區">鹽埕區</option>
          <option value="苓雅區">苓雅區</option>
          <option value="前金區">前金區</option>
          <option value="新興區">新興區</option>
        </select>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-2 rounded-md text-black bg-white"
        >
          <option value="none">選擇菜系</option>
          <option value="all">全部類型</option>
          <option value="中式">中式</option>
          <option value="日式">日式</option>
          <option value="韓式">韓式</option>
        </select>

        <button
          onClick={handleSearch}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-white font-semibold"
        >
          查詢
        </button>
      </div>

      {/* 提示訊息 */}
      {alertMsg && (
        <div className="bg-red-100 text-red-700 px-4 py-2 text-center">
          {alertMsg.split("\n").map((line, idx) => (
            <div key={idx}>{line}</div>
          ))}
        </div>
      )}

      {/* 結果區塊 */}
      <div className="w-full flex-1 px-6 py-10 bg-white bg-opacity-90">
        {searchTriggered && (
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
                      <p className="text-sm mt-2 text-gray-800">📍 {r.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
