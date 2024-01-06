import * as React from "react";
import { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import ThemeRegistry from "./ThemeRegistry/ThemeRegistry";
import GlobalConifg from "../pages/app.config";
import Header from "./header";
import Menu from "./menu";

const DRAWER_WIDTH = GlobalConifg.DRAWER_WIDTH;

export default function Layout({
  scripts,
  onSelectScript,
  updateMenuList,
  setting,
  children,
}) {
  const [alert, setAlert] = useState({
    display: "none",
    severity: "info",
    message: "",
  });
  const updateAlert = (alert) => {
    if (alert != null && alert != undefined) {
      setAlert(alert);
    }

    setTimeout(() => {
      setAlert({ display: "none", severity: "info", message: "" });
    }, 1000);
  };
  return (
    <Box>
      <ThemeRegistry>
        <Header>
          <Alert style={{ display: alert.display }} severity={alert.severity}>
            {alert.message}
          </Alert>
        </Header>
        <Menu
          scripts={scripts}
          onSelectScript={(scriptName) => onSelectScript(scriptName)}
          updateMenuList={() => updateMenuList()}
          setting={setting}
          updateAlert={(alert) => updateAlert(alert)}
        ></Menu>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "background.default",
            ml: `${DRAWER_WIDTH}px`,
            mt: ["48px", "56px", "64px"],
            p: 3,
          }}
        >
          {children}
        </Box>
      </ThemeRegistry>
    </Box>
  );
}
