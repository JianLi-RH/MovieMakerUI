import * as React from "react";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import Activity from "./activity";
import TextField from "@mui/material/TextField";
import {
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Collapse,
} from "@mui/material";
import {
  AddCircle,
  ExpandLess,
  ExpandMore,
  Edit,
  Save,
  Cancel,
  Delete,
  CloudUpload,
} from "@mui/icons-material/";

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
  onChangeTask,
  onDeleteTask,
  onSaveTask,
}) {
  let sc = {};
  Object.assign(scenario, sc);

  const [selectedActivity, setSelectedActivity] = React.useState(-1);
  const [activityState, setActivityState] = React.useState(
    Array(scenario["活动"] ? scenario["活动"].length : 0).fill(false)
  );
  const handleActivityClick = (index) => {
    const newActivityState = activityState.slice();
    newActivityState[index] = !newActivityState[index];
    setActivityState(newActivityState);
  };

  // 场景是否展开
  const [scenarioState, setScenarioState] = React.useState(false);

  // 场景是否处于编辑状态
  const [scenarioEditState, setScenarioEditState] = React.useState(false);

  const [circle, setCircle] = React.useState("none");
  const makeVideo = (scenario) => {
    setCircle(circle == "none" ? "flex" : "none");
  };

  function handleChange(e, path) {
    sc[path] = e.target.value;
  }
  function handleSaveScenarioClick() {
    onSaveTask()
  }

  return (
    <Box
      key={scenario["名字"]}
      sx={{
        width: 1,
        marginRight: 0.5,
        my: 1,
        bgcolor: "#cfe8fc",
        flexGrow: 1,
      }}
    >
      <List key={scenario["名字"]}>
        <ListItemButton>
          <Delete
            sx={{ width: 40 }}
            onClick={(e) => {
              e.preventDefault();
              onDeleteTask(scenario["名字"]);
            }}
          ></Delete>
          {scenarioEditState ? (
            <>
              <Cancel
                sx={{ width: 40 }}
                onClick={(e) => {
                  e.preventDefault();
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
              <TextField
                id="outlined-basic"
                label="场景名"
                variant="outlined"
                onChange={(e) => handleChange(e, "名字")}
                defaultValue={scenario["名字"]}
              >
                {scenario["名字"]}
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
                primary={scenario["名字"]}
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
              bgcolor: "#FFF",
            }}
          >
            {scenarioEditState ? (
              <>
                <Grid xs={6} spacing={2}>
                  <TextField
                    id="outlined-basic"
                    label="焦点"
                    variant="outlined"
                    onChange={(e) => handleChange(e, "焦点")}
                    defaultValue={scenario["焦点"]}
                  >
                    {scenario["焦点"]}
                  </TextField>
                  <Divider></Divider>
                  <TextField
                    id="outlined-basic"
                    label="比例"
                    variant="outlined"
                    onChange={(e) => handleChange(e, "比例")}
                    defaultValue={scenario["比例"]}
                  >
                    {scenario["比例"]}
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
                      <VisuallyHiddenInput type="file" onChange={(e) => handleChange(e, "背景")} />
                    </Button>
                    <Box
                      component="img"
                      sx={{ width: "200px" }}
                      alt="背景"
                      src={scenario["背景"]}
                    />
                  </Item>
                </Grid>
              </>
            ) : (
              <>
                <Grid xs={6} spacing={2}>
                  <Item>{scenario["焦点"]}</Item>
                  <Divider></Divider>
                  <Item>{scenario["比例"]}</Item>
                </Grid>
                <Grid xs={6}>
                  <Box
                    component="img"
                    sx={{ width: "200px" }}
                    alt="The house from the offer."
                    src={scenario["背景"]}
                  />
                </Grid>
              </>
            )}
          </Grid>

          {scenario["活动"] &&
            scenario["活动"].map((activity, i) => (
              <List
                key={activity["名字"] + i}
                sx={{
                  borderColor: selectedActivity == i ? "#FF0000" : "#000",
                  bgcolor: "#ebe8ac",
                }}
              >
                <ListItemButton onClick={() => handleActivityClick(i)}>
                  <ListItemText
                    sx={{ textAlign: "center", fontSize: "0.875rem" }}
                    primary={activity["名字"]}
                  />
                  {activityState[i] ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={activityState[i]} timeout="auto" unmountOnExit>
                  <Activity activity={activity}></Activity>
                </Collapse>
                <Divider></Divider>
              </List>
            ))}
          <Stack spacing={2} direction="row">
            <Button
              variant="outlined"
              onClick={() => makeVideo(scenario["名字"])}
            >
              生成视频
            </Button>
            <CircularProgress sx={{ display: circle }} />
          </Stack>
        </Collapse>
      </List>
    </Box>
  );
}
