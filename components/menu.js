import * as React from "react";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Link from "next/link";

import MovieIcon from "@mui/icons-material/Movie";
import {
  Add,
  Delete,
  CameraAlt,
  ScreenshotMonitor,
  RemoveFromQueue,
  DirectionsRun,
  Gif,
  Loop,
  AutoAwesomeMotion,
  Slideshow,
  Help,
} from "@mui/icons-material";

import GlobalConifg from "../pages/app.config";
const DRAWER_WIDTH = GlobalConifg.DRAWER_WIDTH;

export default function Menu() {
  const [opencj, setOpencj] = React.useState(true);
  const handleCJClick = () => {
    setOpencj(!opencj);
  };

  const [openhd, setOpenhd] = React.useState(true);
  const handleHDClick = () => {
    setOpenhd(!openhd);
  };

  const [opendz, setOpendz] = React.useState(true);
  const handleDZClick = () => {
    setOpendz(!opendz);
  };

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
      <Divider />
      <List
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        <ListItemButton onClick={handleCJClick}>
          <ListItemIcon>
            <MovieIcon />
          </ListItemIcon>
          <ListItemText primary="场景" />
          {opencj ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={opencj} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <Add />
              </ListItemIcon>
              <ListItemText primary="添加场景" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <Delete />
              </ListItemIcon>
              <ListItemText primary="删除场景" />
            </ListItemButton>
          </List>
        </Collapse>
        <ListItemButton onClick={handleHDClick}>
          <ListItemIcon>
            <AutoAwesomeMotion />
          </ListItemIcon>
          <ListItemText primary="活动" />
          {openhd ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openhd} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <Add />
              </ListItemIcon>
              <ListItemText primary="添加活动" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <Delete />
              </ListItemIcon>
              <ListItemText primary="删除活动" />
            </ListItemButton>
          </List>
        </Collapse>
        <ListItemButton onClick={handleDZClick}>
          <ListItemIcon>
            <Slideshow />
          </ListItemIcon>
          <ListItemText primary="动作" />
          {opendz ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={opendz} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <ScreenshotMonitor />
              </ListItemIcon>
              <ListItemText primary="显示" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <RemoveFromQueue />
              </ListItemIcon>
              <ListItemText primary="消失" />
            </ListItemButton>

            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <CameraAlt />
              </ListItemIcon>
              <ListItemText primary="镜头" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <DirectionsRun />
              </ListItemIcon>
              <ListItemText primary="行进" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <Loop />
              </ListItemIcon>
              <ListItemText primary="转身" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <Gif />
              </ListItemIcon>
              <ListItemText primary="GIF" />
            </ListItemButton>
            <Divider />
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <Delete />
              </ListItemIcon>
              <ListItemText primary="删除动作" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
      <Divider sx={{ mt: "auto" }} />
      <List>
        <ListItem key="help" disablePadding>
          <ListItemButton component={Link} to="/help" target="_blank">
            <ListItemIcon>
              <Help />
            </ListItemIcon>
            <ListItemText primary="帮助" ></ListItemText>
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}
