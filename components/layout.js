import * as React from "react";
import Header from "./header";
import Menu from "./menu";

import Box from "@mui/material/Box";
import ThemeRegistry from "./ThemeRegistry/ThemeRegistry";
import GlobalConifg from "../pages/app.config";
const DRAWER_WIDTH = GlobalConifg.DRAWER_WIDTH;

export default function Layout({ scripts, selectScript, updateMenuList, setting, children }) {
  return (
    <ThemeRegistry>
      <Header></Header>
      <Menu scripts={scripts} selectScript={selectScript} updateMenuList={updateMenuList} setting={setting}></Menu>
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
  );
}
