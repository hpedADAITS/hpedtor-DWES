const express = require("express");
const fileRoutes = require("./files");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

router.use("/api", fileRoutes);

module.exports = router;
