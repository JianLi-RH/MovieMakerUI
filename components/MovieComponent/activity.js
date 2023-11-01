import * as React from "react";
import Paper from "@mui/material/Paper";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Box } from "@mui/system";
import Display from "./Action/display";
import {
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Typography,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material/";
import Disappear from "./Action/disappear";

function SubTitle(props) {
  const { row } = props;
  return (
    <Table size="small" aria-label="purchases">
      <TableHead>
        <TableRow>
          <TableCell>开始时间</TableCell>
          <TableCell>结束时间</TableCell>
          <TableCell>文字</TableCell>
          <TableCell>语音</TableCell>
          <TableCell>角色</TableCell>
          <TableCell>角色动作</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {row.map((subtitleRow, i) => (
          <TableRow key={i}>
            <TableCell component="th" scope="row">
              {subtitleRow[0]}
            </TableCell>
            <TableCell>{subtitleRow[1]}</TableCell>
            <TableCell>{subtitleRow[2]}</TableCell>
            <TableCell>{subtitleRow[3] ? subtitleRow[3] : ""}</TableCell>
            <TableCell>{subtitleRow[4] ? subtitleRow[4] : ""}</TableCell>
            <TableCell>{subtitleRow[5] ? subtitleRow[5] : ""}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function Activity({ activity }) {
  const [actionState, setActionState] = React.useState(
    Array(activity["动作"] ? activity["动作"].length : 0).fill(false)
  );
  const handleActionClick = (index) => {
    const newActionState = actionState.slice();
    newActionState[index] = !newActionState[index];
    setActionState(newActionState);
  };
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableBody>
          <TableRow sx={{ "& > *": { border: 1, borderBottom: "unset" } }}>
            <TableCell sx={{ minWidth: 100 }} component="th" scope="row">
              描述
            </TableCell>
            <TableCell align="right" colSpan={2}>
              {activity["描述"]}
            </TableCell>
          </TableRow>
          <TableRow sx={{ "& > *": { border: 1, borderBottom: "unset" } }}>
            <TableCell>背景音乐</TableCell>
            <TableCell align="right" colSpan={6}>
              {activity["背景音乐"]}
            </TableCell>
          </TableRow>
          <TableRow sx={{ "& > *": { border: 1, borderBottom: "unset" } }}>
            <TableCell>字幕</TableCell>
            <TableCell sx={{ borderRight: "unset" }}>
              <SubTitle row={activity["字幕"]}></SubTitle>
            </TableCell>
            <TableCell sx={{ borderLeft: "unset" }}>
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="demo-simple-select-label">字幕样式</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={activity.subtitle_mode}
                  label="字幕样式"
                >
                  <MenuItem value="normal">normal</MenuItem>
                  <MenuItem value="bottom">bottom</MenuItem>
                  <MenuItem value="top">top</MenuItem>
                  <MenuItem value="middle">middle</MenuItem>
                  <MenuItem value="list">list</MenuItem>
                </Select>
              </FormControl>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      {activity["动作"] &&
        activity["动作"].map((action, i) => (
          <List key={action["名称"] + i}>
            <ListItemButton onClick={() => handleActionClick(i)}>
              <ListItemText primary={action["名称"]} />
              {actionState[i] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={actionState[i]} timeout="auto" unmountOnExit>
              return ( if (action["名字"] == "显示")
              {<Display action={action}></Display>} else if(action["名字"] ==
              "消失"){<Disappear action={action}></Disappear>})
            </Collapse>
          </List>
        ))}
    </TableContainer>
  );
}
