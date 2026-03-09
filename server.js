const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

const CLIENT_ID = process.env.AMADEUS_CLIENT_ID;
const CLIENT_SECRET = process.env.AMADEUS_CLIENT_SECRET;

let accessToken = null;

async function getToken() {
  const response = await fetch(
    "https://test.api.amadeus.com/v1/security/oauth2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        CLIENT_ID +
        "&client_secret=" +
        CLIENT_SECRET,
    }
  );

  const data = await response.json();
  accessToken = data.access_token;
}

app.get("/flights", async (req, res) => {
  try {
    const { origin, destination, date, returnDate, adults } = req.query;

    if (!origin || !destination || !date) {
      return res.status(400).json({ error: "origin, destination, date are required" });
    }

    if (!accessToken) {
      await getToken();
    }

    let url =
      `https://test.api.amadeus.com/v2/shopping/flight-offers` +
      `?originLocationCode=${origin}` +
      `&destinationLocationCode=${destination}` +
      `&departureDate=${date}` +
      `&adults=${adults || 1}` +
      `&max=12`;

    if (returnDate) {
      url += `&returnDate=${returnDate}`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
const AIRPORTS = [
  {
    iata: "TAS",
    city_en: "Tashkent",
    city_ru: "Ташкент",
    name_en: "Tashkent International Airport",
    name_ru: "Международный аэропорт Ташкент",
    country_en: "Uzbekistan",
    country_ru: "Узбекистан"
  },
  {
    iata: "SKD",
    city_en: "Samarkand",
    city_ru: "Самарканд",
    name_en: "Samarkand International Airport",
    name_ru: "Международный аэропорт Самарканд",
    country_en: "Uzbekistan",
    country_ru: "Узбекистан"
  },
  {
    iata: "BHK",
    city_en: "Bukhara",
    city_ru: "Бухара",
    name_en: "Bukhara International Airport",
    name_ru: "Международный аэропорт Бухара",
    country_en: "Uzbekistan",
    country_ru: "Узбекистан"
  },
  {
    iata: "UGC",
    city_en: "Urgench",
    city_ru: "Ургенч",
    name_en: "Urgench International Airport",
    name_ru: "Международный аэропорт Ургенч",
    country_en: "Uzbekistan",
    country_ru: "Узбекистан"
  },
  {
    iata: "FEG",
    city_en: "Fergana",
    city_ru: "Фергана",
    name_en: "Fergana International Airport",
    name_ru: "Международный аэропорт Фергана",
    country_en: "Uzbekistan",
    country_ru: "Узбекистан"
  },
  {
    iata: "NMA",
    city_en: "Namangan",
    city_ru: "Наманган",
    name_en: "Namangan Airport",
    name_ru: "Аэропорт Наманган",
    country_en: "Uzbekistan",
    country_ru: "Узбекистан"
  },
  {
    iata: "AZN",
    city_en: "Andijan",
    city_ru: "Андижан",
    name_en: "Andijan Airport",
    name_ru: "Аэропорт Андижан",
    country_en: "Uzbekistan",
    country_ru: "Узбекистан"
  },
  {
    iata: "NVI",
    city_en: "Navoi",
    city_ru: "Навои",
    name_en: "Navoi Airport",
    name_ru: "Аэропорт Навои",
    country_en: "Uzbekistan",
    country_ru: "Узбекистан"
  },
  {
    iata: "IST",
    city_en: "Istanbul",
    city_ru: "Стамбул",
    name_en: "Istanbul Airport",
    name_ru: "Аэропорт Стамбул",
    country_en: "Turkey",
    country_ru: "Турция"
  },
  {
    iata: "SAW",
    city_en: "Istanbul",
    city_ru: "Стамбул",
    name_en: "Sabiha Gokcen Airport",
    name_ru: "Аэропорт Сабиха Гёкчен",
    country_en: "Turkey",
    country_ru: "Турция"
  },
  {
    iata: "AYT",
    city_en: "Antalya",
    city_ru: "Анталья",
    name_en: "Antalya Airport",
    name_ru: "Аэропорт Анталья",
    country_en: "Turkey",
    country_ru: "Турция"
  },
  {
    iata: "DXB",
    city_en: "Dubai",
    city_ru: "Дубай",
    name_en: "Dubai International Airport",
    name_ru: "Международный аэропорт Дубай",
    country_en: "UAE",
    country_ru: "ОАЭ"
  },
  {
    iata: "SHJ",
    city_en: "Sharjah",
    city_ru: "Шарджа",
    name_en: "Sharjah Airport",
    name_ru: "Аэропорт Шарджа",
    country_en: "UAE",
    country_ru: "ОАЭ"
  },
  {
    iata: "AUH",
    city_en: "Abu Dhabi",
    city_ru: "Абу-Даби",
    name_en: "Abu Dhabi Airport",
    name_ru: "Аэропорт Абу-Даби",
    country_en: "UAE",
    country_ru: "ОАЭ"
  },
  {
    iata: "ALA",
    city_en: "Almaty",
    city_ru: "Алматы",
    name_en: "Almaty Airport",
    name_ru: "Аэропорт Алматы",
    country_en: "Kazakhstan",
    country_ru: "Казахстан"
  },
  {
    iata: "NQZ",
    city_en: "Astana",
    city_ru: "Астана",
    name_en: "Astana Airport",
    name_ru: "Аэропорт Астана",
    country_en: "Kazakhstan",
    country_ru: "Казахстан"
  },
  {
    iata: "FRU",
    city_en: "Bishkek",
    city_ru: "Бишкек",
    name_en: "Bishkek Airport",
    name_ru: "Аэропорт Бишкек",
    country_en: "Kyrgyzstan",
    country_ru: "Кыргызстан"
  },
  {
    iata: "DME",
    city_en: "Moscow",
    city_ru: "Москва",
    name_en: "Domodedovo Airport",
    name_ru: "Аэропорт Домодедово",
    country_en: "Russia",
    country_ru: "Россия"
  },
  {
    iata: "SVO",
    city_en: "Moscow",
    city_ru: "Москва",
    name_en: "Sheremetyevo Airport",
    name_ru: "Аэропорт Шереметьево",
    country_en: "Russia",
    country_ru: "Россия"
  },
  {
    iata: "VKO",
    city_en: "Moscow",
    city_ru: "Москва",
    name_en: "Vnukovo Airport",
    name_ru: "Аэропорт Внуково",
    country_en: "Russia",
    country_ru: "Россия"
  },
  {
    iata: "LED",
    city_en: "Saint Petersburg",
    city_ru: "Санкт-Петербург",
    name_en: "Pulkovo Airport",
    name_ru: "Аэропорт Пулково",
    country_en: "Russia",
    country_ru: "Россия"
  }
];
app.get("/airports", async (req, res) => {
  const keyword = (req.query.keyword || "").trim().toLowerCase();
  const lang = (req.query.lang || "ru").toLowerCase();

  if (!keyword || keyword.length < 2) {
    return res.json([]);
  }

  const results = AIRPORTS
    .filter((item) => {
      const haystack = `
        ${item.iata}
        ${item.city_en}
        ${item.city_ru}
        ${item.name_en}
        ${item.name_ru}
        ${item.country_en}
        ${item.country_ru}
      `.toLowerCase();

      return haystack.includes(keyword);
    })
    .slice(0, 8)
    .map((item) => ({
      iata: item.iata,
      name: lang === "en"
        ? `${item.city_en} (${item.iata})`
        : `${item.city_ru} (${item.iata})`,
      city: lang === "en" ? item.city_en : item.city_ru,
      country: lang === "en" ? item.country_en : item.country_ru,
      airport: lang === "en" ? item.name_en : item.name_ru
    }));

  res.json(results);
});
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
