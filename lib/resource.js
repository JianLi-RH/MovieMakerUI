import fs from "fs";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export default {
  async getPostData(id) {
    const fullPath = "posts/help.md";
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
  },

  async uploadToServer(file, subfolder) {
    if (!sessionStorage.token) {
      return;
    }
    const body = new FormData();
    body.append("file", file);
    body.append("subfolder", subfolder);
    let result = fetch("/api/resource", {
      method: "POST",
      headers: { Authorization: sessionStorage.token },
      body,
    })
      .then((data) => {
        return data.json();
      })
      .then((res) => {
        return res;
      })
      .then(function (jsonStr) {
        if (jsonStr.code === 200) {
          return jsonStr.msg;
        } else {
          return null;
        }
      });
    return result;
  },
};
