import formidable, { errors as formidableErrors } from "formidable";
import sql from "../../lib/sql";

export const config = {
  api: {
    bodyParser: false,
  },
};

//登录
const post = async (req, res) => {
  const form = formidable({});
  form.parse(req, function (err, fields, files) {
    const name = fields.username[0];
    const pwd = fields.password[0];
    sql.checkUser(name).then((result) => {
      if (result) {
        // 户用已存在
        return res.send({
          code: 201,
          status: "fail",
          msg: "户用已存在",
        });
      } else {
        const token = require("crypto").randomBytes(32).toString("hex");
        sql.registerUser(token, name, pwd).then((result) => {
          if (result) {
            // 户用注册成功
            return res.send({
              code: 200,
              status: "fail",
              msg: "户用注册成功",
            });
          } else {
            // 户用注册失败
            return res.send({
              code: 201,
              status: "fail",
              msg: "户用注册失败",
            });
          }
        });
      }
    });
  });
};

export default async (req, res) => {
  req.method === "POST" ? await post(req, res) : res.status(404).send("");
};
