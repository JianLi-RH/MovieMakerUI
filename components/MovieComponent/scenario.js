import * as React from "react";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import Input from "@mui/material/Input";
import { List, ListItemButton, ListItemText, Collapse } from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Edit,
  Save,
  Cancel,
  Delete,
  CloudUpload,
} from "@mui/icons-material/";
import useDownloader from "react-use-downloader";
import Card from "@mui/material/Card";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

import Activity from "./activity";
import Character from "./character";
import resource from "../../lib/resource";
import CollapseComponent from "../collapsecomponent";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

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

export default function Scenario({
  scenario,
  selectedScript,
  onDeleteScenario,
  onSaveScenario,
}) {
  const [sc, setSc] = React.useState(scenario);
  const [image, setImage] = React.useState(null); //背景图

  // 场景是否展开
  const [scenarioState, setScenarioState] = React.useState(false);

  // 场景是否处于编辑状态
  const [scenarioEditState, setScenarioEditState] = React.useState(false);

  const [downloadDisplay, setDownloadDisplay] = React.useState("none");
  const { size, elapsed, percentage, download, cancel, error, isInProgress } =
    useDownloader();
  const [url, setUrl] = React.useState("");
  const [circle, setCircle] = React.useState("none");

  function handleChange(e) {
    e.preventDefault();
    let _sc = {};
    Object.assign(_sc, sc);
    _sc[e.target.name] = e.target.value;
    setSc(_sc);
  }

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setImage(i);
    }
  };

  async function handleSaveScenarioClick() {
    if (image != null) {
      const res = await resource.uploadToServer(image, `background/${sc["名字"]}`);
      sc["背景"] = res;
    }
    onSaveScenario(sc);
    setScenarioEditState(false);
  }

  function updateActivity(index, activity) {
    let newSC = sc["活动"].map((act, i) => {
      if (i === index) {
        return activity;
      }
      return act;
    });
    sc["活动"] = newSC;
    onSaveScenario(sc);
  }

  function addCharacter() {
    const c = {
      名字: "沙雕",
      素材: "default.png",
      位置: "中心",
      大小: "1",
      显示: "0",
      图层: "0",
      角度: "",
    };
    sc["角色"] = [...sc["角色"], c];
    onSaveScenario(sc);
    let _sc = {};
    Object.assign(_sc, sc);
    setSc(_sc);
  }

  function onSaveChar(index, char) {
    let newSC = sc["角色"].map((c, i) => {
      if (i === index) {
        return char;
      }
      return c;
    });
    sc["角色"] = newSC;
    onSaveScenario(sc);
  }

  function onRemoveChar(index) {
    let newSC = [];
    var l = sc["角色"].length;
    for (var i = 0; i < l; i++) {
      if (i !== index) {
        newSC.push(sc["角色"][i]);
      }
    }
    sc["角色"] = newSC;
    onSaveScenario(sc);
  }

  const makeVideo = async (scenario) => {
    if (sessionStorage.token) {
      setDownloadDisplay("none");
      setCircle("inline-block");
      const body = new FormData();
      body.append("script", selectedScript);
      body.append("scenario", scenario || "");
      await fetch("api/makevideo", {
        method: "POST",
        body,
        headers: { Authorization: sessionStorage.token },
      })
        .then((response) => {
          setCircle("none");
          return response.json();
        })
        .then((data) => {
          if (data.code === 200) {
            setDownloadDisplay("inline");
            setUrl(data.msg);
          } else {
            setDownloadDisplay("none");
          }
        });
    }
  };

  return (
    <List
      sx={{
        width: 1,
        marginRight: 0.5,
        my: 1,
        flexGrow: 1,
      }}
    >
      <ListItemButton sx={{ bgcolor: "#cfe8fc", border: 1 }}>
        <Delete
          sx={{ width: 40 }}
          onClick={() => {
            onDeleteScenario();
          }}
        ></Delete>
        {scenarioEditState ? (
          <>
            <Cancel
              sx={{ width: 40 }}
              onClick={(e) => {
                e.preventDefault();
                setSc(scenario);
                setScenarioEditState(false);
              }}
            ></Cancel>
            <Save
              sx={{ width: 40 }}
              onClick={(e) => {
                e.preventDefault();
                handleSaveScenarioClick();
              }}
            ></Save>
            <Input
              name="场景名"
              size="small"
              sx={{ width: "200px" }}
              type="string"
              onChange={(e) => handleChange(e)}
              defaultValue={sc["名字"]}
            />
          </>
        ) : (
          <>
            <Edit
              sx={{ width: 40 }}
              onClick={(e) => {
                e.preventDefault();
                setScenarioEditState(true);
                setScenarioState(true);
              }}
            ></Edit>
            <ListItemText
              sx={{ textAlign: "center" }}
              primary={sc["名字"]}
              onClick={(e) => {
                e.preventDefault();
                setScenarioState(!scenarioState);
              }}
            ></ListItemText>
          </>
        )}
        {scenarioState ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={scenarioState} timeout="auto" unmountOnExit>
        <Grid
          container
          sx={{
            bgcolor: "#cfe8fc",
          }}
        >
          {scenarioEditState ? (
            <>
              <Grid xs={6} spacing={2}>
                <Typography gutterBottom variant="subtitle2" component="span">
                  焦点：
                </Typography>
                <Input
                  name="焦点"
                  size="small"
                  sx={{ width: "80px" }}
                  type="string"
                  onChange={(e) => handleChange(e)}
                  defaultValue={sc["焦点"]}
                />
                <Divider></Divider>
                <Typography gutterBottom variant="subtitle2" component="span">
                  比例：
                </Typography>
                <Input
                  name="比例"
                  size="small"
                  sx={{ width: "80px" }}
                  type="string"
                  onChange={(e) => handleChange(e)}
                  defaultValue={sc["比例"]}
                />
              </Grid>
              <Grid xs={6}>
                <Item>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUpload />}
                  >
                    背景
                    <VisuallyHiddenInput
                      type="file"
                      name="背景"
                      onChange={uploadToClient}
                    />
                  </Button>
                </Item>
              </Grid>
            </>
          ) : (
            <>
              <Grid xs={2}>
                <Box>
                  <Typography gutterBottom variant="subtitle1" component="span">
                    焦点：
                  </Typography>
                  {sc["焦点"]}
                </Box>
                <Divider></Divider>
                <Box>
                  <Typography gutterBottom variant="subtitle1" component="span">
                    比例：
                  </Typography>
                  {sc["比例"]}
                </Box>
              </Grid>
              <Grid xs={10}>
                <Box
                  component="img"
                  sx={{ width: "200px" }}
                  alt="背景"
                  src={sc["背景"]}
                />
              </Grid>
            </>
          )}
        </Grid>
        <CollapseComponent color="#ABC" title="角色">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 1, md: 1, lg: 1 }}
            sx={{
              maxWidth: "100%",
              width: "100%",
              p: 1,
              bgcolor: "#723342",
              overflow: "visible",
              display: "flex",
              flexDirection: "flex-start",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              flexWrap: "nowrap",
            }}
          >
            {sc["角色"] &&
              sc["角色"].map((char, i) => (
                <Character
                  key={i}
                  name={char["名字"]}
                  image={char["素材"]}
                  pos={char["位置"]}
                  size={char["大小"]}
                  rotate={char["角度"]}
                  display={char["显示"]}
                  index={char["图层"]}
                  save={(char) => onSaveChar(i, char)}
                  remove={() => onRemoveChar(i)}
                ></Character>
              ))}
            <Card
              sx={{
                width: 180,
                minWidth: 180,
                height: 380,
                p: 1,
                m: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Fab
                color="primary"
                aria-label="add"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <AddIcon onClick={() => addCharacter()} />
              </Fab>
            </Card>
          </Stack>
        </CollapseComponent>

        <CollapseComponent color="#ABC" title="活动">
          {sc["活动"] &&
            sc["活动"].map((activity, i) => (
              <Activity
                key={i}
                activity={activity}
                chars={sc["角色"]}
                onSave={(act) => updateActivity(i, act)}
              ></Activity>
            ))}
        </CollapseComponent>

        <Box sx={{ p: 0 }}>
          <Stack sx={{ color: "grey.500" }} spacing={1} direction="row">
            <Button
              onClick={() => {
                setCircle(circle == "none" ? "flex" : "none");
                makeVideo(sc["名字"]);
              }}
            >
              生成视频
            </Button>
            <CircularProgress size="1rem" sx={{ m: 1, display: circle }} />
            <Button
              sx={{ display: downloadDisplay }}
              onClick={() => {
                download(url, `${sc["名字"]}.mp4`);
              }}
            >
              下载视频
            </Button>
          </Stack>
        </Box>
      </Collapse>
    </List>
  );
}
