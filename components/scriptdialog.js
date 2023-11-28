import * as React from "react";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Alert from "@mui/material/Alert";
import Link from "next/link";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function CustomizedDialogs(props) {
  const [script, setScript] = useState(null);
  const [createObjectURL, setCreateObjectURL] = useState(null);
  const [alert, setAlert] = useState({
    display: "none",
    severity: "info",
    message: "",
  });

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      if (i.name.endsWith(".yaml")) {
        setScript(i);
      } else {
        alert("仅支持后缀为.yaml的脚本文件");
      }
    }
  };
  const uploadToServer = async (event) => {
    if (!sessionStorage.token) {
      return;
    }
    const body = new FormData();
    body.append("file", script);
    body.append("length", props.length);
    const result = await fetch("/api/file", {
      method: "POST",
      headers: { Authorization: sessionStorage.token },
      body,
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
    setTimeout(() => {
      setAlert({ display: "none", severity: "info", message: "" });
      props.close();
      props.updateList();
    }, 2000);
  };

  return (
    <BootstrapDialog
      onClose={() => props.close()}
      aria-labelledby="customized-dialog-title"
      open={props.open}
    >
      <Alert style={{ display: alert.display }} severity={alert.severity}>
        {alert.message}
      </Alert>
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        上传脚本文件
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => props.close()}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Typography gutterBottom>
          脚本文件是一个后缀为.yaml的文本文件，其中包含用于生成视频的全部设定，关于如何编写脚本请参考
          <Link target={"_blank"} href={"/help"}>
            帮助文档
          </Link>
          <Link href="/help"></Link>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button component="label" variant="contained">
          选择脚本
          <VisuallyHiddenInput type="file" onChange={uploadToClient} />
        </Button>
        <Button
          component="label"
          variant="contained"
          type="submit"
          startIcon={<CloudUploadIcon />}
          onClick={uploadToServer}
        >
          上传
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
