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
import Input from "@mui/material/Input";
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
import LoginForm from "../components/login-form";
import LogoutForm from "./logout-form";
const DRAWER_WIDTH = GlobalConifg.DRAWER_WIDTH;

export default function Menu({ scripts, selectScript, updateList, setting }) {
  const [openDeleteScript, setOpenDeleteScript] = useState(false);
  const [deleteScriptName, setDeleteScriptName] = useState("");
  const [addSCDislogopen, setAddSCDislogopen] = React.useState(false);
  let ref = useRef();
  const [alert, setAlert] = useState({
    display: "none",
    severity: "info",
    message: "",
  });

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

  const addNewScript = () => {
    setAddSCDislogopen(true);
  };
  const handleAddNewSCDialogClose = () => {
    setAddSCDislogopen(false);
  };

  const handleAddNewSC = () => {
    if (sessionStorage.token) {
      const name = ref.current.value;
      console.log("name: ", name);
      if (name == null || name == undefined) {
        return;
      }
      const result = fetch("/api/file?name=" + name, {
        method: "PUT",
        headers: { Authorization: sessionStorage.token },
      });
      // .then((data) => {
      //   return data.json();
      // })
      // .then((res) => {
      //   return res;
      // })
      // .then(function (jsonStr) {
      //   if (jsonStr.code === 200) {
      //     return {
      //       display: "flex",
      //       severity: "success",
      //       message: jsonStr.msg,
      //     };
      //   } else {
      //     return {
      //       display: "flex",
      //       severity: "error",
      //       message: jsonStr.msg,
      //     };
      //   }
      // });
      setAlert(result);
    } else {
      setAlert({ display: "flex", severity: "error", message: "请先登录" });
    }
  };

  const deleteScript = (script) => {
    setDeleteScriptName(script);
    setOpenDeleteScript(true);
  };

  const confirmDelete = async (name) => {
    if (sessionStorage.token) {
      const result = await fetch("/api/file?file=" + name, {
        method: "DELETE",
        headers: { Authorization: sessionStorage.token },
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
    } else {
      setAlert({ display: "flex", severity: "error", message: "请先登录" });
    }

    setTimeout(() => {
      setAlert({ display: "none", severity: "info", message: "" });
      setOpenDeleteScript(false);
      updateList();
    }, 1000);
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
      <CustomizedDialogs
        length={scripts.length}
        open={openstate}
        updateList={updateList}
        close={() => setOpenstate(false)}
      ></CustomizedDialogs>
      <Dialog
        name="newscript"
        open={addSCDislogopen}
        onClose={handleAddNewSCDialogClose}
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
          <Button onClick={handleAddNewSCDialogClose}>取消</Button>
          <Button onClick={handleAddNewSC}>保存</Button>
        </DialogActions>
      </Dialog>
      <List sx={{ height: "10px" }}>
        <ListItem>
          {(login && (
            <LogoutForm
              updateList={updateList}
              updateLogin={() => setLogin(false)}
            ></LogoutForm>
          )) || (
            <LoginForm
              updateList={updateList}
              updateLogin={() => setLogin(true)}
            />
          )}
        </ListItem>
      </List>
      <Divider sx={{ mt: "200px" }} />
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
          ))) || (
          <ListItem>
            <ListItemText primary="开始工作前请先上传脚本" />
          </ListItem>
        )}
        {scripts.length < 3  && (
          <ListItem>
            <ListItemButton onClick={addNewScript}>
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
