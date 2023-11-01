import YAML from 'yaml'
import fs from 'fs';

export async function getVideoScript(id) {
  const file = fs.readFileSync(`script/${id}.yaml`, "utf8");
  const script = YAML.parse(file);

  return {
    script,
  };
}
