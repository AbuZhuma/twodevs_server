const New = require("../../models/news");
require("dotenv").config()

const createNews = async (req, res) => {
      try {
            const body = req.body
            if (!body.title || !body.date || !body.author || !body.description || !body.changelog || !body.password) {
                  return res.status(400).json({ message: "Please check you`r fields!" })
            }
            if (process.env.NEWS_PASSWORD !== body.password) {
                  return res.status(400).json({ message: "Wrong password!" })
            }
            const newNews = new New(body)
            newNews.save()
            res.status(200).json({ message: "New created!" })
      } catch (error) {
            console.log(error);
      }
}
module.exports = createNews