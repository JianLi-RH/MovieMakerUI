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
  handleDeleteSC,
  handleSaveSc,
}) {
  return (
    <Container>
      {scenarios.length > 0 && (
        <Box>
          {scenarios.map((scenario, i) => (
            <Scenario
              key={i}
              index={i}
              selectedScript={selectedScript}
              scenario={scenario}
              handleDeleteSC={handleDeleteSC}
              onSave={handleSaveSc}
            ></Scenario>
          ))}
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
        </Box>
      )}
    </Container>
  );
}
