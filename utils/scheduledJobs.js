const cron = require("node-cron");
const dotenv = require("dotenv");
const { getCryptoData } = require("../services/coingeckoService");
const Cryptocurrency = require("../models/Cryptocurrency");

dotenv.config();

const coins = ["bitcoin", "matic-network", "ethereum"];

async function updateCryptoData() {
  console.log("Starting updateCryptoData job...");
  for (const coin of coins) {
    try {
      console.log(`Fetching data for ${coin}...`);
      const data = await getCryptoData(coin);
      console.log(`Data fetched for ${coin}:`, data);

      const newCrypto = await Cryptocurrency.create({
        coin,
        price: data.price,
        marketCap: data.marketCap,
        change24h: data.change24h,
      });
      console.log(`Saved data for ${coin}:`, newCrypto);
    } catch (error) {
      console.error(`Error updating data for ${coin}:`, error.message);
    }
  }
  console.log("Finished updateCryptoData job");
}

function startScheduledJobs() {
  console.log("Starting scheduled jobs...");
  console.log("CoinGecko API URL:", process.env.COINGECKO_API_URL);
  // Run every 2 hours
  cron.schedule("0 */2 * * *", updateCryptoData);

  // For testing
  updateCryptoData();
}

module.exports = { startScheduledJobs };
