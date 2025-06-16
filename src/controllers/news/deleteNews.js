const New = require("../../models/news");
require("dotenv").config();

const deleteNews = async (req, res) => {
      try {
            const body = req.body
            if (!body.title) return res.status(400).json({ message: "Please send title!" })
            if (process.env.DELETE_PASSWORD !== body.password) {
                  return res.status(400).json({ message: "Wrong password!" });
            }
            await New.findOneAndDelete({ title: body.title })
            res.status(200).json("Deleted!")
      } catch (error) {
            console.log(error);
      }
}
module.exports = deleteNews