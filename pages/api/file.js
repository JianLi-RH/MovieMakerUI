import formidable, { errors as formidableErrors } from "formidable";
import fs from "fs";
const yaml = require("js-yaml");

import user from "../../lib/user";

export const config = {
  api: {
    bodyParser: false,
  },
};

const get = async (req, res) => {
  const token = req.headers["authorization"];

  const username = user.getUser(token);
  if (!username) {
    return await res.json({ code: 212, status: "fail", msg: "请先登录" });
  }
  const scriptFolder = `workspaces/${username}/script`;
  if (req.query["file"] != undefined) {
    // 获取脚本内容
    fs.readFile(
      `${scriptFolder}/${req.query["file"]}.yaml`,
      "utf-8",
      (err, data) => {
        if (err) {
          res.json({ code: 211, status: "fail", msg: err.toString() });
        }
        res.json({ code: 200, status: "success", msg: yaml.load(data) });
      }
    );
  } else {
    res.json({ code: 212, status: "fail", msg: "没有指定脚本名" });
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
    const token = req.headers["authorization"];
    const username = user.getUser(token);
    if (!username) {
      return await res.json({ code: 202, status: "fail", msg: "请先登录" });
    }
    const scriptFolder = `workspaces/${username}/script`;
    if (!fs.existsSync(scriptFolder)) {
      fs.mkdirSync(scriptFolder, { recursive: true }, (err) => {
        if (err) {
          console.log("err: ", err);
          return res.send({
            code: 203,
            status: "fail",
            msg: "创建脚本文件夹失败",
          });
        }
        console.log("scriptFolder created successfully!");
      });
    }
    const fileNames = fs.readdirSync(scriptFolder);
    if (fileNames.length > 2) {
      return res.send({
        code: 204,
        status: "fail",
        msg: "普通用户只能创建3个视频",
      });
    }
    let result = await saveFile(files.file[0], fields, username);
    if (result) {
      return res.send({ code: 200, status: "success", msg: "文件上传成功" });
    } else {
      return res.send({ code: 210, status: "fail", msg: "文件上传失败" });
    }
  });
};

const remove = async (req, res) => {
  let token = req.headers["authorization"];
  let username = user.getUser(token);
  if (!username) {
    return await res.json({ code: 302, status: "fail", msg: "请先登录" });
  }
  if (req.query["file"] != undefined) {
    let filepath = `workspaces/${username}/script/${req.query["file"]}.yaml`;
    fs.unlink(filepath, (err) => {
      if (err) {
        res.send({ code: 303, status: "fail", msg: err });
      } else {
        res.send({ code: 200, status: "success", msg: "脚本删除成功" });
      }
    });
  }
};

const saveFile = async (file, fields, username) => {
  let fileNames = `workspaces/${username}/script`;
  fs.copyFile(
    file.filepath,
    `./${fileNames}/${file.originalFilename}`,
    (err) => {
      if (err) {
        console.log("Error Found:", err);
        return false;
      }
    }
  );
  return true;
};

// 手动创建脚本文件（非上传）
const put = async (req, res) => {
  console.log("req.query: ", req.query["name"]);
  let token = req.headers["authorization"];
  let username = user.getUser(token);
  if (!username) {
    return await res.json({ code: 302, status: "fail", msg: "请先登录" });
  }
  if (req.query["name"] != undefined) {
    const filepath = `workspaces/${username}/script/${req.query["name"]}.yaml`;
    if (fs.existsSync(filepath)) {
      res.send({ code: 303, status: "fail", msg: "已存在同名的脚本" });
    } else {
      fs.writeFile(filepath, "场景:\n  -\n      名字: 新场景", (err) => {
        if (err) {
          res.send({ code: 303, status: "fail", msg: err });
        } else {
          res.send({ code: 200, status: "success", msg: "新脚本创建成功" });
        }
      });
    }
  } else {
    res.send({ code: 303, status: "fail", msg: "请上传脚本名" });
  }
  return res;
};

export default async (req, res) => {
  // 上传文件时(POST)，表单需要两个参数： file和path, path是文件存放的目标路径
  // 下载文件时(get)， 表单需要一个参数：file
  req.method === "POST"
    ? post(req, res)
    : req.method === "PUT"
    ? put(req, res)
    : req.method === "DELETE"
    ? remove(req, res)
    : req.method === "GET"
    ? get(req, res)
    : res.status(404).send("");
};
