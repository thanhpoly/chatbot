const express = require("express");
const { postWebhook, getWebhook, profile } = require("./webhook");

const router = express.Router();
router.get("/", (req, res) => {
  return res.render("homepage.ejs");
});
router.get("/webhook", getWebhook);
router.post("/webhook", postWebhook);
router.post("/profile", profile);

module.exports = router;
