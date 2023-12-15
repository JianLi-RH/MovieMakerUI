import * as React from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Scenario from "./MovieComponent/scenario";
import Container from "@mui/material/Container";
import useDownloader from "react-use-downloader";
import { List, ListItemButton, ListItemText } from "@mui/material";
import { AddCircle } from "@mui/icons-material/";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import GlobalConifg from "../pages/app.config";

export default function Workspace({
  scenarios,
  selectedScript,
  handleAddTask,
  handleDeleteSC,
  handleSaveSc,
}) {
  const [downloadDisplay, setDownloadDisplay] = React.useState("none");
  const { size, elapsed, percentage, download, cancel, error, isInProgress } =
    useDownloader();
  const [url, setUrl] = React.useState("");
  const [circle, setCircle] = React.useState("none");

  const makeVideo = async (scenario) => {
    if (sessionStorage.token) {
      setDownloadDisplay("none");
      setCircle("inline-block");
      const body = new FormData();
      body.append("script", selectedScript);
      body.append("scenario", scenario || "");
      await fetch("api/makevideo", {
        method: "POST",
        body,
        headers: { Authorization: sessionStorage.token },
      })
        .then((response) => {
          setCircle("none");
          return response.json();
        })
        .then((data) => {
          if (data.code === 200) {
            setDownloadDisplay("inline");
            setUrl(data.msg);
          } else {
            setDownloadDisplay("none");
          }
        });
    }
  };
  return (
    <Container>
      {scenarios.length > 0 && (
        <Box>
          <Box>
            <Typography
              variant="h5"
              sx={{
                textAlign: "center",
              }}
              component="div"
            >
              {selectedScript}
            </Typography>
            <Box>
              <Button
                onClick={() => {
                  makeVideo();
                }}
              >
                生成视频
              </Button>
              <CircularProgress size="1rem" sx={{ m: 1, display: circle }} />
              <Button
                sx={{ display: downloadDisplay }}
                onClick={() => {
                  download(url, `${selectedScript}.mp4`);
                }}
              >
                下载视频
              </Button>
            </Box>
          </Box>
          {scenarios.map((scenario, i) => (
            <Scenario
              key={i}
              selectedScript={selectedScript}
              scenario={scenario}
              handleDeleteSC={handleDeleteSC}
              onSave={(sc) => handleSaveSc(i, sc)}
            ></Scenario>
          ))}
          <Box
            sx={{
              width: 1,
              marginRight: 0.5,
              my: 1,
            }}
          >
            <List>
              <ListItemButton onClick={handleAddTask}>
                <ListItemText sx={{ textAlign: "center" }}>
                  <AddCircle></AddCircle>
                </ListItemText>
              </ListItemButton>
            </List>
          </Box>
        </Box>
      )}
    </Container>
  );
}
