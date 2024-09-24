const express = require("express");
const fs = require("fs");
const sharp = require("sharp");

const app = express();
const port = 1002; // 可以根据需要更改端口号
const picDir = "./pic/";

app.use(express.json({limit: "10mb"}));

app.post("/upload", (req, res) => {
    const {data, name} = req.body;
    if (!data || !name) {
        return res
            .status(400)
            .json({error: "Missing data or name in request body"});
    }

    // 将base64编码的图片数据解码并转换为webp格式
    const decodedData = Buffer.from(data, "base64");
    sharp(decodedData)
        .webp()
        .toFile(`${picDir}${name}.webp`, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({error: "Failed to store image"});
            }
            res.json({message: "Image stored successfully"});
        });
});

app.get("/pic/:filename", (req, res) => {
    const filename = req.params.filename;
    const filePath = `${picDir}${filename}`;

    console.log(__dirname + "/pic/" + filename);

    fs.access(filePath, fs.constants.R_OK, (err) => {
        if (err) {
            return res.status(404).json({error: "Image not found"});
        }

        res.sendFile(__dirname + "/pic/" + filename);
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
