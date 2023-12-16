import * as React from "react";
import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import Workspace from "components/workspace.js";
import FullFeaturedCrudGrid from "components/grid.js";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Layout from "../components/layout.js";

import { deepCopy } from "../lib/jsUtil";

// 将更改保存到文件
const callAPI = async (scenarios, selectedScript) => {
  if (sessionStorage.token) {
    console.log("final_sc提交api之前： ", scenarios);
    const cc = deepCopy(scenarios);
    console.log("cc: ", cc);
    const res = await fetch(`/api/script`, {
      method: "POST",
      headers: { Authorization: sessionStorage.token },
      body: JSON.stringify({
        script: { 场景: cc },
        path: selectedScript,
      }),
    });

    const data = await res.json();
    console.log("callAPI: ", data);
  }
};

export default function Home() {
  const [allScriptNames, setAllScriptNames] = useState([]); //全部脚本名
  const [showSetting, setShowSetting] = useState(false);
  const [settings, setSettings] = useState({});

  const [scenario, setScenario] = useImmer([]); // 当前脚本的全部场景
  const [selectedScript, setSelectedScript] = useState(null); // 当前脚本名字

  //更新脚本列表
  const updateMenuList = () => {
    if (sessionStorage.token) {
      fetch("/api/file?files", {
        headers: { Authorization: sessionStorage.token },
      })
        .then((r) => r.json())
        .then((r) => {
          // save data from fetch request to state
          if (r.msg instanceof Array) {
            setAllScriptNames(r.msg);
          } else {
            setAllScriptNames([]);
            setScenario([]);
          }
        });
    }
  };

  //更新工作区
  const getWorkingScript = (scriptName) => {
    if (sessionStorage.token) {
      fetch("/api/file?file=" + scriptName, {
        headers: { Authorization: sessionStorage.token },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setSelectedScript(scriptName); //更新当前选中的脚本
          if (data.msg["场景"] instanceof Array) {
            setScenario([...data.msg["场景"]]); // 更新场景
          } else {
            setScenario([]);
          }
        });
    }
  };

  //设置用户配置信息
  const setting = () => {
    if (sessionStorage.token) {
      fetch("/api/settings", {
        headers: { Authorization: sessionStorage.token },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.code === 200) {
            let settings = []; //全部配置
            let i = 0; // id
            for (const [key, value] of Object.entries(data.msg)) {
              settings.push({
                id: i++,
                key: key,
                value: value,
              });
            }
            setSettings(settings);
            setShowSetting(true);
          }
        });
    }
  };
  //保存用户配置的变更
  const saveSetting = (row) => {
    const body = new FormData();
    body.append("key", row.key);
    body.append("value", row.value);
    if (sessionStorage.token) {
      fetch("/api/settings", {
        method: "POST",
        body,
        headers: { Authorization: sessionStorage.token },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data.msg);
        });
    }
  };

  // 打开页面时展示菜单列表
  useEffect(() => {
    updateMenuList();
  }, []);

  // 添加新场景
  const handleAddScenario = (e) => {
    let sc = {
      背景: "",
      名字: "default" + scenario.length,
      焦点: "中心",
      背景音乐: null,
      比例: 1,
      角色: null,
      活动: null,
    };
    setScenario([...scenario, sc]);
  };

  // 删除指定顺序的场景
  const handleDeleteScenario = (index) => {
    const newScript = [];
    for (var i = 0; i < scenario.length; i++) {
      if (i != index) {
        newScript.push(scenario[i]);
      }
    }
    callAPI(newScript, selectedScript);
    setScenario(newScript);
  };
  // 保存场景
  const onSaveScenario = (index, updatedScenario) => {
    console.log("scenario: ", JSON.stringify(scenario));
    let final_sc = [...scenario];
    console.log("updatedScenario: ", updatedScenario);
    final_sc[index] = updatedScenario;
    console.log("final_sc: ", final_sc);
    callAPI(final_sc, selectedScript);
    // setScenario(final_sc);
    return true;
  };

  return (
    <Layout
      scripts={allScriptNames}
      selectScript={(scriptName) => getWorkingScript(scriptName)}
      updateMenuList={() => updateMenuList()}
      setting={setting}
    >
      <Dialog
        sx={{
          "& .MuiDialog-paper": { width: 600, maxWidth: 600, maxHeight: 600 },
        }}
        maxWidth="xs"
        open={showSetting}
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>设置视频基本参数</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setShowSetting(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <FullFeaturedCrudGrid
            columns={[
              {
                field: "key",
                headerName: "参数",
                width: 150,
                color: "#FFF",
                editable: false,
              },
              {
                field: "value",
                headerName: "参数值",
                width: 150,
                align: "left",
                headerAlign: "left",
                editable: true,
              },
            ]}
            data={settings}
            onSave={saveSetting}
            enableEdit={true}
          ></FullFeaturedCrudGrid>
        </DialogContent>
      </Dialog>
      {scenario && (
        <Workspace
          scenarios={scenario}
          selectedScript={selectedScript}
          onAddScenario={handleAddScenario}
          onDeleteScenario={handleDeleteScenario}
          onSaveScenario={(index, sc) => onSaveScenario(index, sc)}
        ></Workspace>
      )}
    </Layout>
  );
}
