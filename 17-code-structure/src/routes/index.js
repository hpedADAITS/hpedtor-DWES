const { Router } = require("express");

const ping = require("./ping");
const fibonacci = require("./fibonacci");

const router = Router();

router.use("/ping", ping);
router.use("/fibonacci", fibonacci);

module.exports = router;
