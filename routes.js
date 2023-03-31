const express = require("express");
const { postWebhook, getWebhook } = require("./webhook");

const router = express.Router();

router.get("/webhook", getWebhook);
router.post("/webhook", postWebhook);

module.exports = router;
