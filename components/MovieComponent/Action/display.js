import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Box } from "@mui/system";
import * as React from "react";

import { Add, Delete } from "@mui/icons-material";

export default function Display({ action }) {
  return (
    <Box>
      <List>
        <ListItemButton>
          <ListItemIcon>
            <Delete />
          </ListItemIcon>
          <ListItemText primary={action["角色"]} />
        </ListItemButton>
      </List>
    </Box>
  );
}
