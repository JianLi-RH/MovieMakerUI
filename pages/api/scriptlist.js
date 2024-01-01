import fs from "fs";
import user from "../../lib/user";

export const config = {
  api: {
    bodyParser: false,
  },
};

const get = async (req, res) => {
  const username = user.getUser(req);
  if (!username) {
    res.json({ code: 212, status: "fail", msg: "请先登录" });
  } else {
    const scriptFolder = `workspaces/${username}/script`;
    console.log("scriptFolder: ", scriptFolder);
    // 获取脚本列表
    const fileNames = fs.readdirSync(scriptFolder);
    let result = { code: 200, status: "success", msg: [] };
    if (fileNames.length > 0) {
      result.msg = Array(fileNames.length);
      for (var i = 0; i < fileNames.length; i++) {
        result.msg[i] = { id: fileNames[i].replace(/\.(yaml|yml)$/, "") };
      }
    }
    res.json(result);
  }

  return res;
};

export default async (req, res) => {
  // 获取脚本列表
  req.method === "GET" ? get(req, res) : res.status(404).send("");
};
