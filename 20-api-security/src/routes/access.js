const { Router } = require("express");
const JWT = require("../utils/jwt");
const { validarToken, validarAdmin } = require("../middleware/token");
const { log } = require("../utils");

const router = Router();

router.get("/public", (req, res) => {
  log.info("acceso público");
  res.status(200).json({
    data: {
      msg: "ruta pública - sin autenticación",
      access: "open"
    }
  });
});

router.post("/token", (req, res, next) => {
  try {
    const payload = {
      userId: "user-123",
      rol: "user"
    };
    const token = JWT.generate(payload);
    log.info("token generado");
    res.status(200).json({
      data: {
        token,
        msg: "usar en header: Bearer {token}"
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get("/vip", validarToken, (req, res) => {
  log.info("acceso vip otorgado");
  res.status(200).json({
    data: {
      msg: "ruta vip - usuarios registrados",
      access: "vip"
    }
  });
});

router.get("/admin", validarAdmin, (req, res) => {
  log.info("acceso admin otorgado");
  res.status(200).json({
    data: {
      msg: "ruta admin - acceso exclusivo",
      access: "admin"
    }
  });
});

module.exports = router;
