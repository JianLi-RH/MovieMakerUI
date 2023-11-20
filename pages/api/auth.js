import formidable, { errors as formidableErrors } from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

const get = async (req, res) => {
  return res.send({ code: 200, status: "success", msg: "登录成功" });
};

const post = (req, res) => {
  //登录
  const form = formidable({});
  console.log("form: ", form);
  form.parse(req, function (err, fields, files) {
    console.log("fields: ", fields);
    let name = fields.username;
    let pwd = fields.password;

    if (name == "admin" && pwd == "admin") {
      console.log("success");
      return res.send({ code: 200, status: "success", msg: "登录成功" });
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
