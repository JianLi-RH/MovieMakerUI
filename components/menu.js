import * as React from "react";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Link from "next/link";

import { Help, Settings } from "@mui/icons-material";

import GlobalConifg from "../pages/app.config";
const DRAWER_WIDTH = GlobalConifg.DRAWER_WIDTH;

export default function Menu() {
  return (
    <Drawer
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          top: ["48px", "56px", "64px"],
          height: "auto",
          bottom: 0,
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Divider sx={{ mt: "auto" }} />
      <List>
        <ListItem key="setting" disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="配置" />
          </ListItemButton>
        </ListItem>
        <ListItem key="help" disablePadding>
          <ListItemButton component={Link} to="/help" target="_blank">
            <ListItemIcon>
              <Help />
            </ListItemIcon>
            <ListItemText primary="帮助"></ListItemText>
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}
