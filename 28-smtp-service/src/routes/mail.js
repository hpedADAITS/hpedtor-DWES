const { Router } = require("express");
const { sendEmail } = require("../services/mailService");
const { logger } = require("../utils");

const router = Router();

router.post("/send", async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;
    const result = await sendEmail(to, subject, text, html);
    logger.info(`Email sent to ${to}`);
    res.json({ success: true, response: result.response });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
