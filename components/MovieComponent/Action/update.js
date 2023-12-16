import * as React from "react";
import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

import resource from "../../../lib/resource";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function UpdateChar({
  action,
  allChars,
  onSaveAction,
  onDeleteAction,
}) {
  const [image, setImage] = useState(null);
  const [name, setName] = useState(action["角色"]["名字"]);

  const [edit, setEdit] = useState(false);

  const handleChange = (event) => {
    setName(event.target.value);
  };

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setImage(i);
    }
  };

  const onSave = () => {
    let c = Object.assign({}, action);
    if (image != null) {
      resource.uploadToServer(image, "action").then((res) => {
        if (res != "") {
          c["角色"]["素材"] = res;
        }
      });
    }
    c["角色"]["名字"] = name;
    onSaveAction(c);
    setEdit(false);
  };

  const onDelete = () => {
    onDeleteAction();
    setEdit(false);
  };

  return (
    <Box sx={{ bgcolor: "#aabb44" }}>
      <Typography
        variant="h5"
        sx={{
          textAlign: "center",
        }}
        component="div"
      >
        更新
      </Typography>
      <Card
        component="div"
        sx={{
          width: 180,
          minWidth: 180,
          height: 380,
          p: 1,
          m: 1,
          alignItems: "flex-start",
          justifyContent: "flex-start",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {edit && (
            <>
              <Button component="label" variant="contained">
                选择角色图片
                <VisuallyHiddenInput
                  name="素材"
                  type="file"
                  onChange={uploadToClient}
                />
              </Button>
              <br></br>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  角色
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={action["角色"]["名字"].trim()}
                  onChange={handleChange}
                  label="角色"
                >
                  {allChars.map((name, i) => {
                    let selected = false;
                    if (name == action["角色"]["名字"]) {
                      selected = true;
                    }
                    return (
                      <MenuItem key={i} selected={selected} value={name}>
                        {name}
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
                  onClick={() => setEdit(false)}
                >
                  取消
                </Button>
              </CardActions>
            </>
          )}
          {!edit && (
            <>
              <CardMedia
                sx={{ height: 160, width: 120, alignItems: "center" }}
                image={action["角色"]["素材"]}
                title={action["角色"]["名字"]}
              />
              <Typography gutterBottom variant="h6" component="div">
                {action["角色"]["名字"]}
              </Typography>
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
