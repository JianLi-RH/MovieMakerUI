import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), 'pages', "help");
export async function getPostData(id) {
  const fullPath = `${postsDirectory}/${id}.md`;
  console.log(fullPath);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    contentHtml,
  };
}

export function getAllHelpIds() {
  console.log("postsDirectory:", postsDirectory);
  const fileNames = fs.readdirSync(postsDirectory);
  console.log(fileNames);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}
