import * as React from "react";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
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
  index,
  scenario,
  selectedScript,
  handleDeleteSC,
  onSave,
}) {
  const [sc, setSc] = React.useState(scenario);

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
  function handleSaveScenarioClick(index) {
    onSave(index, sc);
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
    onSave(index, sc);
    setSc(sc);
  }

  function addCharacter() {
    sc["角色"] = [
      ...sc["角色"],
      {
        名字: "",
        素材: "",
        位置: "",
        大小: "",
        显示: "",
        图层: "",
        角度: "",
      },
    ];
    onSave(index, sc);
  }

  function onSaveChar(charIndex, char) {
    let newSC = sc["角色"].map((c, i) => {
      if (i === charIndex) {
        return char;
      }
      return c;
    });
    sc["角色"] = newSC;
    onSave(index, sc);
  }

  function onRemoveChar(charIndex) {
    let newSC = [];
    var l = sc["角色"].length;
    if (l > 1) {
      for (var i = 0; i < l; i++) {
        if (i !== charIndex) {
          newSC.push(sc["角色"][i]);
        }
      }
    }
    sc["角色"] = newSC;
    onSave(index, sc);
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
    <Box
      sx={{
        width: 1,
        marginRight: 0.5,
        my: 1,
        flexGrow: 1,
      }}
    >
      <List>
        <ListItemButton sx={{ bgcolor: "#cfe8fc", border: 1 }}>
          <Delete
            sx={{ width: 40 }}
            onClick={(e) => {
              e.preventDefault();
              handleDeleteSC(index);
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
                  handleSaveScenarioClick(index);
                }}
              ></Save>
              <TextField
                id="outlined-basic"
                label="场景名"
                variant="outlined"
                name="名字"
                onChange={(e) => handleChange(e)}
                defaultValue={sc["名字"]}
              >
                {sc["名字"]}
              </TextField>
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
                  <TextField
                    id="outlined-basic"
                    label="焦点"
                    variant="outlined"
                    name="焦点"
                    onChange={handleChange}
                    defaultValue={sc["焦点"]}
                  >
                    {sc["焦点"]}
                  </TextField>
                  <Divider></Divider>
                  <Typography gutterBottom variant="subtitle2" component="span">
                    比例：
                  </Typography>
                  <TextField
                    id="outlined-basic"
                    label="比例"
                    variant="outlined"
                    name="比例"
                    onChange={handleChange}
                    defaultValue={sc["比例"]}
                  >
                    {sc["比例"]}
                  </TextField>
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
                        onChange={handleChange}
                      />
                    </Button>
                    <Box
                      component="img"
                      sx={{ width: "200px" }}
                      alt="背景"
                      src={"admin/" + sc["背景"]}
                    />
                  </Item>
                </Grid>
              </>
            ) : (
              <>
                <Grid xs={2}>
                  <Box>
                    <Typography
                      gutterBottom
                      variant="subtitle1"
                      component="span"
                    >
                      焦点：
                    </Typography>
                    {sc["焦点"]}
                  </Box>
                  <Divider></Divider>
                  <Box>
                    <Typography
                      gutterBottom
                      variant="subtitle1"
                      component="span"
                    >
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
                    src={"admin/" + sc["背景"]}
                  />
                </Grid>
              </>
            )}
          </Grid>
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
                  i={i}
                  name={char["名字"]}
                  image={char["素材"]}
                  pos={char["位置"]}
                  size={char["大小"]}
                  rotate={char["角度"]}
                  display={char["显示"]}
                  index={char["图层"]}
                  save={onSaveChar}
                  remove={onRemoveChar}
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
                <AddIcon onClick={addCharacter} />
              </Fab>
            </Card>
          </Stack>
          <Box
            sx={{
              border: 1,
            }}
          >
            {sc["活动"] &&
              sc["活动"].map((activity, i) => (
                <Activity
                  key={i}
                  index={i}
                  activity={activity}
                  onSave={updateActivity}
                ></Activity>
              ))}
          </Box>
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
    </Box>
  );
}
