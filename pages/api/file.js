import formidable, { errors as formidableErrors } from "formidable";
import fs from "fs";
import YAML from "yaml";

export const config = {
  api: {
    bodyParser: false,
  },
};

const get = async (req, res) => {
  if (req.query["file"] != undefined) {
    const script = fs.readFile(
      `script/${req.query["file"]}.yaml`,
      "utf-8",
      (err, data) => {
        if (err) {
          res.json({ code: 500, status: "fail", msg: err.toString() });
        }
        res.json({ code: 200, status: "success", msg: YAML.parse(data) });
      }
    );
  } else if (req.query["files"] != undefined) {
    const fileNames = fs.readdirSync("script/");
    let f = Array(fileNames.length);
    for (var i = 0; i < fileNames.length; i++) {
      f[i] = { id: fileNames[i].replace(/\.(yaml|yml)$/, "") };
    }
    res.json({ code: 200, status: "success", msg: f });
  }
  return res;
};

const post = async (req, res) => {
  //上传脚本文件
  const form = formidable({});
  form.parse(req, async function (err, fields, files) {
    if (fields.length > 2) {
      // 客户端显示已经有3个视频了
      return res.send({
        code: 201,
        status: "fail",
        msg: "普通用户只能创建3个视频",
      });
    }
    const fileNames = fs.readdirSync("script/");
    if (fileNames.length > 2) {
      return res.send({
        code: 202,
        status: "fail",
        msg: "普通用户只能创建3个视频",
      });
    }
    await saveFile(files.file[0], fields);
    return res.send({ code: 200, status: "success", msg: "文件上传成功" });
  });
};

const remove = async (req, res) => {
  if (req.query["file"] != undefined) {
    let filepath = `./script/${req.query["file"]}.yaml`;
    console.log(filepath)
    fs.unlink(filepath, (err) => {
      if (err) {
        res.send({ code: 500, status: "fail", msg: err });
      } else {
        res.send({ code: 200, status: "success", msg: "脚本删除成功" });
      }
    });
  }
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
    ? remove(req, res)
    : req.method === "GET"
    ? get(req, res)
    : res.status(404).send("");
};
