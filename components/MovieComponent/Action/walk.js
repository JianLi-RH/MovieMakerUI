import * as React from "react";
import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import Input from "@mui/material/Input";

import resource from "../../../lib/resource";

export default function Walk({
  action,
  allChars,
  onSaveAction,
  onDeleteAction,
}) {
  const [name, setName] = useState(action["角色"]);
  const [startPos, setStartPos] = useState(action["开始位置"]);
  const [endPos, setEndPos] = useState(action["结束位置"]);
  const [ratio, setRatio] = useState(action["比例"]);
  const [mode, setMode] = useState(action["方式"]);
  const [edit, setEdit] = useState(false);

  const handleChange = (event) => {
    if (event.target.name == "角色") {
      setName(event.target.value);
    }
    if (event.target.name == "开始位置") {
      setStartPos(event.target.value);
    }
    if (event.target.name == "结束位置") {
      setEndPos(event.target.value);
    }
    if (event.target.name == "比例") {
      setRatio(event.target.value);
    }
    if (event.target.name == "方式") {
      setMode(event.target.value);
    }
  };

  const onSave = () => {
    onSaveAction({
      名称: "行进",
      角色: name,
      开始位置: startPos,
      结束位置: endPos,
      比例: ratio,
      方式: mode,
    });
    setEdit(false);
  };

  const onDelete = () => {
    onDeleteAction();
    setEdit(false);
  };

  const onCancel = () => {
    setName(action["角色"]);
    setStartPos(action["开始位置"]);
    setEndPos(action["结束位置"]);
    setRatio(action["比例"]);
    setMode(action["方式"]);
    setEdit(false);
  };

  return (
    <Box sx={{ bgcolor: "#aabb44", p: 1 }}>
      <Typography
        variant="h5"
        sx={{
          textAlign: "center",
        }}
        component="div"
      >
        显示
      </Typography>
      <Card
        component="div"
        sx={{
          width: "90%",
          height: 360,
          p: 1,
          m: "auto",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {edit && (
            <>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel>角色</InputLabel>
                <Select
                  name="角色"
                  value={name}
                  onChange={(e) => handleChange(e)}
                  label="角色"
                >
                  {allChars.length > 0 &&
                    allChars.map((cName, i) => {
                      let selected = false;
                      if (name == cName) {
                        selected = true;
                      }
                      return (
                        <MenuItem key={i} selected={selected} value={cName}>
                          {cName}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
              <br></br>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel>开始位置</InputLabel>
                <Input
                  name="开始位置"
                  size="small"
                  sx={{ width: "200px" }}
                  type="string"
                  onChange={(e) => handleChange(e)}
                  defaultValue={action["开始位置"]}
                />
              </FormControl>
              <br></br>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel>结束位置</InputLabel>
                <Input
                  name="结束位置"
                  size="small"
                  sx={{ width: "200px" }}
                  type="string"
                  onChange={(e) => handleChange(e)}
                  defaultValue={action["结束位置"]}
                />
              </FormControl>
              <br></br>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel>比例</InputLabel>
                <Input
                  name="比例"
                  size="small"
                  sx={{ width: "200px" }}
                  type="string"
                  onChange={(e) => handleChange(e)}
                  defaultValue={action["比例"]}
                />
              </FormControl>
              <br></br>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel>方式</InputLabel>
                <Select
                  name="方式"
                  value={action["方式"]}
                  onChange={(e) => handleChange(e)}
                  label="方式"
                >
                  {["自然", "旋转"].map((m, i) => {
                    let selected = false;
                    if (m == action["方式"]) {
                      selected = true;
                    }
                    return (
                      <MenuItem key={i} selected={selected} value={m}>
                        {m}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <CardActions sx={{ m: 0, p: 0 }}>
                <Button
                  sx={{ m: 0, p: 0 }}
                  variant="text"
                  onClick={() => onSave()}
                >
                  保存
                </Button>
                <Button
                  sx={{ m: 0, p: 0 }}
                  variant="text"
                  onClick={() => onCancel()}
                >
                  取消
                </Button>
              </CardActions>
            </>
          )}
          {!edit && (
            <>
              <Typography
                sx={{ width: 200, p: 1, display: "inline-block" }}
                component="div"
              >
                角色: {action["角色"]}
              </Typography>
              <br></br>
              <Typography
                sx={{ width: 200, p: 1, display: "inline-block" }}
                component="div"
              >
                开始位置:{" "}
                {(Array.isArray(action["开始位置"]) &&
                  action["开始位置"][0] + " : " + action["开始位置"][1]) ||
                  action["开始位置"]}
              </Typography>{" "}
              <br></br>
              <Typography
                sx={{ width: 200, p: 1, display: "inline-block" }}
                component="div"
              >
                结束位置:{" "}
                {(Array.isArray(action["结束位置"]) &&
                  action["结束位置"][0] + " : " + action["结束位置"][1]) ||
                  action["结束位置"]}
              </Typography>{" "}
              <br></br>
              <Typography
                sx={{ width: 200, p: 1, display: "inline-block" }}
                component="div"
              >
                比例:{" "}
                {(Array.isArray(action["比例"]) &&
                  action["比例"][0] + " : " + action["比例"][1]) ||
                  action["比例"]}
              </Typography>{" "}
              <br></br>
              <Typography
                sx={{ width: 200, p: 1, display: "inline-block" }}
                component="div"
              >
                方式: {action["方式"]}
              </Typography>
              <br></br>
              <Button
                sx={{ m: 0, p: 1 }}
                variant="text"
                onClick={() => setEdit(true)}
              >
                编辑
              </Button>
              <Button
                sx={{ m: 0, p: 0 }}
                variant="text"
                onClick={() => onDelete()}
              >
                删除
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
