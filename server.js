const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = 3000;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

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

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
