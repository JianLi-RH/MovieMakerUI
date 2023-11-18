import * as React from "react";
import { useEffect, useState } from "react";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import Alert from "@mui/material/Alert";
import Link from "next/link";

import {
  Clear,
  Help,
  Settings,
  UploadFile,
  VideoFile,
} from "@mui/icons-material";

import GlobalConifg from "../pages/app.config";
import CustomizedDialogs from "../components/scriptdialog";
import LoginForm from "../components/login-form";
const DRAWER_WIDTH = GlobalConifg.DRAWER_WIDTH;

export default function Menu({ scripts, selectScript, updateList }) {
  const [openDeleteScript, setOpenDeleteScript] = useState(false);
  const [deleteScriptName, setDeleteScriptName] = useState("");
  const [alert, setAlert] = useState({
    display: "none",
    severity: "info",
    message: "",
  });

  const [openstate, setOpenstate] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [login, setLogin] = useState(false);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const deleteScript = (script) => {
    console.log("script: ", script);
    setDeleteScriptName(script);
    setOpenDeleteScript(true);
  };

  const confirmDelete = async (script) => {
    const result = await fetch("/api/file?file=" + script, {
      method: "DELETE",
    })
      .then((data) => {
        return data.json();
      })
      .then((res) => {
        return res;
      })
      .then(function (jsonStr) {
        if (jsonStr.code === 200) {
          return {
            display: "flex",
            severity: "success",
            message: jsonStr.msg,
          };
        } else {
          return {
            display: "flex",
            severity: "error",
            message: jsonStr.msg,
          };
        }
      });
    setAlert(result);
    setTimeout(() => {
      setAlert({ display: "none", severity: "info", message: "" });
      setOpenDeleteScript(false);
      updateList();
    }, 2000);
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
      <Dialog
        sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
        maxWidth="xs"
        open={openDeleteScript}
      >
        <Alert style={{ display: alert.display }} severity={alert.severity}>
          {alert.message}
        </Alert>
        <DialogTitle>删除脚本 - {deleteScriptName.id}</DialogTitle>
        <DialogContent dividers>
          删除脚本将会清空全部视频内容，删除后无法恢复，却恶人要删除脚本吗？
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setOpenDeleteScript(false)}>
            取消
          </Button>
          <Button onClick={() => confirmDelete(deleteScriptName.id)}>
            确认
          </Button>
        </DialogActions>
      </Dialog>
      <CustomizedDialogs
        length={scripts.length}
        open={openstate}
        updateList={updateList}
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
        {(scripts.length > 0 &&
          scripts.map((script, i) => (
            <ListItem
              key={i}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="clear"
                  onClick={() => deleteScript(script)}
                >
                  <Clear />
                </IconButton>
              }
              disablePadding
            >
              <ListItemButton
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
            </ListItem>
          )) || (
          <ListItem>
            <ListItemText primary="开始工作前请先上传脚本" />
          </ListItem>
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
