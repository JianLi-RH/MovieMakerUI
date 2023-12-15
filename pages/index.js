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
    }
  } catch (err) {
    console.log(err);
  }
};

export default function Home() {
  const [allScriptNames, setAllScriptNames] = useState([]);
  const [showSetting, setShowSetting] = useState(false);
  const [settings, setSettings] = useState({});

  const [scenario, setScenario] = useImmer([]); // 当前脚本的全部场景
  const [selectedScript, setSelectedScript] = useState(null); // 当前脚本名字

  const updateList = () => {
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
    } else {
      return;
    }
  };

  const updateWorkspace = (scriptName) => {
    if (sessionStorage.token) {
      fetch("/api/file?file=" + scriptName, {
        headers: { Authorization: sessionStorage.token },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setSelectedScript(scriptName);
          if (data.msg["场景"] instanceof Array) {
            console.log("更新前scenario： ", scenario);
            console.log("新scenario: ", data.msg["场景"]);
            setScenario([...data.msg["场景"]]);
          }
        });
    }
  };

  const getScript = (scriptName) => {
    console.log("selected: ", scriptName);
    updateWorkspace(scriptName);
  };

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
            let s = [];
            let i = 0;
            for (const [key, value] of Object.entries(data.msg)) {
              s.push({
                id: i++,
                key: key,
                value: value,
              });
            }
            setSettings(s);
            setShowSetting(true);
          } else {
          }
        });
    } else {
      return;
    }
  };

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

  useEffect(() => {
    updateList();
  }, []);

  function handleAddTask(e) {
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
  }

  function handleDeleteScenario(index) {
    const newScript = [];
    for (var i = 0; i < scenario.length; i++) {
      if (i != index) {
        newScript.push(scenario[i]);
      }
    }
    callAPI(newScript, selectedScript);
    setScenario(newScript);
  }

  function handleSaveSc(index, updatedScenario) {
    let final_sc = [...scenario];
    final_sc[index] = updatedScenario;
    callAPI(final_sc, selectedScript);
    setScenario(final_sc);
    return true;
  }

  return (
    <Layout
      scripts={allScriptNames}
      selectScript={getScript}
      updateList={updateList}
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
          handleAddTask={handleAddTask}
          handleDeleteSC={handleDeleteScenario}
          handleSaveSc={(index, sc) => handleSaveSc(index, sc)}
        ></Workspace>
      )}
    </Layout>
  );
}
