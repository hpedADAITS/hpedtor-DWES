const { Router } = require("express");
const exec = require("../graphql/executor");
const { log } = require("../utils");
const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const { query, variables } = req.body;
    if (!query) {
      const err = new Error("Dame peticion");
      err.statusCode = 400;
      err.code = "bad_request";
      return next(err);
    }
    log.info(`graphql: ${query.substring(0, 40)}`);
    const result = await exec.execute(query, variables);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
