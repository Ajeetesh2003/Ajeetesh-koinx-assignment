const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const COINGECKO_API_URL = process.env.COINGECKO_API_URL;

async function getCryptoData(coinId) {
  if (!COINGECKO_API_URL) {
    console.error("COINGECKO_API_URL is not set in the environment variables");
    throw new Error("CoinGecko API URL is not configured");
  }

  const url = `${COINGECKO_API_URL}/coins/${coinId}`;
  console.log(`Requesting URL: ${url}`);

  try {
    console.log(`Fetching data for ${coinId} from CoinGecko...`);
    const response = await axios.get(url);
    const { market_data } = response.data;

    const data = {
      price: market_data.current_price.usd,
      marketCap: market_data.market_cap.usd,
      change24h: market_data.price_change_percentage_24h,
    };

    console.log(`Data received for ${coinId}:`, data);
    return data;
  } catch (error) {
    console.error(`Error fetching data for ${coinId}:`, error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up the request:", error.message);
    }
    throw error;
  }
}

module.exports = { getCryptoData };
