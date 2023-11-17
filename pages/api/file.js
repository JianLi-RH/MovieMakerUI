import formidable, { errors as formidableErrors } from "formidable";
import fs from "fs";
import { resolve } from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

const get = async (req, res) => {
  const script = fs.readFile(
    `script/${req.query["file"]}.yaml`,
    "utf-8",
    (err, data) => {
      if (err) throw err;
      // console.log("data: ", data.toString())
      res.status(200).send(data.toString());
    }
  );
  return res;
};

const post = async (req, res) => {
  const form = formidable({});
  form.parse(req, async function (err, fields, files) {
    await saveFile(files.file[0], fields);
    return res.status(200).send("ok");
  });
};

const saveFile = async (file, fields) => {
  fs.copyFile(
    file.filepath,
    `./${fields.path}/${file.originalFilename}`,
    (err) => {
      if (err) {
        console.log("Error Found:", err);
      }
    }
  );
  return;
};

export default (req, res) => {
  // 上传文件时(POST)，表单需要两个参数： file和path, path是文件存放的目标路径
  // 下载文件时(get)， 表单需要一个参数：file
  req.method === "POST"
    ? post(req, res)
    : req.method === "PUT"
    ? console.log("PUT")
    : req.method === "DELETE"
    ? console.log("DELETE")
    : req.method === "GET"
    ? get(req, res)
    : res.status(404).send("");
};
