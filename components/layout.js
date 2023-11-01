import * as React from "react";
import Header from "./header";
import Menu from "./menu";
import Workspace from "./workspace";

import Box from "@mui/material/Box";
import ThemeRegistry from "./ThemeRegistry/ThemeRegistry";
import GlobalConifg from "../pages/app.config";
const DRAWER_WIDTH = GlobalConifg.DRAWER_WIDTH;

export default function Layout({scenarios}) {
  console.log("layout", scenarios)
  return (
    <ThemeRegistry>
      <Header></Header>
      <Menu></Menu>
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
        <Workspace scenarios={scenarios}></Workspace>
      </Box>
    </ThemeRegistry>
  );
}
