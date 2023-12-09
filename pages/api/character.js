import formidable, { errors as formidableErrors } from "formidable";
import fs from "fs";
import YAML from "yaml";

import user from "../../lib/user";

export const config = {
  api: {
    bodyParser: false,
  },
};

const post = async (req, res) => {
  //上传角色图片
  const form = formidable({});
  form.parse(req, async function (err, fields, files) {
    let token = req.headers["authorization"];
    let username = user.getUser(token);
    if (!username) {
      return await res.json({ code: 202, status: "fail", msg: "请先登录" });
    }
    let scriptFolder = `public/${username}/character`;
    if (!fs.existsSync(scriptFolder)) {
      let created = fs.mkdirSync(scriptFolder, { recursive: true }, (err) => {
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
    let result = await saveFile(files.file[0], fields, scriptFolder);
    if (result) {
      return res.send({ code: 200, status: "success", msg: `${username}/character/${files.file[0].originalFilename}` });
    } else {
      return res.send({ code: 210, status: "fail", msg: "文件上传失败" });
    }
  });
};

const saveFile = async (file, fields, scriptFolder) => {
  fs.copyFile(
    file.filepath,
    `./${scriptFolder}/${file.originalFilename}`,
    (err) => {
      if (err) {
        console.log("Error Found:", err);
        return false;
      }
    }
  );
  return true;
};

export default (req, res) => {
  req.method === "POST"
    ? post(req, res)
    : req.method === "PUT"
    ? console.log("PUT")
    : req.method === "DELETE"
    ? console.log("DELETEd")
    : req.method === "GET"
    ? get(req, res)
    : res.status(404).send("");
};
