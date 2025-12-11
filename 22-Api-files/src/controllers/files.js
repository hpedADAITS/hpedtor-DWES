const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const config = require("../config");
const { paginationItems } = require("../utils");

const filesDir = config.filesDir;

const uploadSingle = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "sin archivo" });
  }

  res.json({
    message: "subido ok",
    file: {
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      path: `/api/descargar/${req.file.filename}`,
    },
  });
};

const uploadMultiple = (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "sin archivos" });
  }

  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const file = req.files[i];
    const fileObj = {
      originalName: file.originalname,
      filename: file.filename,
      size: file.size,
      downloadPath: `/api/descargar/${file.filename}`,
    };
    uploadedFiles.push(fileObj);
  }

  res.json({
    message: "Archivos subidos",
    count: uploadedFiles.length,
    files: uploadedFiles,
  });
};

const download = (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(filesDir, filename);

  const isPathSafe = path.resolve(filepath).startsWith(path.resolve(filesDir));
  if (!isPathSafe) {
    return res.status(403).json({ error: "acceso denegado" });
  }

  fs.access(filepath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ error: "no encontrado" });
    }

    res.download(filepath, (err) => {
      if (err) {
        console.error("Error descargando:", err);
        res.status(500).json({ error: "error descargando" });
      }
    });
  });
};

const listFiles = (req, res) => {
  fs.readdir(filesDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "error listando" });
    }

    let fileList = [];
    for (let i = 0; i < files.length; i++) {
      const filename = files[i];
      const filepath = path.join(filesDir, filename);

      try {
        const stats = fs.statSync(filepath);

        const fileItem = {
          filename: filename,
          size: stats.size,
          uploadedAt: stats.birthtime,
          downloadPath: `/api/descargar/${filename}`,
        };
        fileList.push(fileItem);
      } catch (err) {
        console.error("Error leyendo archivo:", filename, err);
      }
    }

    const filter = req.query.filter ? req.query.filter.toLowerCase() : "";
    if (filter) {
      fileList = fileList.filter((f) =>
        f.filename.toLowerCase().includes(filter)
      );
    }

    const sort = req.query.sort || "date";
    const order = req.query.order === "asc" ? 1 : -1;

    if (sort === "name") {
      if (order === 1) {
        fileList.sort((a, b) => a.filename.localeCompare(b.filename));
      } else {
        fileList.sort((a, b) => b.filename.localeCompare(a.filename));
      }
    } else if (sort === "size") {
      if (order === 1) {
        fileList.sort((a, b) => a.size - b.size);
      } else {
        fileList.sort((a, b) => b.size - a.size);
      }
    } else {
      if (order === 1) {
        fileList.sort(
          (a, b) => new Date(a.uploadedAt) - new Date(b.uploadedAt)
        );
      } else {
        fileList.sort(
          (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)
        );
      }
    }

    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const paginated = paginationItems(req, fileList, offset, limit);
    res.json(paginated);
  });
};

const downloadMultiple = (req, res) => {
  const { filenames } = req.body;

  if (!filenames || !Array.isArray(filenames) || filenames.length === 0) {
    return res.status(400).json({ error: "sin archivos" });
  }

  const validFiles = [];
  for (let i = 0; i < filenames.length; i++) {
    const filename = filenames[i];
    const filepath = path.join(filesDir, filename);

    const isPathSafe = path
      .resolve(filepath)
      .startsWith(path.resolve(filesDir));
    if (!isPathSafe) {
      continue;
    }

    if (fs.existsSync(filepath)) {
      validFiles.push({ filename, filepath });
    }
  }

  if (validFiles.length === 0) {
    return res.status(404).json({ error: "no encontrado" });
  }

  const archive = archiver("zip", {
    zlib: { level: 9 },
  });

  const zipFilename = `descarga-${Date.now()}.zip`;

  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", `attachment; filename="${zipFilename}"`);

  archive.on("error", (err) => {
    console.error("Error en archivo:", err);
    res.status(500).json({ error: "error creando zip" });
  });

  archive.pipe(res);

  for (let i = 0; i < validFiles.length; i++) {
    const file = validFiles[i];
    archive.file(file.filepath, { name: file.filename });
  }

  archive.finalize();
};

const deleteFile = (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(filesDir, filename);

  const isPathSafe = path.resolve(filepath).startsWith(path.resolve(filesDir));
  if (!isPathSafe) {
    return res.status(403).json({ error: "acceso denegado" });
  }

  fs.unlink(filepath, (err) => {
    if (err) {
      if (err.code === "ENOENT") {
        return res.status(404).json({ error: "no encontrado" });
      }
      return res.status(500).json({ error: "error eliminando" });
    }

    res.json({ message: "eliminado ok", filename });
  });
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  download,
  downloadMultiple,
  listFiles,
  deleteFile,
};
