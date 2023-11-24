import formidable, { errors as formidableErrors } from "formidable";
import fs from "fs";

import user from "../../lib/user";

export const config = {
  api: {
    bodyParser: false,
  },
};

// 准备用户工作空间
const prepareWorkspace = (username) => {
  let workspace = `workspaces/${username}`;
  if (!fs.existsSync(workspace)) {
    let created = fs.mkdirSync(workspace, { recursive: true }, (err) => {
      if (err) {
        console.log("err: ", err);
        return console.error(err);
      }
      console.log("Workspace created successfully!");
    });
    if (created == false) {
      return false;
    }
    let sourcecode = `SourceCode/MovieMaker`;
    fs.cpSync(sourcecode, workspace, { recursive: true }, (err) => {
      return false;
    });
    return true;
  }
  return true;
};

//登录
const post = (req, res) => {
  const form = formidable({});
  form.parse(req, function (err, fields, files) {
    let name = fields.username;
    let pwd = fields.password;

    if (name == "admin" && pwd == "admin") {
      if (prepareWorkspace(name)) {
        let token = require("crypto").randomBytes(32).toString('hex');
        user.saveUser(name, token);
        return res.send({ code: 200, status: "success", msg: "登录成功", token: token });
      } else {
        return res.send({ code: 202, status: "fail", msg: "创建工作空间失败" });
      }
    } else {
      console.log("fail");
      return res.send({
        code: 201,
        status: "fail",
        msg: "登录失败",
      });
    }
  });
};

export default (req, res) => {
  req.method === "POST"
    ? post(req, res)
    : req.method === "PUT"
    ? console.log("PUT")
    : // : req.method === "DELETE"
    // ? remove(req, res)
    req.method === "GET"
    ? get(req, res)
    : res.status(404).send("");
};
