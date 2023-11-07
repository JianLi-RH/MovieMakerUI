import * as React from "react";
import { useReducer } from "react";
import Header from "./header";
import Menu from "./menu";
import Workspace from "./workspace";

import Box from "@mui/material/Box";
import ThemeRegistry from "./ThemeRegistry/ThemeRegistry";
import GlobalConifg from "../pages/app.config";
const DRAWER_WIDTH = GlobalConifg.DRAWER_WIDTH;
const writeYamlFile = require("write-yaml-file");

export default function Layout({ scenarios }) {
  const [tasks, dispatch] = useReducer(tasksReducer, scenarios);

  function handleAddTask() {
    dispatch({
      type: "added",
    });
  }

  function handleChangeTask(scenario) {
    dispatch({
      type: "changed",
      scenario: scenario,
    });
  }

  function handleDeleteTask(name) {
    dispatch({
      type: "deleted",
      name: name,
    });
  }

  function handleSaveTask() {
    dispatch({
      type: "save",
    });
  }

  return (
    <ThemeRegistry>
      <Header></Header>
      <Menu></Menu>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          ml: `${DRAWER_WIDTH}px`,
          mt: ["48px", "56px", "64px"],
          p: 3,
        }}
      >
        <Workspace
          scenarios={tasks}
          onAddTask={handleAddTask}
          onChangeTask={handleChangeTask}
          onDeleteTask={handleDeleteTask}
          onSaveTask={handleSaveTask}
        ></Workspace>
      </Box>
    </ThemeRegistry>
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
      return [...tasks, sc];
    }
    case "changed": {
      return tasks.map((t) => {
        if (t["名字"] === action.scenario["名字"]) {
          return action.scenario;
        } else {
          return t;
        }
      });
    }
    case "deleted": {
      return tasks.filter((t) => t["名字"] !== action.name);
    }
    case "save": {
      // writeYamlFile("foo.yaml", tasks).then(() => {
      //   console.log("done");
      // });
      console.log("save done");
      return
    }
    default: {
      throw Error("未知 action: " + action.type);
    }
  }
}
