const Cryptocurrency = require("../models/Cryptocurrency");

async function getStats(req, res) {
  try {
    const { coin } = req.query;
    const latestData = await Cryptocurrency.findOne({ coin }).sort({
      timestamp: -1,
    });

    if (!latestData) {
      return res
        .status(404)
        .json({ error: "Data not found for the specified coin" });
    }

    res.json({
      price: latestData.price,
      marketCap: latestData.marketCap,
      "24hChange": latestData.change24h,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getDeviation(req, res) {
  try {
    const { coin } = req.query;
    const data = await Cryptocurrency.find({ coin })
      .sort({ timestamp: -1 })
      .limit(100);

    if (data.length === 0) {
      return res
        .status(404)
        .json({ error: "No data found for the specified coin" });
    }

    const prices = data.map((entry) => entry.price);
    const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const squaredDifferences = prices.map((price) => Math.pow(price - mean, 2));
    const variance =
      squaredDifferences.reduce((sum, diff) => sum + diff, 0) / prices.length;
    const deviation = Math.sqrt(variance);

    res.json({ deviation });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { getStats, getDeviation };
