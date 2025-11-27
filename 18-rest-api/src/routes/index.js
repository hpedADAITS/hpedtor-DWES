const { Router } = require("express");

const ping = require("./ping");
const fibonacci = require("./fibonacci");
const users = require("./users");
const auth = require("./auth");
const graphql = require("./graphql");
const { authenticateToken } = require("../middleware/auth");

const router = Router();

router.use("/auth", auth);
router.use("/ping", ping);
router.use("/fibonacci", fibonacci);
router.use("/graphql", graphql);

router.use("/users", authenticateToken, users);

module.exports = router;
