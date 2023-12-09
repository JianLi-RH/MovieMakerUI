import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Input from "@mui/material/Input";
import Switch from "@mui/material/Switch";

const ariaLabel = { "aria-label": "description" };

export default function Character(props) {
  const [edit, setEdit] = React.useState(false);
  const [char, setChar] = React.useState(null);

  const save = () => {
    if (char != null) {
      props.save(props.i, char);
      setEdit(false);
    } else {
      console.log("角色没有修改");
    }
  };

  const remove = () => {
    props.remove(props.i);
  };

  const handleChange = (event) => {
    let c = {
      名字: props.name,
      素材: props.image,
      位置: props.pos,
      大小: props.size,
      显示: props.display,
      图层: props.index,
      角度: props.rotate,
    };
    c[event.target.name] = event.target.value;

    setChar(c);
  };

  return (
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
      <CardMedia
        sx={{ height: 160, width: 120, alignItems: "center" }}
        image={"admin/" + props.image}
        title={props.name}
      />
      <CardContent sx={{ p: 0 }}>
        {edit && (
          <Typography
            variant="body2"
            color="text.secondary"
            component="span"
            size="small"
            sx={{ m: 0, p: 0 }}
          >
            角色名：
            <Input
              name="名字"
              size="small"
              sx={{ width: "80px" }}
              type="string"
              onChange={(e) => handleChange(e)}
              defaultValue={props.name}
              inputProps={ariaLabel}
            />
            <br></br>
            位置：
            <Input
              name="位置"
              size="small"
              sx={{ width: "80px" }}
              type="string"
              onChange={(e) => handleChange(e)}
              defaultValue={
                Array.isArray(props.pos) && props.pos[0] + " : " + props.pos[1]
              }
              inputProps={ariaLabel}
            />
            <br></br>
            大小：
            <Input
              name="大小"
              size="small"
              sx={{ width: "80px" }}
              type="string"
              onChange={(e) => handleChange(e)}
              defaultValue={
                Array.isArray(props.size) &&
                props.size[0] + " : " + props.size[1]
              }
              inputProps={ariaLabel}
            />
            <br></br>
            角度：
            <Input
              name="角度"
              size="small"
              sx={{ width: "80px" }}
              type="string"
              onChange={(e) => handleChange(e)}
              defaultValue={props.rotate}
              inputProps={ariaLabel}
            />
            <br></br>
            图层：
            <Input
              name="图层"
              size="small"
              sx={{ width: "80px" }}
              type="number"
              onChange={(e) => handleChange(e)}
              defaultValue={props.index}
              inputProps={ariaLabel}
            />
            <br></br>
            显示：
            <Switch
              size="small"
              checked={props.display == "是" ? true : false}
              onChange={handleChange}
              inputProps={{ "aria-label": "controlled" }}
            />
            <br></br>
          </Typography>
        )}
        {!edit && (
          <>
            <Typography gutterBottom variant="h6" component="div">
              {props.name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              component="span"
              size="small"
            >
              位置：
              {Array.isArray(props.pos) &&
                props.pos[0] + " : " + props.pos[1]}{" "}
              <br></br>
              大小：
              {Array.isArray(props.size) &&
                props.size[0] + " : " + props.size[1]}
              <br></br>
              角度： {props.rotate} <br></br>
              图层： {props.index} <br></br>
              显示： {props.display} <br></br>
            </Typography>
          </>
        )}
      </CardContent>
      <CardActions sx={{ m: 0, p: 0 }}>
        {edit && (
          <>
            <Button sx={{ m: 0, p: 0 }} variant="text" onClick={() => save()}>
              保存
            </Button>
            <Button
              sx={{ m: 0, p: 0 }}
              variant="text"
              onClick={() => setEdit(false)}
            >
              取消
            </Button>
          </>
        )}

        {!edit && (
          <>
            <Button
              sx={{ m: 0, p: 0 }}
              variant="text"
              onClick={() => setEdit(true)}
            >
              编辑
            </Button>
            <Button sx={{ m: 0, p: 0 }} variant="text" onClick={() => remove()}>
              删除
            </Button>
          </>
        )}
      </CardActions>
    </Card>
  );
}
