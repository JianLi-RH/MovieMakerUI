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
  let token = req.headers["authorization"];
  let username = user.getUser(token);
  if (!username) {
    return await res.json({ code: 202, status: "fail", msg: "请先登录" });
  }
  //制作视频
  const form = formidable({});
  form.parse(req, async function (err, fields, files) {
    let script = `workspaces/${username}/script/${fields.script[0]}.yaml`;
    let scenario = "";
    if (fields.scenario != undefined) {
      scenario = fields.scenario[0];
    }

    console.log("script: ", script);
    console.log("scenario: ", scenario);

    const spawn = require("child_process").spawn;
    const runPath = `workspaces/${username}/run.py`;
    const output = `workspaces/${username}/output/test.mp4`;
    let cmd = [runPath, "-o", output, "-s", script];
    if (scenario.length > 0) {
      cmd.push("-c");
      cmd.push(scenario);
    }

    const python = spawn("python3.10", cmd);
    let data = "";
    python.stdout.on("data", function (response) {
      // Keep collecting the data from python script
      console.log(response.toString());
      data += response.toString();
    });
    python.stderr.on("data", function (response) {
      data += `Error: ${response.toString()}`;
    });

    python.on("exit", function (code) {
      console.log(
        "Python process is now completed send data as response, code: ",
        code
      );
      return res.json({
        code: 200,
        status: "fail",
        msg: data,
      });
    });
  });
};

const get = async (req, res) => {
  let script = req.query["script"];
  let scenario = req.query["scenario"];

  if ((scenario = undefined)) {
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
