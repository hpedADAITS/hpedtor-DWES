const { Router } = require("express");
const JWT = require("../utils/jwt");
const { log } = require("../utils");
const router = Router();

const DEMO_USER = {
  id: "user-1",
  email: "admin@example.com",
  role: "admin",
};

const DEMO_PASS = "contrasenya123";

router.post("/login", (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      const err = new Error("Se necesita email y password");
      err.statusCode = 400;
      err.code = "bad_request";
      return next(err);
    }

    if (email === DEMO_USER.email && password === DEMO_PASS) {
      const token = JWT.generate({
        id: DEMO_USER.id,
        email: DEMO_USER.email,
        role: DEMO_USER.role,
      });
      log.info(`login: ${email}`);
      res.status(200).json({
        data: { token, user: DEMO_USER },
        message: "login successful",
      });
    } else {
      const err = new Error("Credenciales no validas y/o incorrectas");
      err.statusCode = 401;
      err.code = "unauthorized";
      next(err);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
