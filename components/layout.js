import * as React from "react";
import { useReducer } from "react";
import Header from "./header";
import Menu from "./menu";
import Workspace from "./workspace";

import Box from "@mui/material/Box";
import ThemeRegistry from "./ThemeRegistry/ThemeRegistry";
import GlobalConifg from "../pages/app.config";
const DRAWER_WIDTH = GlobalConifg.DRAWER_WIDTH;

export default function Layout({ scenarios }) {
  // const [originScenarios, setOriginScenarios] = React.useState(scenarios);
  const [tasks, dispatch] = useReducer(tasksReducer, scenarios);
  console.log("layout", scenarios);

  function handleAddTask() {
    dispatch({
      type: "added",
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: "changed",
      task: task,
    });
  }

  function handleDeleteTask(name) {
    dispatch({
      type: "deleted",
      name: name,
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
        ></Workspace>
      </Box>
    </ThemeRegistry>
  );
}

function tasksReducer(tasks, action) {
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
        if (t["名字"] === action.task["名字"]) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case "deleted": {
      return tasks.filter((t) => t["名字"] !== action.name);
    }
    default: {
      throw Error("未知 action: " + action.type);
    }
  }
}
