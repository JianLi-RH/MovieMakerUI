const fs = require("fs");
const yaml = require("js-yaml");

export default function handler(req, res) {
  try {
    const jdoc = JSON.parse(req.body);
    const doc = yaml.dump(jdoc.script);
    fs.writeFileSync(`script/${jdoc.path}.yaml`, doc, "utf8");
    res.status(200).json({ result: "successed" });
  } catch (e) {
    res.status(503).json({ result: e });
  }
}
