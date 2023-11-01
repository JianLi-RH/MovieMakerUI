import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import { List, ListItemButton, ListItemText, Collapse } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material/";
import Activity from "./activity";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function Scenario({ scenario }) {
  const [selectedActivity, setSelectedActivity] = React.useState(-1);
  const [activityState, setActivityState] = React.useState(
    Array(scenario["活动"].length).fill(false)
  );
  const handleActivityClick = (index) => {
    const newActivityState = activityState.slice();
    newActivityState[index] = !newActivityState[index];
    setActivityState(newActivityState);
    setSelectedActivity(index);
  };

  return (
    <Box key={scenario["名字"]} sx={{ bgcolor: "#cfe8fc", flexGrow: 1 }}>
      <Grid container spacing={2} rowSpacing={1}>
        <Grid xs={6} spacing={2}>
          <Item>{scenario["焦点"]}</Item>
          <Divider></Divider>
          <Item>{scenario["比例"]}</Item>
        </Grid>
        <Grid xs={6}>
          <Item>
            <Box
              component="img"
              sx={{ width: "200px" }}
              alt="The house from the offer."
              src={scenario["背景"]}
            />
          </Item>
        </Grid>
      </Grid>

      {scenario["活动"].map((activity, i) => (
        <List
          key={activity["名字"] + i}
          sx={{ borderColor: selectedActivity == i ? "#FF0000" : "#000" }}
        >
          <ListItemButton onClick={() => handleActivityClick(i)}>
            <ListItemText
              sx={{ textAlign: "center", fontSize: "0.875rem" }}
              primary={activity["名字"]}
            />
            {activityState[i] ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={activityState[i]} timeout="auto" unmountOnExit>
            <Activity activity={activity}></Activity>
          </Collapse>
          <Divider></Divider>
        </List>
      ))}
    </Box>
  );
}
