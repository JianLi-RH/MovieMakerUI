import fs from "fs";

export function getAllScripts() {
  const fileNames = fs.readdirSync('script/');

  return fileNames.map((fileName) => {
    return {
      id: fileName.replace(/\.(yaml|yml)$/, ""),
    };
  });
}

export function getVideoScript(id) {
  const file = fs.readFile(`script/${id}.yaml`, "utf8");
  const script = YAML.parse(file);

  return {
    script,
  };
}
