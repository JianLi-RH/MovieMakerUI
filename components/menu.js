import * as React from "react";
import { useEffect, useState } from "react";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Link from "next/link";

import { Help, Settings, UploadFile, VideoFile } from "@mui/icons-material";

import GlobalConifg from "../pages/app.config";
import CustomizedDialogs from "../components/scriptdialog";
import LoginForm from "../components/login-form";
const DRAWER_WIDTH = GlobalConifg.DRAWER_WIDTH;

export default function Menu({ scripts, selectScript }) {
  const [openstate, setOpenstate] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [login, setLogin] = useState(false);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
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
      <CustomizedDialogs
        length={scripts.length}
        open={openstate}
        close={() => setOpenstate(false)}
      ></CustomizedDialogs>
      <List sx={{ height: "10px" }}>
        <ListItem>
          <LoginForm />
        </ListItem>
      </List>
      <Divider sx={{ mt: "auto" }} />
      <List
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        {scripts &&
          scripts.map((script, i) => (
            <ListItemButton
              key={i}
              selected={selectedIndex === i}
              onClick={(event) => {
                handleListItemClick(event, i);
                selectScript(script.id);
              }}
            >
              <ListItemIcon>
                <VideoFile />
              </ListItemIcon>
              <ListItemText primary={script.id} />
            </ListItemButton>
          ))}
      </List>
      <Divider sx={{ mt: "auto" }} />
      <List>
        <ListItemButton onClick={() => setOpenstate(true)}>
          <ListItemIcon>
            <UploadFile></UploadFile>
          </ListItemIcon>
          <ListItemText primary="上传脚本" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText primary="配置" />
        </ListItemButton>
        <ListItemButton component={Link} to="/help" target="_blank">
          <ListItemIcon>
            <Help />
          </ListItemIcon>
          <ListItemText primary="帮助"></ListItemText>
        </ListItemButton>
      </List>
    </Drawer>
  );
}
