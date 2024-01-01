const fs = require("fs");
// const yaml = require("js-yaml");
const yaml = require("yaml");

import user from "../../lib/user";

export default function handler(req, res) {
  let username = user.getUser(req);
  if (!username) {
    return res.json({ code: 202, status: "fail", msg: "请先登录" });
  }

  let jdoc = JSON.parse(req.body);
  let doc = JSON.stringify(jdoc.script, null, 4);
  const config = `workspaces/${username}/script/${jdoc.path}.yaml`;
  fs.writeFile(config, doc, (err) => {
    if (err) {
      res.json({ code: 201, status: "fail", msg: err.toString() });
    }
  });
  res.json({ code: 200, status: "success", msg: "更新脚本成功" });
}
