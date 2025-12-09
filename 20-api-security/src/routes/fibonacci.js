const express = require("express");
const ctrl = require("../controllers/fibonacci");
const router = express.Router();

router.get("/calc/:n", ctrl.calc);

module.exports = router;
