import * as React from "react";
import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import Workspace from "components/workspace.js";
import FullFeaturedCrudGrid from "components/settings.js";

import Layout from "../components/layout.js";

// 将更改保存到文件
const callAPI = async (final_sc, selectedScript) => {
  try {
    if (sessionStorage.token) {
      const res = await fetch(`/api/script`, {
        method: "POST",
        headers: { Authorization: sessionStorage.token },
        body: JSON.stringify({
          script: { 场景: final_sc },
          path: selectedScript,
        }),
      });

      const data = await res.json();
      console.log("callAPI: ", data);
    }
  } catch (err) {
    console.log(err);
  }
};

export default function Home() {
  const [allScript, setAllScript] = useState([]);

  const [script, updateScript] = useImmer([]); // 当前脚本的全部场景
  const [selectedScript, setSelectedScript] = React.useState(null); // 当前脚本名字

  const updateList = () => {
    if (sessionStorage.token) {
      fetch("/api/file?files", {
        headers: { Authorization: sessionStorage.token },
      })
        .then((r) => r.json())
        .then((r) => {
          // save data from fetch request to state
          if (r.msg instanceof Array) {
            setAllScript(r.msg);
          } else {
            setAllScript([]);
            updateScript([]);
          }
        });
    } else {
      return;
    }
  };

  const getScript = (script) => {
    if (sessionStorage.token) {
      fetch("/api/file?file=" + script, {
        headers: { Authorization: sessionStorage.token },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setSelectedScript(script);
          if (data.msg["场景"] instanceof Array) {
            updateScript(data.msg["场景"]);
          } else {
            updateScript([]);
          }
        });
    } else {
      return;
    }
  };

  useEffect(() => {
    updateList();
  }, []);

  function handleAddTask(e) {
    let sc = {
      背景: "",
      名字: "default" + script.length,
      焦点: "中心",
      背景音乐: null,
      比例: 1,
      角色: null,
      活动: null,
    };
    updateScript([...script, sc]);
  }

  function handleDeleteScenario(index) {
    const newScript = [];
    for (var i = 0; i < script.length; i++) {
      if (i != index) {
        newScript.push(script[i]);
      }
    }
    callAPI(newScript, selectedScript);
    updateScript(newScript);
  }

  async function handleSaveSc(index, scenario) {
    let final_sc = [...script];
    final_sc[index] = scenario;
    callAPI(final_sc, selectedScript);
  }

  return (
    <Layout
      scripts={allScript}
      selectScript={getScript}
      updateList={updateList}
    >
      {(script && (
        <Workspace
          scenarios={script}
          selectedScript={selectedScript}
          handleAddTask={handleAddTask}
          handleDeleteSC={handleDeleteScenario}
          handleSaveSc={handleSaveSc}
        ></Workspace>
      )) || (
        <>
          {/* 请在左侧菜单栏选择脚本，如果还没有脚本请先上传，也可以点击
          <Button component="label" variant="text">
            新建脚本
          </Button>
          创建一个脚本 */}
          <FullFeaturedCrudGrid></FullFeaturedCrudGrid>
        </>
      )}
    </Layout>
  );
}
