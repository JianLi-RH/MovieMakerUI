import * as React from "react";
import Box from "@mui/material/Box";
import Scenario from "./MovieComponent/scenario";
import Container from "@mui/material/Container";
import { List, ListItemButton, ListItemText, Collapse } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material/";

import GlobalConifg from "../pages/app.config";

export default function Workspace({ scenarios }) {
  const [selectedScenario, setSelectedScenario] = React.useState(-1);

  const [scenarioState, setScenarioState] = React.useState(
    Array(scenarios.length).fill(false)
  );
  const handleScenarioClick = (index) => {
    const newScenarioState = scenarioState.slice();
    newScenarioState[index] = !newScenarioState[index];
    setScenarioState(newScenarioState);
    setSelectedScenario(index);
  };

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
          <List
            key={scenario["名字"] + i}
            sx={{ border: selectedScenario == i ? "solid" : "0px" }}
          >
            <ListItemButton onClick={() => handleScenarioClick(i)}>
              <ListItemText
                sx={{ textAlign: "center" }}
                primary={scenario["名字"]}
              />
              {scenarioState[i] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={scenarioState[i]} timeout="auto" unmountOnExit>
              <Scenario key={scenario["名字"]} scenario={scenario}></Scenario>
            </Collapse>
          </List>
        </Box>
      ))}
    </Container>
  );
}
