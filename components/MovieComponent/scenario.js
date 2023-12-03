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

import Activity from "./activity";

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
  const [sc, setSC] = React.useState(scenario);

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
    setSC(_sc);
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
    setSC(sc);
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
                  setSC(scenario);
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
                      src={sc["背景"]}
                    />
                  </Item>
                </Grid>
              </>
            ) : (
              <>
                <Grid xs={2}>
                  <Box>{sc["焦点"]}</Box>
                  <Divider></Divider>
                  <Box>{sc["比例"]}</Box>
                </Grid>
                <Grid xs={10}>
                  <Box
                    component="img"
                    sx={{ width: "200px" }}
                    alt="The house from the offer."
                    src={sc["背景"]}
                  />
                </Grid>
              </>
            )}
          </Grid>
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
