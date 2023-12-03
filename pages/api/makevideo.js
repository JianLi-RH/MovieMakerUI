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
    let output = `${fields.script[0]}.mp4`;
    if (fields.scenario != undefined) {
      scenario = fields.scenario[0];
      output = `${scenario}.mp4`;
    }

    console.log("script: ", script);
    console.log("scenario: ", scenario);

    const spawn = require("child_process").spawn;
    const runPath = `workspaces/${username}/run.py`;
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
      if (code != 0) {
        return res.json({
          code: 500,
          status: "fail",
          msg: "生成视频失败",
        });
      }
      let video = `workspaces/${username}/output/${output}`;
      let publicFolder = `public/${username}/${output}`;
      fs.mkdirSync(`public/${username}/`, { recursive: true }, (err) => {
        if (err) {
          return res.json({
            code: 500,
            status: "fail",
            msg: "无法找到视频存放目标地址",
          });
        }
      });
      fs.cpSync(video, publicFolder, { recursive: true }, (err) => {
        return res.json({
          code: 501,
          status: "fail",
          msg: "复制视频失败",
        });
      });

      return res.json({
        code: 200,
        status: "fail",
        msg: `${username}/${output}`,
      });
    });
  });
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
