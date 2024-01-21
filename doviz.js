const fetch = require("node-fetch");
const fs = require("fs");

const apiUrl = "https://net.uptrical.xyz/api/doviz";
const updateInterval = 10000; // 10 saniye

async function fetchData() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`API'ye istek yapılırken bir hata oluştu. HTTP Hata Kodu: ${response.status}`);
    }

    const data = await response.json();
    updateDovizJson(data);
  } catch (error) {
    console.error("Döviz bilgileri güncellenirken bir hata oluştu:", error.message);
  } finally {
    setTimeout(fetchData, updateInterval);
  }
}
console.log("calısıyorum amigo");
function updateDovizJson(dovizData) {
  const filePath = "./doviz.json";

  try {
    fs.writeFileSync(filePath, JSON.stringify(dovizData, null, 2));
    console.log("Döviz bilgileri başarıyla güncellendi.");
  } catch (error) {
    console.error("Döviz bilgileri güncellenirken bir hata oluştu:", error.message);
  }
}

// İlk çalıştırmayı yap
fetchData();
