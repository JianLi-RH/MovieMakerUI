import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Scenario from "./MovieComponent/scenario";
import Container from "@mui/material/Container";
import useDownloader from "react-use-downloader";
import { List, ListItemButton, ListItemText } from "@mui/material";
import { AddCircle } from "@mui/icons-material/";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import GlobalConifg from "../pages/app.config";

// 将更改保存到文件
const callAPI = async (scenarios, selectedScript) => {
  if (sessionStorage.token) {
    const cc = [];
    for (var i = 0; i < scenarios.length; i++) {
      cc.push(scenarios[i]);
    }
    const res = fetch(`/api/script`, {
      method: "POST",
      headers: { Authorization: sessionStorage.token },
      body: JSON.stringify({
        script: { 场景: cc },
        path: selectedScript,
      }),
    }).then((response) => {
      return response.json();
    });
    return res;
  }
};

export default function Workspace({ selectedScript }) {
  const [scenarios, setScenarios] = useState([]); // 当前脚本的全部场景
  const [downloadDisplay, setDownloadDisplay] = useState("none");
  const { size, elapsed, percentage, download, cancel, error, isInProgress } =
    useDownloader();
  const [url, setUrl] = useState(""); // 视频文件地址
  const [circle, setCircle] = useState("none");

  useEffect(() => {
    if (sessionStorage.token) {
      fetch(`/api/file?file=${selectedScript}`, {
        headers: { Authorization: sessionStorage.token },
      })
        .then((data) => {
          return data.json();
        })
        .then(function (jsonStr) {
          if (jsonStr.code === 200) {
            if (jsonStr.msg["场景"] instanceof Array) {
              const sc = [...jsonStr.msg["场景"]];
              setScenarios(sc); // 更新场景
              return;
            }
          }
          setScenarios([]);
        });
    }
  }, [selectedScript]);

  // 保存场景
  const onSaveScenario = async (index, updatedScenario) => {
    let final_sc = JSON.parse(JSON.stringify(scenarios));
    final_sc[index] = updatedScenario;
    const res = await callAPI(final_sc, selectedScript);
    if (res.code === 200) {
      setScenarios(final_sc);
    }
  };

  // 添加新场景
  const handleAddScenario = (e) => {
    let sc = {
      背景: "",
      名字: "default" + scenarios.length,
      焦点: "中心",
      背景音乐: null,
      比例: 1,
      角色: null,
      活动: null,
    };
    setScenarios([...scenarios, sc]);
  };

  // 删除指定顺序的场景
  const handleDeleteScenario = (index) => {
    const newScript = [];
    for (var i = 0; i < scenarios.length; i++) {
      if (i != index) {
        newScript.push(scenarios[i]);
      }
    }
    const res = callAPI(newScript, selectedScript);
    if (data.code === 200) {
      setScenarios(newScript);
    }
  };

  const makeVideo = async (scenario) => {
    if (sessionStorage.token) {
      setDownloadDisplay("none");
      setCircle("inline-block");
      const body = new FormData();
      body.append("script", selectedScript);
      body.append("scenario", scenario || "");
      const data = await fetch("api/makevideo", {
        method: "POST",
        body,
        headers: { Authorization: sessionStorage.token },
      });
      if (data.code === 200) {
        setDownloadDisplay("inline");
        setUrl(data.msg);
      } else {
        setDownloadDisplay("none");
      }
    }
  };
  return (
    <Container>
      {selectedScript && (
        <Box>
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
            }}
            component="div"
          >
            {selectedScript}
          </Typography>
          <Button
            onClick={() => {
              makeVideo();
            }}
          >
            生成视频
          </Button>
          <CircularProgress size="1rem" sx={{ m: 1, display: circle }} />
          <Button
            sx={{ display: downloadDisplay }}
            onClick={() => {
              download(url, `${selectedScript}.mp4`);
            }}
          >
            下载视频
          </Button>
        </Box>
      )}
      {scenarios.length > 0 &&
        scenarios.map((scenario, i) => (
          <Scenario
            key={i}
            selectedScript={selectedScript}
            scenario={scenario}
            onDeleteScenario={() => handleDeleteScenario(i)}
            onSaveScenario={(sc) => onSaveScenario(i, sc)}
          ></Scenario>
        ))}
      {/* 只有选中了脚本的时候才出现添加场景按钮 */}
      {selectedScript && (
        <Box
          sx={{
            width: 1,
            marginRight: 0.5,
            my: 1,
          }}
        >
          <List>
            <ListItemButton onClick={() => handleAddScenario()}>
              <ListItemText sx={{ textAlign: "center" }}>
                <AddCircle></AddCircle>
              </ListItemText>
            </ListItemButton>
          </List>
        </Box>
      )}
    </Container>
  );
}
