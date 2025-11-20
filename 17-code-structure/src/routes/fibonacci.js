const express = require("express");
const controller = require("../controllers/fibonacci");

const router = express.Router();

router.get("/calculate/:n", controller.fibonacci);

module.exports = router;
