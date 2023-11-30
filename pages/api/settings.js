import formidable, { errors as formidableErrors } from "formidable";
import fs from "fs";
import YAML from "yaml";

import user from "../../lib/user";

export const config = {
  api: {
    bodyParser: false,
  },
};

const get = async (req, res) => {
  let token = req.headers["authorization"];

  let username = user.getUser(token);
  if (!username) {
    return await res.json({ code: 212, status: "fail", msg: "请先登录" });
  }
  let config = `workspaces/${username}/config.yaml`;
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
    console.log("fields: ", fields);
    let token = req.headers["authorization"];
    let username = user.getUser(token);
    if (!username) {
      return res.json({ code: 202, status: "fail", msg: "请先登录" });
    }
    let config = `workspaces/${username}/config.yaml`;
    fs.readFile(config, "utf-8", (err, data) => {
      console.log("data: ", data);

      if (err) {
        res.json({ code: 211, status: "fail", msg: err.toString() });
      }
      let k = fields.key[0]
      console.log("k: ", k)
      let jdoc = data.json()
      jdoc[k] = fields.value[0];
      // save to file
      console.log("jdoc: ", jdoc);
      fs.writeFileSync(config, jdoc, "utf8");
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
