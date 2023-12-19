import * as React from "react";
import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";

export default function Camera({ action, onSaveAction, onDeleteAction }) {
  const [focus, setFocus] = useState(action["焦点"]);
  const [change, setChange] = useState(action["变化"]);
  const [edit, setEdit] = useState(false);

  const handleChange = (event) => {
    if (event.target.name == "焦点") {
      setFocus(event.target.value);
    }
    if (event.target.name == "变化") {
      setChange(event.target.value);
    }
  };

  const onSave = () => {
    onSaveAction({ 名称: "镜头", 焦点: focus, 变化: change });
    setEdit(false);
  };

  const onDelete = () => {
    onDeleteAction();
    setEdit(false);
  };

  const onCancel = () => {
    setFocus(action["焦点"]);
    setChange(action["变化"]);
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
        镜头
      </Typography>
      <Card
        component="div"
        sx={{
          width: "90%",
          height: 120,
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
                <Input
                  name="焦点"
                  size="small"
                  sx={{ width: "200px" }}
                  type="string"
                  onChange={(e) => handleChange(e)}
                  defaultValue={action["焦点"]}
                />
                <Input
                  name="变化"
                  size="small"
                  sx={{ width: "200px" }}
                  type="string"
                  onChange={(e) => handleChange(e)}
                  defaultValue={action["变化"]}
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
              <InputLabel>
                焦点:{" "}
                {(Array.isArray(action["焦点"]) &&
                  action["焦点"][0] + " : " + action["焦点"][1]) ||
                  action["焦点"]}
              </InputLabel>
              <InputLabel>
                变化:{" "}
                {(Array.isArray(action["变化"]) &&
                  action["变化"][0] + " : " + action["变化"][1]) ||
                  action["变化"]}
              </InputLabel>
              <br></br>
              <Button
                sx={{ m: 0, p: 0 }}
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
