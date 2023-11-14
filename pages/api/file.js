import formidable, { errors as formidableErrors } from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

const post = async (req, res) => {
  const form = formidable({});
  form.parse(req, async function (err, fields, files) {
    await saveFile(files.file[0], fields);
    return res.status(200).send("ok");
  });
};

const saveFile = async (file, fields) => {
  console.log(file);
  console.log(fields);
  fs.copyFile(
    file.filepath,
    `./${fields.path}/${file.originalFilename}`,
    (err) => {
      if (err) {
        console.log("Error Found:", err);
      }
    }
  );
  return;
};

export default (req, res) => {
  // 上传文件时，表单需要两个参数： file和path, path是文件存放的目标路径
  req.method === "POST"
    ? post(req, res)
    : req.method === "PUT"
    ? console.log("PUT")
    : req.method === "DELETE"
    ? console.log("DELETE")
    : req.method === "GET"
    ? console.log("GET")
    : res.status(404).send("");
};
