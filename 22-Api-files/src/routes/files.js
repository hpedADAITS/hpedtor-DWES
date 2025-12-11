const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const config = require("../config");
const fileController = require("../controllers/files");

const router = express.Router();
const filesDir = config.filesDir;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, filesDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
  limits: {
    fileSize: config.multer.fileSize,
  },
});

router.post("/subir", upload.single("file"), fileController.uploadSingle);
router.post(
  "/subir-multiples",
  upload.array("files", config.multer.maxFiles),
  fileController.uploadMultiple
);
router.get("/descargar/:filename", fileController.download);
router.get("/archivos", fileController.listFiles);
router.post("/descargar-multiples", fileController.downloadMultiple);
router.delete("/eliminar/:filename", fileController.deleteFile);

module.exports = router;
