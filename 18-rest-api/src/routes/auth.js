const { Router } = require("express");
const JWT = require("../utils/jwt");
const { logger } = require("../utils");

const router = Router();

const DEMO_USER = {
  userId: "demo-user-1",
  email: "admin@example.com",
  role: "admin",
};

const DEMO_PASSWORD = "password123";

router.post("/login", (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error("Email and password are required");
      error.statusCode = 400;
      error.code = "BAD_REQUEST";
      return next(error);
    }

    if (email === DEMO_USER.email && password === DEMO_PASSWORD) {
      const token = JWT.generateToken({
        userId: DEMO_USER.userId,
        email: DEMO_USER.email,
        role: DEMO_USER.role,
      });

      logger.info(`User ${email} logged in successfully`);

      res.status(200).json({
        data: {
          token,
          user: {
            userId: DEMO_USER.userId,
            email: DEMO_USER.email,
            role: DEMO_USER.role,
          },
        },
        message: "Login successful",
      });
    } else {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      error.code = "UNAUTHORIZED";
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
