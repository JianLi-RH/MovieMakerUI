import * as React from "react";
import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import Display from "./Action/display";
import { List, ListItemButton, ListItemText, Collapse } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material/";
import Disappear from "./Action/disappear";
import FullFeaturedCrudGrid from "components/grid.js";

export default function Activity({ index, activity, onSave }) {
  const [activityState, setActivityState] = React.useState(false);

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
      type: 'string',
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
      width: 50,
      type: 'singleSelect',
      valueOptions: ['ws', 'xe'],
      editable: true,
      sortable: false,
      filterable: false,
    },
    {
      field: "action",
      headerName: "动作",
      width: 50,
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

  const saveSubtitle = (row) => {
    let newSubtitle = [];
    if (isNaN(row.id)) {
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
    onSave(index, activity);
  };

  const deleteSubtitle = (id) => {
    let newSubtitle = [];
    for (var i = 0; i < activity["字幕"].length; i++) {
      if (i !== id) {
        newSubtitle.push(activity["字幕"][i]);
      }
    }
    activity["字幕"] = newSubtitle;
    onSave(index, activity);
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

        {/* {activity["动作"] &&
          activity["动作"].map((action, i) => (
            <List key={action["名称"] + i} index={i}>
              <ListItemButton onClick={() => handleActionClick(i)}>
                <ListItemText primary={action["名称"]} />
              </ListItemButton>
              <Collapse in={false} timeout="auto" unmountOnExit>
                return ( if (action["名字"] == "显示")
                {<Display action={action}></Display>} else if(action["名字"] ==
                "消失"){<Disappear action={action}></Disappear>})
              </Collapse>
            </List>
          ))} */}
      </Collapse>
    </List>
  );
}
