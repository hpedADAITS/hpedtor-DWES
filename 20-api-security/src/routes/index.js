const { Router } = require("express");
const ping = require("./ping");
const fib = require("./fibonacci");
const users = require("./users");
const auth = require("./auth");
const gql = require("./graphql");
const acceso = require("./access");
const { authenticate } = require("../middleware/auth");

const router = Router();

router.use("/auth", auth);
router.use("/ping", ping);
router.use("/fibonacci", fib);
router.use("/graphql", gql);
router.use("/users", authenticate, users);
router.use("/access", acceso);

module.exports = router;
