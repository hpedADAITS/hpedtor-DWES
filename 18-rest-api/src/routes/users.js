const { Router } = require("express");
const userController = require("../controllers/userController");

const router = Router();

router.get("/", userController.getAllUsers);

router.get("/:userId", userController.getUserById);

router.post("/", userController.createUser);

router.patch("/:userId", userController.updateUser);

router.put("/:userId", userController.replaceUser);

router.delete("/:userId", userController.deleteUser);

module.exports = router;
