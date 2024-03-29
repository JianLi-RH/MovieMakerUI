import formidable, { errors as formidableErrors } from "formidable";
import fs from "fs";
import YAML from "yaml";

import user from "../../lib/user";

export const config = {
  api: {
    bodyParser: false,
  },
};

const getConfigFileName = (req, callback) => {
  const username = user.getUser(req);
  if (!username) {
    callback();
  }
  return `workspaces/${username}/config.yaml`;
};

const get = async (req, res) => {
  const config = getConfigFileName(req, () => {
    return res.json({ code: 212, status: "fail", msg: "请先登录" });
  });
  fs.readFile(config, "utf-8", (err, data) => {
    if (err) {
      res.json({ code: 211, status: "fail", msg: err.toString() });
    }
    res.json({ code: 200, status: "success", msg: YAML.parse(data) });
  });
  return res;
};

const post = (req, res) => {
  // 更新配置
  const form = formidable({});
  form.parse(req, async function (err, fields, files) {
    const config = getConfigFileName(req, () => {
      return res.json({ code: 212, status: "fail", msg: "请先登录" });
    });
    fs.readFile(config, "utf-8", (err, data) => {
      if (err) {
        res.json({ code: 211, status: "fail", msg: err.toString() });
      }
      let k = fields.key[0];
      let jdoc = YAML.parse(data);
      jdoc[k] = fields.value[0];
      // save to file
      const yaml = require("js-yaml");
      fs.writeFile(config, yaml.dump(jdoc), (err) => {
        if (err) {
          res.json({ code: 201, status: "fail", msg: err.toString() });
        }
      });
      res.json({ code: 200, status: "success", msg: "更新成功" });
    });
    return res;
  });
};

export default (req, res) => {
  req.method === "POST"
    ? post(req, res)
    : req.method === "GET"
    ? get(req, res)
    : res.status(404).send("");
};
