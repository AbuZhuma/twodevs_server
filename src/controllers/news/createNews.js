const New = require("../../models/news");
const axios = require("axios"); // Для отправки запросов в Telegram API
require("dotenv").config();

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHANNEL = "@twodevstm";

const createNews = async (req, res) => {
  try {
    const body = req.body;

    if (!body.title || !body.date || !body.author || !body.description || !body.changelog || !body.password) {
      return res.status(400).json({ message: "Please check your fields!" });
    }

    if (process.env.NEWS_PASSWORD !== body.password) {
      return res.status(400).json({ message: "Wrong password!" });
    }
    const telegramMessage = `
🚀 <b>New Blog Post Published!</b> 🚀

<b>📖 Title:</b> ${body.title}
<b>📅 Date:</b> ${body.date}
<b>✍️ Author:</b> ${body.author}

<b>🔍 Overview:</b>
${body.description}

<b>📌 Key Updates:</b>
${body.changelog}

#Blog #Tech #Updates
`;

    const telegramResponse = await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHANNEL,
      text: telegramMessage,
      parse_mode: "HTML",
    });
    body.changelog = body.changelog.split("\n")
    const newNews = new New(body);
    body.messageId = telegramResponse.data.result.message_id
    await newNews.save();
    res.status(200).json({ message: "New created and posted to Telegram!" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = createNews;