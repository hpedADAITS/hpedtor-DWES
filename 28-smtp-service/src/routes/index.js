const { Router } = require("express");
const mail = require("./mail");
const router = Router();

router.use("/mail", mail);

module.exports = router;
