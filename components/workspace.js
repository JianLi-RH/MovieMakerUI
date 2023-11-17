import * as React from "react";
import Box from "@mui/material/Box";
import Scenario from "./MovieComponent/scenario";
import Container from "@mui/material/Container";
import { List, ListItemButton, ListItemText } from "@mui/material";
import { AddCircle } from "@mui/icons-material/";

import GlobalConifg from "../pages/app.config";

export default function Workspace({
  scenarios,
  selectedScript,
  handleAddTask,
  handleDeleteTask,
  handleSaveSc,
}) {
  return (
    <Container>
      {scenarios &&
        scenarios.map((scenario, i) => (
          <Scenario
            key={scenario["名字"] + i}
            index={i}
            scenario={scenario}
            onDeleteTask={handleDeleteTask}
            onSave={handleSaveSc}
          ></Scenario>
        ))}
      {selectedScript && (
        <Box
          sx={{
            width: 1,
            marginRight: 0.5,
            my: 1,
          }}
        >
          <List>
            <ListItemButton onClick={handleAddTask}>
              <ListItemText sx={{ textAlign: "center" }}>
                <AddCircle></AddCircle>
              </ListItemText>
            </ListItemButton>
          </List>
        </Box>
      )}
    </Container>
  );
}
