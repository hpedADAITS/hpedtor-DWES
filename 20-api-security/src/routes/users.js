const { Router } = require("express");
const ctrl = require("../controllers/userController");
const router = Router();

router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);
router.post("/", ctrl.create);
router.patch("/:id", ctrl.update);
router.put("/:id", ctrl.replace);
router.delete("/:id", ctrl.del);

module.exports = router;
