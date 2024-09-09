const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

app.set("view engine", "ejs");

const ip = "files.sdju.chat";
const port = 1001;

const filenameMapPath = path.join(__dirname, "filenameMap.json");

let filenameMap = {};

function loadFilenameMap() {
  fs.readFile(filenameMapPath, { encoding: "utf-8" }, (err, data) => {
    if (!err) {
      filenameMap = JSON.parse(data);
      return console.log("Read filenameMap.json successfully !");
    }
    console.log("Can't read filenameMap.json !");
  });
}

loadFilenameMap();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "./files";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    //https://juejin.cn/post/7239267216804823095
    file.originalname = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );

    filenameMap[uniqueSuffix] = file.originalname;
    cb(null, uniqueSuffix);
    fs.writeFile(
      filenameMapPath,
      JSON.stringify(filenameMap, null, 2),
      () => {}
    );
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(400).json({ result: "error" });
  }

  // Get the unique identifier for the uploaded file
  const actualFilename = req.file.filename;

  // Construct the full download URL
  const downloadUrl = `https://${ip}/files/${actualFilename}`;
  const fileName = req.file.originalname;
  const fileSize = formatFileSize(req.file.size);
  const downloadWidget = `https://${ip}/download_widget?file_id=${actualFilename}`;

  console.log(
    "Received file: " + req.file.originalname + " , downloadUrl: " + downloadUrl
  );

  //https://stackoverflow.com/questions/45696999/fetch-unexpected-end-of-input
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Send back the download URL in the response
  res
    .status(200)
    .json({
      result: "success",
      downloadUrl,
      fileName,
      fileSize,
      downloadWidget,
    });
});

app.get("/files/:filename", (req, res) => {
  const actualFilename = req.params.filename;
  const originalFilename = filenameMap[actualFilename];

  if (!originalFilename) {
    return res.status(404).json({ error: "File not found" });
  }

  const filePath = path.join(__dirname, "files", actualFilename);

  //https://blog.csdn.net/tangdou369098655/article/details/117847591
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${encodeURIComponent(originalFilename)}"`
  );
  res.sendFile(filePath);
});

app.use("/files", express.static(path.join(__dirname, "files")));

app.use("/download_widget", (req, res) => {
  const actualFilename = req.query.file_id;
  const originalFilename = filenameMap[actualFilename];

  if (!originalFilename) {
    return res.status(404).json({ error: "File not found" });
  }
  const downloadUrl = `https://${ip}/files/${actualFilename}`;
  const filePath = path.join(__dirname, "files", actualFilename);

  fs.promises
    .stat(filePath)
    .then((stats) => {
      const fileSize = formatFileSize(stats.size);
      res.render("index", { originalFilename, downloadUrl, fileSize });
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

function formatFileSize(sizeInBytes) {
  const units = ["B", "KB", "MB", "GB"];
  let size = sizeInBytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}
