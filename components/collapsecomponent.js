import * as React from "react";
import { List, ListItemButton, ListItemText, Collapse } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material/";

export default function CollapseComponent({ title, color, children }) {
  const [open, setOpen] = React.useState(false);

  return (
    <List
      sx={{
        width: 1,
        my: 1,
      }}
    >
      <ListItemButton
        sx={{
          bgcolor: color,
        }}
        onClick={() => setOpen(!open)}
      >
        <ListItemText
          sx={{ textAlign: "center", fontSize: "0.875rem" }}
          primary={title}
        />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {children}
      </Collapse>
    </List>
  );
}
