import * as React from "react";
import Box from "@mui/material/Box";
import Scenario from "./MovieComponent/scenario";
import Container from "@mui/material/Container";
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
  ButtonGroup,
  IconButton,
} from "@mui/icons-material/";

import GlobalConifg from "../pages/app.config";

export default function Workspace({
  scenarios,
  onAddTask,
  onChangeTask,
  onDeleteTask,
}) {
  // 场景是否展开
  const [scenarioState, setScenarioState] = React.useState(
    Array(scenarios.length).fill(false)
  );

  function handleScenarioClick(index) {
    let newScenarioState = scenarioState.slice();
    newScenarioState[index] = !newScenarioState[index];
    setScenarioState(newScenarioState);
  }

  // 场景是否处于编辑状态
  const [scenarioEditState, setScenarioEditState] = React.useState(
    Array(scenarios.length).fill(false)
  );

  function handleEditScenarioClick(index) {
    let newScenarioState = scenarioState.slice();
    newScenarioState[index] = true;
    setScenarioState(newScenarioState);

    let newSCEditState = scenarioEditState.slice();
    newSCEditState[index] = true;
    setScenarioEditState(newSCEditState);
  }

  function handleCancelScenarioClick(index) {
    let newSCEditState = scenarioEditState.slice();
    newSCEditState[index] = false;
    setScenarioEditState(newSCEditState);
  }

  function handleSaveScenarioClick() {}

  return (
    <Container>
      {scenarios.map((scenario, i) => (
        <Box
          key={scenario["名字"] + i}
          sx={{
            width: 1,
            marginRight: 0.5,
            my: 5,
            backgroundColor: i % 2 == 0 ? "#CC9999" : "#9999CC",
          }}
        >
          <List key={scenario["名字"] + i}>
            <ListItemButton>
              <Delete
                sx={{ width: 40 }}
                onClick={(e) => {
                  e.preventDefault();
                  onDeleteTask(scenario["名字"]);
                }}
              ></Delete>
              {scenarioEditState[i] ? (
                <>
                  <Cancel
                    sx={{ width: 40 }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleCancelScenarioClick(i);
                    }}
                  ></Cancel>
                  <Save
                    sx={{ width: 40 }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSaveScenarioClick(i);
                    }}
                  ></Save>
                </>
              ) : (
                <Edit
                  sx={{ width: 40 }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleEditScenarioClick(i);
                  }}
                ></Edit>
              )}
              {scenarioEditState[i] ? (
                <TextField
                  id="outlined-basic"
                  label="场景名"
                  variant="outlined"
                  defaultValue={scenario["名字"]}
                >
                  {scenario["名字"]}
                </TextField>
              ) : (
                <ListItemText
                  sx={{ textAlign: "center" }}
                  primary={scenario["名字"]}
                  onClick={() => handleScenarioClick(i)}
                ></ListItemText>
              )}
              {scenarioState[i] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={scenarioState[i]} timeout="auto" unmountOnExit>
              <Scenario key={scenario["名字"]} scenario={scenario}></Scenario>
            </Collapse>
          </List>
        </Box>
      ))}
      <Box
        key="addScenario"
        sx={{
          width: 1,
          marginRight: 0.5,
          my: 5,
        }}
      >
        <List>
          <ListItemButton onClick={onAddTask}>
            <ListItemText sx={{ textAlign: "center" }}>
              <AddCircle></AddCircle>
            </ListItemText>
          </ListItemButton>
        </List>
      </Box>
    </Container>
  );
}
