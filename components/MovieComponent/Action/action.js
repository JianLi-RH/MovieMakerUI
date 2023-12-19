import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Select, MenuItem } from "@mui/material";

import UpdateChar from "./_update";
import Display from "./_display";
import Disappear from "./_disappear";
import Camera from "./_camera";
import Turn from "./_turn";
import Walk from "./_walk";
import GIF from "./_gif";

export default function Action({ allActions, allChars, onSaveAction }) {
  const [actionType, setActionType] = React.useState("--");

  const saveAction = (id, newAct) => {
    let act = [];
    for (var i = 0; i < allActions.length; i++) {
      if (i == id) {
        act.push(newAct);
      } else {
        act.push(allActions[i]);
      }
    }
    onSaveAction(act);
  };

  const deleteAction = (id) => {
    let act = [];
    for (var i = 0; i < allActions.length; i++) {
      if (i !== id) {
        act.push(allActions[i]);
      }
    }
    onSaveAction(act);
  };

  return (
    <Box>
      <Typography gutterBottom variant="subtitle2" component="span">
        添加动作：
      </Typography>
      <Select
        size="small"
        onChange={(event) => setActionType(event.target.value)}
        value={actionType}
        label="动作"
      >
        <MenuItem value="--">--</MenuItem>
        <MenuItem value="更新">更新</MenuItem>
        <MenuItem value="显示">显示</MenuItem>
        <MenuItem value="消失">消失</MenuItem>
        <MenuItem value="镜头">镜头</MenuItem>
        <MenuItem value="行进">行进</MenuItem>
        <MenuItem value="转身">转身</MenuItem>
        <MenuItem value="gif">gif</MenuItem>
      </Select>
      <Button>添加新动作</Button>
      {allActions &&
        allActions.map((action, i) => {
          const name = action["名称"];
          if (name == "更新") {
            return (
              <UpdateChar
                key={i}
                action={action}
                allChars={allChars}
                onSaveAction={(newAction) => saveAction(i, newAction)}
                onDeleteAction={() => deleteAction(i)}
              ></UpdateChar>
            );
          } else if (name == "显示") {
            return (
              <Display
                key={i}
                action={action}
                allChars={allChars}
                onSaveAction={(newAction) => saveAction(i, newAction)}
                onDeleteAction={() => deleteAction(i)}
              ></Display>
            );
          } else if (name == "消失") {
            return (
              <Disappear
                key={i}
                action={action}
                allChars={allChars}
                onSaveAction={(newAction) => saveAction(i, newAction)}
                onDeleteAction={() => deleteAction(i)}
              ></Disappear>
            );
          } else if (name == "镜头") {
            return (
              <Camera
                key={i}
                action={action}
                onSaveAction={(newAction) => saveAction(i, newAction)}
                onDeleteAction={() => deleteAction(i)}
              ></Camera>
            );
          } else if (name == "转身") {
            return (
              <Turn
                key={i}
                action={action}
                allChars={allChars}
                onSaveAction={(newAction) => saveAction(i, newAction)}
                onDeleteAction={() => deleteAction(i)}
              ></Turn>
            );
          } else if (name == "行进") {
            return (
              <Walk
                key={i}
                action={action}
                allChars={allChars}
                onSaveAction={(newAction) => saveAction(i, newAction)}
                onDeleteAction={() => deleteAction(i)}
              ></Walk>
            );
          } else if (name == "gif") {
            return (
              <GIF
                key={i}
                action={action}
                allChars={allChars}
                onSaveAction={(newAction) => saveAction(i, newAction)}
                onDeleteAction={() => deleteAction(i)}
              ></GIF>
            );
          } else {
            console.log(`暂不支持该动作 ${action["名称"]}.`);
          }
        })}
    </Box>
  );
}
