const express = require('express');
const Fb = require('../models/feadback');
const { default: axios } = require('axios');
const router = express.Router();
require('dotenv').config();

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHANNEL = process.env.TELEGRAM_CHANNEL;

router.post("/", async (req, res) => {
  try {
    if (!req.body.text || !req.body.email) {
      return res.status(400).json({ message: "Text and email are required!" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email)) {
      return res.status(400).json({ message: "Invalid email!" });
    }

    const date = new Date();
    const newFb = new Fb({
      text: req.body.text,
      email: req.body.email,
      date: date
    });

    await newFb.save();

    const telegramMessage = `
    📢 <b>New Feedback Received!</b>  

    📅 <b>Date:</b> ${date.toLocaleString()}  
    📧 <b>From:</b> ${req.body.email}  

    💬 <b>Message:</b>  
    ${req.body.text}  

    #Feedback #UserReview
    `;

    await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHANNEL,
      text: telegramMessage,
      parse_mode: "HTML",
    });

    res.status(200).json({ message: "Feedback sent successfully!" });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const all = await Fb.find().sort({ date: -1 }); 
    res.status(200).json(all);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;