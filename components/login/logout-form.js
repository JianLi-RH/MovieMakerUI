import { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import styles from "./login-form.module.css";
import Alert from "@mui/material/Alert";

export default function LogoutForm({ updateList, updateLogin }) {
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState({
    display: "none",
    severity: "info",
    message: "",
  });

  useEffect(() => {
    fetch("/api/auth", {
      method: "GET",
      headers: { Authorization: sessionStorage.token },
    })
      .then((data) => {
        return data.json();
      })
      .then(function (jsonStr) {
        setUser(jsonStr.msg);
      });
  }, []);

  // 登出
  const logout = async () => {
    if (sessionStorage.token) {
      let result = fetch("/api/auth", {
        method: "DELETE",
        headers: { Authorization: sessionStorage.token },
      })
        .then((data) => {
          return data.json();
        })
        .then(function (jsonStr) {
          if (jsonStr.code === 200) {
            sessionStorage.removeItem("token");
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
      updateList();
      updateLogin();
      setTimeout(() => {
        setAlert({ display: "none", severity: "info", message: "" });
      }, 1000);
    }
  };
  return (
    <div className={styles.login_box + " p-3"}>
      <Alert style={{ display: alert.display }} severity={alert.severity}>
        {alert.message}
      </Alert>
      <Avatar sx={{ width: 80, height: 80 }}>{user && user.name}</Avatar>
      <button type="submit" className="btn btn-primary" onClick={logout}>
        退出
      </button>
    </div>
  );
}
