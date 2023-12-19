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

export default function Turn({
  action,
  allChars,
  onSaveAction,
  onDeleteAction,
}) {
  const [name, setName] = useState(action["角色"]);
  const [degree, setDegree] = useState(action["度数"]);
  const [edit, setEdit] = useState(false);

  const handleChange = (event) => {
    if (event.target.name == "角色") {
      setName(event.target.value);
    }
    if (event.target.name == "度数") {
      setDegree(event.target.value);
    }
  };

  const onSave = () => {
    onSaveAction({ 名称: "转身", 角色: name, 度数: degree });
    setEdit(false);
  };

  const onDelete = () => {
    onDeleteAction();
    setEdit(false);
  };

  const onCancel = () => {
    setName(action["角色"]);
    setDegree(action["度数"]);
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
        转身
      </Typography>
      <Card
        component="div"
        sx={{
          width: "90%",
          height: 140,
          p: 1,
          m: "auto",
          alignItems: "flex-start",
          justifyContent: "flex-start",
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
                <Input
                  name="度数"
                  size="small"
                  sx={{ width: "200px" }}
                  type="string"
                  onChange={(e) => handleChange(e)}
                  defaultValue={action["度数"]}
                />
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
              <Typography
                sx={{ width: 200, display: "inline-block" }}
                component="div"
              >
                度数:{" "}
                {(Array.isArray(action["度数"]) &&
                  action["度数"][0] + " : " + action["度数"][1]) ||
                  action["度数"]}
              </Typography>{" "}
              <br></br>
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
