const New = require("../../models/news");
const axios = require("axios");
require("dotenv").config();

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHANNEL = process.env.TELEGRAM_CHANNEL || "@twodevstm";

const deleteNews = async (req, res) => {
    try {
        const body = req.body;
        if (!body.title) return res.status(400).json({ error: "Please send title!" });
        
        if (process.env.DELETE_PASSWORD !== body.password) {
            return res.status(400).json({ error: "Wrong password!" });
        }

        const post = await New.findOne({ title: body.title });
        if (!post) {
            return res.status(404).json({ error: "Post not found!" });
        }

        if (post.messageId) {
            try {
                await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/deleteMessage`, {
                    chat_id: TELEGRAM_CHANNEL,
                    message_id: Number(post.messageId)
                });
            } catch (tgError) {
                console.error("Telegram delete error:", tgError.response?.data || tgError.message);
            }
        }

        await New.findOneAndDelete({ title: body.title });

        res.status(200).json("Post deleted successfully");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
module.exports = deleteNews;