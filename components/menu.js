import React, { useRef } from "react";
import { useEffect, useState } from "react";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { AddCircle } from "@mui/icons-material/";
import IconButton from "@mui/material/IconButton";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
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
import AccountBox from "./accountBox";
const DRAWER_WIDTH = GlobalConifg.DRAWER_WIDTH;

export default function Menu({
  scripts,
  onSelectScript,
  updateMenuList,
  setting,
  updateAlert,
}) {
  const [openDeleteScript, setOpenDeleteScript] = useState(false);
  const [deleteScriptName, setDeleteScriptName] = useState("");
  const [addSCDislogopen, setAddSCDislogopen] = React.useState(false);
  let ref = useRef();

  const [openstate, setOpenstate] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [login, setLogin] = useState(false);
  useEffect(() => {
    // Perform localStorage action
    if (sessionStorage.token) {
      fetch("/api/auth", {
        method: "GET",
        headers: { Authorization: sessionStorage.token },
      })
        .then((data) => {
          return data.json();
        })
        .then(function (jsonStr) {
          if (jsonStr.code === 200) {
            setLogin(true);
          } else {
            sessionStorage.removeItem("token");
            setLogin(false);
          }
        });
    } else {
      setLogin(false);
    }
  }, []);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const handleAddNewSC = async () => {
    if (sessionStorage.token) {
      const name = ref.current.value;
      console.log("name: ", name);
      if (name == null || name == undefined) {
        return;
      }
      const response = await fetch("/api/file?name=" + name, {
        method: "PUT",
        headers: { Authorization: sessionStorage.token },
      });
      const res = await response.json();
      if (res.code === 200) {
        updateAlert({
          display: "flex",
          severity: "success",
          message: res.msg,
        });
      } else {
        updateAlert({
          display: "flex",
          severity: "error",
          message: res.msg,
        });
      }
      setAddSCDislogopen(false);
      updateMenuList();
    }
  };

  const deleteScript = (script) => {
    setDeleteScriptName(script);
    setOpenDeleteScript(true);
  };

  const confirmDelete = async (name) => {
    if (sessionStorage.token) {
      const response = await fetch(`/api/file?file=${name}`, {
        method: "DELETE",
        headers: { Authorization: sessionStorage.token },
      });
      const res = await response.json();
      if (res.code === 200) {
        updateAlert({
          display: "flex",
          severity: "success",
          message: res.msg,
        });
      } else {
        updateAlert({
          display: "flex",
          severity: "error",
          message: res.msg,
        });
      }
    }
    setOpenDeleteScript(false);
    updateMenuList();
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
        <DialogTitle>删除脚本 - {deleteScriptName.id}</DialogTitle>
        <DialogContent dividers>
          删除脚本将会清空全部视频内容，删除后无法恢复，确认要删除脚本吗？
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
      {/* 上传脚本 */}
      <CustomizedDialogs
        length={scripts.length}
        open={openstate}
        updateList={() => updateMenuList()}
        close={() => setOpenstate(false)}
        updateAlert={updateAlert}
      ></CustomizedDialogs>
      <Dialog
        name="newscript"
        open={addSCDislogopen}
        onClose={() => setAddSCDislogopen(false)}
      >
        <DialogTitle>创建新脚本</DialogTitle>
        <DialogContent>
          <DialogContentText>
            脚本名将被用于展示在菜单列表中，且不能修改，请谨慎填写。
          </DialogContentText>
          <input
            name="name"
            size="small"
            sx={{ width: "200px" }}
            type="string"
            ref={ref}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddSCDislogopen(false)}>取消</Button>
          <Button onClick={() => handleAddNewSC()}>保存</Button>
        </DialogActions>
      </Dialog>
      <AccountBox
        updateList={() => updateMenuList()}
        updateLogin={(status) => setLogin(status)}
        updateAlert={updateAlert}
      />
      <Divider sx={{ mt: "10px" }} />
      <List
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        {scripts.length > 0 &&
          login &&
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
                  onSelectScript(script.id);
                }}
              >
                <ListItemIcon>
                  <VideoFile />
                </ListItemIcon>
                <ListItemText primary={script.id} />
              </ListItemButton>
            </ListItem>
          ))}
        {scripts.length < 3 && login && (
          <ListItem>
            <ListItemButton onClick={() => setAddSCDislogopen(true)}>
              <ListItemText sx={{ textAlign: "center" }}>
                <AddCircle></AddCircle>
              </ListItemText>
            </ListItemButton>
          </ListItem>
        )}
      </List>
      <Divider sx={{ mt: "auto" }} />
      <List>
        {login && (
          <>
            <ListItemButton onClick={() => setOpenstate(true)}>
              <ListItemIcon>
                <UploadFile></UploadFile>
              </ListItemIcon>
              <ListItemText primary="上传脚本" />
            </ListItemButton>
            <ListItemButton onClick={setting}>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText primary="配置" />
            </ListItemButton>
          </>
        )}
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
