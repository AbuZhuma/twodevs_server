const express = require('express');
const router = express.Router();
const path = require('path'); 
require('dotenv').config();

router.get("/news/:password", async (req, res) => {
      if (req.params.password !== process.env.ADMIN_PASSWORD) {
            res.status(301).json({ message: "Password incorrect!" });
      }
      res.sendFile(path.join(__dirname,"..", "..", 'public', 'admin', 'news.html'));
})
module.exports = router