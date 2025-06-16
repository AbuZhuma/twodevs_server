const express = require('express');
const createNews = require('../controllers/news/createNews');
const New = require('../models/news');
const deleteNews = require('../controllers/news/deleteNews');
const router = express.Router();

router.post("/create", createNews)
router.post("/delete", deleteNews)
router.get("/", async (req, res) => {
      let news = await New.find();
      res.status(200).json(news.reverse())
})
module.exports = router