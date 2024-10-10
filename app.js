const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cryptoRoutes = require("./routes/cryptoRoutes");
const { startScheduledJobs } = require("./utils/scheduledJobs");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Successfully Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.get("/", (req, res) => {
  res.send(
    `<div style="text-align: center;">
      <h2>Fetching coins data and storing in DB (Subsequent fetch after every 2 hrs).</h2>
      <p>To access the coin status, use the endpoint: <code>/api/stats?coin=coin_name</code></p>
      <p>To access the deviation data, use the endpoint: <code>/api/deviation?coin=coin_name</code></p>
    </div>`
  );
});

app.use(express.json());
app.use("/api", cryptoRoutes);

startScheduledJobs();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
