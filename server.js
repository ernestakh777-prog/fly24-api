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
  const { origin, destination, date } = req.query;

  if (!accessToken) {
    await getToken();
  }

  const url =
    `https://test.api.amadeus.com/v2/shopping/flight-offers` +
    `?originLocationCode=${origin}` +
    `&destinationLocationCode=${destination}` +
    `&departureDate=${date}` +
    `&adults=1&max=5`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  res.json(data);
});

app.get("/airports", async (req, res) => {
  try {
    const keyword = req.query.keyword;

    if (!keyword || keyword.trim().length < 2) {
      return res.json([]);
    }

    const tokenResponse = await fetch(
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

    const tokenData = await tokenResponse.json();

    const response = await fetch(
      `https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY,AIRPORT&keyword=${encodeURIComponent(keyword)}&countryCode=UZ`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    const data = await response.json();

    const formatted = (data.data || [])
  .filter((item) => item.subType === "AIRPORT" && item.address?.countryCode === "UZ")
  .map((item) => ({
    iata: item.iataCode || "",
    name: item.name || "",
    city: item.address?.cityName || "",
    country: item.address?.countryName || "",
    subtype: item.subType || "",
  }));

res.json(formatted);
} catch (error) {
  res.status(500).json({ error: error.message });
}
});
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
