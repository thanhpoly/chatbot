const express = require("express");
const {
  postWebhook,
  getWebhook,
  profile,
  getMessage,
  setupPersistentMenu,
} = require("./webhook");

const router = express.Router();
router.get("/", (req, res) => {
  return res.render("homepage.ejs");
});
router.get("/webhook", getWebhook);
router.post("/webhook", postWebhook);
router.post("/profile", profile);
router.post("/message", getMessage);
router.post("/setup-persistent-menu", setupPersistentMenu);

module.exports = router;
