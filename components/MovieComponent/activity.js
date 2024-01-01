import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import Action from "./Action/action";
import CollapseComponent from "../collapsecomponent";
import FullFeaturedCrudGrid from "components/grid.js";
import { GRID_STRING_COL_DEF, useGridApiContext } from "@mui/x-data-grid";

import GridEditFileCell from "../fileColumn";

export default function Activity({ activity, chars, onSave, onDeleteActivity }) {
  const [act, setAct] = useState([]);
  const [subtitles, setSubtitles] = useState(null);
  const cNames = chars.map((c) => c["名字"]); // 全部角色名

  useEffect(() => {
    setAct(activity);
    setSubtitles(null);
    if (activity["字幕"] != null) {
      const _subtitles = activity["字幕"].map((subtitleRow, i) => {
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
      setSubtitles(_subtitles);
    }
  }, [activity]);

  const fileColumnType = {
    ...GRID_STRING_COL_DEF,
    type: "file",
    resizable: false,
    renderEditCell: (params) => {
      return <GridEditFileCell {...params} />;
    },
  };

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
      ...fileColumnType,
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
      ...fileColumnType,
      editable: true,
      sortable: false,
      filterable: false,
    },
  ];

  // 字幕
  const saveSubtitle = (row) => {
    let newSubtitle = [];
    if (isNaN(row.id)) {
      // 添加一行新字幕
      newSubtitle = [
        ...act["字幕"],
        [row.start, row.end, row.text, row.sound, row.char, row.action],
      ];
    } else {
      newSubtitle = act["字幕"].map((subtitleRow, i) => {
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

    act["字幕"] = newSubtitle;
    onSave(act);
  };

  const deleteSubtitle = (id) => {
    let newSubtitle = [];
    for (var i = 0; i < act["字幕"].length; i++) {
      if (i !== id) {
        newSubtitle.push(act["字幕"][i]);
      }
    }
    act["字幕"] = newSubtitle;
    onSave(act);
  };

  // 保存动作的更新
  const onSaveAction = (actions) => {
    act["动作"] = actions;
    onSave(act);
  };

  return (
    <CollapseComponent color="#ABC" title={activity["名字"]} onDelete={onDeleteActivity}>
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
      <CollapseComponent title="字幕">
        <FullFeaturedCrudGrid
          folder={activity["名字"]}
          columns={columns}
          data={subtitles || []}
          onSave={saveSubtitle}
          enableEdit={true}
          onDelete={deleteSubtitle}
          enableDelete={true}
          showEditToolbar={true}
        ></FullFeaturedCrudGrid>
      </CollapseComponent>
      <CollapseComponent title="动作">
        <Action
          allActions={activity["动作"]}
          allChars={cNames}
          onSaveAction={onSaveAction}
        ></Action>
      </CollapseComponent>
    </CollapseComponent>
  );
}
