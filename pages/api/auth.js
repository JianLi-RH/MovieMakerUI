import formidable, { errors as formidableErrors } from "formidable";
import fs from "fs";

import user from "../../lib/user";
import sql from "../../lib/sql";

const rootFolder = __dirname.split(".next")[0];

const yaml = require("js-yaml");
export const config = {
  api: {
    bodyParser: false,
  },
};

// 准备用户工作空间
const prepareWorkspace = (name, token) => {
  const workspace = `workspaces/${name}`;
  const userID = user.getWorkspace(token);
  const publicFolder = `public/${userID}`;
  // 创建工作区（python代码）
  if (!fs.existsSync(workspace)) {
    fs.mkdirSync(workspace, { recursive: true }, (err) => {
      if (err) {
        console.log("err: ", err);
        return false;
      }
      console.log("Workspace created successfully!");
    });
    const sourcecode = `SourceCode/MovieMaker`;
    fs.cpSync(sourcecode, workspace, { recursive: true }, (err) => {
      return false;
    });
    fs.mkdirSync(`${workspace}/script`, { recursive: true }, (err) => {
      if (err) {
        console.log("err: ", err);
        return false;
      }
      console.log("Scrit folder created successfully!");
    });
  }
  // 创建资源存储区
  if (!fs.existsSync(publicFolder)) {
    fs.mkdirSync(publicFolder, { recursive: true }, (err) => {
      if (err) {
        return console.error(err);
      }
      console.log("Public folder created successfully!");
    });
  }

  // 更新全局配置
  const config = `${workspace}/global_config.yaml`;
  const settings = yaml.load(fs.readFileSync(config, "utf-8"));
  settings.output_dir = `${rootFolder}${workspace}/output`;
  settings.sucai_dir = `${rootFolder}public`;

  const yaml_string = yaml.dump(settings);
  fs.writeFile(config, yaml_string, (err) => {
    if (err) {
      return false;
    }
  });
  return true;
};

//登录
const post = async (req, res) => {
  const form = formidable({});
  form.parse(req, function (err, fields, files) {
    let name = fields.username[0];
    let pwd = fields.password[0];

    sql.login(name, pwd).then((result) => {
      if (result != undefined) {
        user.saveUser(name, result.guid);
        if (!prepareWorkspace(name, result.guid)) {
          return res.send({
            code: 201,
            status: "fail",
            msg: "创建工作空间失败",
          });
        }
        return res.send({
          code: 200,
          status: "success",
          msg: "登录成功",
          token: result.guid,
        });
      } else {
        return res.send({
          code: 201,
          status: "fail",
          msg: "登录失败",
        });
      }
    });
  });
};

//登出
const remove = (req, res) => {
  let token = req.headers["authorization"];
  let username = user.getUser(token);
  if (!username) {
    return res.json({ code: 302, status: "fail", msg: "用户没有登录" });
  }
  user.delete(token);
  return res.json({ code: 200, status: "success", msg: "用户已登出" });
};

//获取用户信息
const get = (req, res) => {
  let token = req.headers["authorization"];
  let username = user.getUser(token);
  if (username != null) {
    return res.json({ code: 200, status: "success", msg: { name: username } });
  } else {
    return res.json({ code: 404, status: "false", msg: "没有用户登录" });
  }
};

export default async (req, res) => {
  req.method === "POST"
    ? await post(req, res)
    : req.method === "DELETE"
    ? remove(req, res)
    : req.method === "GET"
    ? get(req, res)
    : res.status(404).send("");
};
