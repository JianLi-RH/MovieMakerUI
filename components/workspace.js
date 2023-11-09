import * as React from "react";
import Box from "@mui/material/Box";
import Scenario from "./MovieComponent/scenario";
import Container from "@mui/material/Container";
import { List, ListItemButton, ListItemText } from "@mui/material";
import { AddCircle } from "@mui/icons-material/";

import GlobalConifg from "../pages/app.config";

export default function Workspace({
  scenarios,
  onAddTask,
  onChangeTask,
  onDeleteTask,
}) {
  return (
    <Container>
      {scenarios.map((scenario, i) => (
        <Scenario
          key={scenario["名字"] + i}
          index={i}
          scenario={scenario}
          onChangeTask={onChangeTask}
          onDeleteTask={onDeleteTask}
        ></Scenario>
      ))}
      <Box
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
