const http = require('http');
const express = require("express");
const news = require("./routes/news")
const fb = require("./routes/feadbacks")
const admin = require("./routes/admin")

const cors = require("cors")
const { default: helmet } = require('helmet');
const { default: rateLimit } = require('express-rate-limit');
const { default: mongoose } = require('mongoose');
const path = require('path');
require("dotenv").config()

const app = express()
const server = http.createServer(app);
const PORT = process.env.PORT

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  keyGenerator: (req, res) => req.clientIp,
});
app.use(limiter);
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use("/static", express.static(path.join(__dirname, '../public')));
app.use("/api/news", news)
app.use("/api/feabdacks", fb)
app.use("/api/admin", admin)

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

server.listen(PORT, () => {
  console.log('🚀 Server running on ' + PORT + " port");
});

process.on('SIGINT', () => {
  server.close();
  process.exit();
});