const { Router } = require("express");
const GraphQLExecutor = require("../graphql/executor");
const { logger } = require("../utils");

const router = Router();

/**
 * @swagger
 * /graphql:
 *   post:
 *     summary: Execute GraphQL query or mutation
 *     tags:
 *       - GraphQL
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *                 example: "query { users(limit: 5) { id name email role } }"
 *     responses:
 *       200:
 *         description: GraphQL response
 */
router.post("/", async (req, res, next) => {
  try {
    const { query, variables } = req.body;

    if (!query) {
      const error = new Error("Query is required");
      error.statusCode = 400;
      error.code = "BAD_REQUEST";
      return next(error);
    }

    logger.info(`GraphQL query: ${query.substring(0, 50)}...`);

    const result = await GraphQLExecutor.execute(query, variables);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
