import * as React from "react";
import Button from "@mui/material/Button";
import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import { List, ListItemButton, ListItemText, Collapse } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material/";
import Typography from "@mui/material/Typography";
import { Select, MenuItem } from "@mui/material";
import UpdateChar from "./Action/update";
import FullFeaturedCrudGrid from "components/grid.js";

export default function Activity({ activity, chars, onSave }) {
  const [activityState, setActivityState] = React.useState(false);
  const [action, setAction] = React.useState("--");

  const cNames = chars.map((c) => c["名字"]); // 全部角色名

  const columns = [
    {
      field: "start",
      headerName: "开始时间",
      width: 80,
      editable: true,
      sortable: false,
      filterable: false,
    },
    {
      field: "end",
      headerName: "结束时间",
      width: 80,
      editable: true,
      sortable: false,
      filterable: false,
    },
    {
      field: "text",
      headerName: "文字",
      type: "string",
      width: 200,
      editable: true,
      sortable: false,
      filterable: false,
    },
    {
      field: "sound",
      headerName: "声音",
      width: 150,
      editable: true,
      sortable: false,
      filterable: false,
    },
    {
      field: "char",
      headerName: "角色",
      width: 100,
      type: "singleSelect",
      valueOptions: cNames,
      editable: true,
      sortable: false,
      filterable: false,
    },
    {
      field: "action",
      headerName: "动作",
      width: 100,
      editable: true,
      sortable: false,
      filterable: false,
    },
  ];

  const subtitles =
    activity["字幕"] &&
    activity["字幕"].map((subtitleRow, i) => {
      let v = {
        id: i,
        start: subtitleRow[0],
        end: subtitleRow[1],
        text: subtitleRow[2],
        sound: "",
        char: "",
        action: "",
      };

      if (subtitleRow.length >= 4) {
        v.sound = subtitleRow[3];
      }
      if (subtitleRow.length >= 5) {
        v.char = subtitleRow[4];
      }
      if (subtitleRow.length >= 6) {
        v.action = subtitleRow[5];
      }
      return v;
    });

  // 字幕
  const saveSubtitle = (row) => {
    let newSubtitle = [];
    if (isNaN(row.id)) {
      // 添加一行新字幕
      newSubtitle = [
        ...activity["字幕"],
        [row.start, row.end, row.text, row.sound, row.char, row.action],
      ];
    } else {
      newSubtitle = activity["字幕"].map((subtitleRow, i) => {
        if (i === row.id) {
          return [
            row.start,
            row.end,
            row.text,
            row.sound,
            row.char,
            row.action,
          ];
        }
        return subtitleRow;
      });
    }

    activity["字幕"] = newSubtitle;
    onSave(activity);
  };

  const deleteSubtitle = (id) => {
    let newSubtitle = [];
    for (var i = 0; i < activity["字幕"].length; i++) {
      if (i !== id) {
        newSubtitle.push(activity["字幕"][i]);
      }
    }
    activity["字幕"] = newSubtitle;
    onSave(activity);
  };

  //动作
  const saveAction = (id, newAct) => {
    let act = [];
    for (var i = 0; i < activity["动作"].length; i++) {
      if (i == id) {
        act.push(newAct);
      } else {
        act.push(activity["动作"][i]);
      }
    }

    activity["动作"] = act;
    onSave(activity);
  };

  const deleteAction = (id) => {
    let act = [];
    for (var i = 0; i < activity["动作"].length; i++) {
      if (i !== id) {
        act.push(activity["动作"][i]);
      }
    }
    activity["动作"] = act;
    onSave(activity);
  };

  return (
    <List
      sx={{
        width: 1,
        my: 1,
        bgcolor: "#FFF",
      }}
    >
      <ListItemButton onClick={() => setActivityState(!activityState)}>
        <ListItemText
          sx={{ textAlign: "center", fontSize: "0.875rem" }}
          primary={activity["名字"]}
        />
        {activityState ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={activityState} timeout="auto" unmountOnExit>
        <Table aria-label="simple table">
          <TableBody>
            <TableRow sx={{ "& > *": { border: 1, borderBottom: "unset" } }}>
              <TableCell scope="row">描述</TableCell>
              <TableCell>{activity["描述"]}</TableCell>
            </TableRow>
            <TableRow sx={{ "& > *": { border: 1 } }}>
              <TableCell>背景音乐</TableCell>
              <TableCell align="right">{activity["背景音乐"]}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <FullFeaturedCrudGrid
          columns={columns}
          data={subtitles || []}
          onSave={saveSubtitle}
          enableEdit={true}
          onDelete={deleteSubtitle}
          enableDelete={true}
          showEditToolbar={true}
        ></FullFeaturedCrudGrid>
        <Typography gutterBottom variant="subtitle2" component="span">
          添加动作：
        </Typography>
        <Select
          size="small"
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          onChange={(event) => setAction(event.target.value)}
          value={action}
          label="动作"
        >
          <MenuItem value="--">--</MenuItem>
          <MenuItem value="更新">更新</MenuItem>
          <MenuItem value="显示">显示</MenuItem>
          <MenuItem value="消失">消失</MenuItem>
          <MenuItem value="镜头">镜头</MenuItem>
          <MenuItem value="行进">行进</MenuItem>
          <MenuItem value="转身">转身</MenuItem>
          <MenuItem value="gif">gif</MenuItem>
        </Select>
        <Button>添加新动作</Button>
        {activity["动作"] &&
          activity["动作"].map((action, i) => {
            let name = action["名称"];
            if (name == "更新") {
              return (
                <UpdateChar
                  key={i}
                  action={action}
                  allChars={cNames}
                  onSaveAction={(newAction) => saveAction(i, newAction)}
                  onDeleteAction={() => deleteAction(i)}
                ></UpdateChar>
              );
            } else {
              console.log(`暂不支持该动作 ${action["名称"]}.`);
            }
          })}
        {!activity["动作"] && {}}
      </Collapse>
    </List>
  );
}
