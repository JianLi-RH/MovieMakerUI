import * as React from "react";
import YAML from "yaml";
import { useEffect, useReducer, useState } from "react";
import Workspace from "components/workspace.js";
import Button from "@mui/material/Button";

import Layout from "../components/layout.js";
import { getAllScripts } from "lib/script.js";

// 将更改保存到文件
const callAPI = async (final_sc) => {
  try {
    const res = await fetch(`/api/script`, {
      method: "POST",
      body: JSON.stringify({
        script: { 场景: final_sc },
        path: selectedScript,
      }),
    });

    const data = await res.json();
  } catch (err) {
    console.log(err);
  }
};

export async function getStaticProps() {
  // const origin_script = await getVideoScript("武松打虎");
  const all_script = getAllScripts();
  return {
    props: { all_script },
  };
}

export function getScript(scriptName) {}

export default function Home({ all_script }) {
  const [script, dispatch] = useReducer(tasksReducer, null);
  const [selectedScript, setSelectedScript] = useState(null);

  const getScript = (script) => {
    fetch("/api/file?file=" + script)
      .then((response) => {
        setSelectedScript(script);
        return response.text();
      })
      .then((data) => {
        // setScript(YAML.parse(data)["场景"]);
        dispatch({
          type: "set",
          script: YAML.parse(data)["场景"],
        });
      });
  };

  function handleAddTask() {
    dispatch({
      type: "added",
    });
  }

  function handleDeleteTask(name) {
    dispatch({
      type: "deleted",
      name: name,
    });
  }

  async function handleSaveSc(index, scenario) {
    let final_sc = script;
    console.log("final_sc: ", final_sc);
    final_sc[index] = scenario;
    callAPI(final_sc);
  }

  return (
    <Layout scripts={all_script} selectScript={getScript}>
      {(script && (
        <Workspace
          scenarios={script}
          selectedScript={selectedScript}
          handleAddTask={handleAddTask}
          handleDeleteTask={handleDeleteTask}
          handleSaveSc={handleSaveSc}
        ></Workspace>
      )) || (
        <>
          请在左侧菜单栏选择脚本，如果还没有脚本请先上传，也可以点击
          <Button component="label" variant="text">
            新建脚本
          </Button>
          创建一个脚本
        </>
      )}
    </Layout>
  );
}

function tasksReducer(tasks, action) {
  // 这里tasks就是scenarios
  switch (action.type) {
    case "added": {
      let sc = {
        背景: "",
        名字: "default" + tasks.length,
        焦点: "中心",
        背景音乐: null,
        比例: 1,
        角色: null,
        活动: null,
      };
      return [...script, sc];
    }
    case "deleted": {
      return script.filter((t) => t["名字"] !== action.name);
    }
    case "set": {
      return action.script;
    }
    default: {
      throw Error("未知 action: " + action.type);
    }
  }
}
