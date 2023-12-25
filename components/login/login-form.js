// import { Formik, Field, Form, FormikHelpers, useFormikContext } from "formik";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import styles from "./login-form.module.css";
import Alert from "@mui/material/Alert";

export default function LoginForm({ updateList, updateLogin }) {
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: (values) => {
      login(values);
    },
  });

  const [alert, setAlert] = useState({
    display: "none",
    severity: "info",
    message: "",
  });

  // 登录
  const login = async (values) => {
    const body = new FormData();
    body.append("username", values.username);
    body.append("password", values.password);
    await fetch("/api/auth", {
      method: "POST",
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
          sessionStorage.setItem("token", jsonStr.token);
          setAlert({
            display: "flex",
            severity: "success",
            message: jsonStr.msg,
          });
          updateList();
          updateLogin();
          setTimeout(() => {
            setAlert({ display: "none", severity: "info", message: "" });
          }, 1000);
        } else {
          setAlert({
            display: "flex",
            severity: "error",
            message: jsonStr.msg,
          });
        }
      });
  };
  return (
    <div className={styles.login_box + " p-3"}>
      <Alert style={{ display: alert.display }} severity={alert.severity}>
        {alert.message}
      </Alert>
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email">用户名:</label>
          <input
            id="username"
            name="username"
            placeholder="用户名"
            onChange={formik.handleChange}
            value={formik.values.username}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email">密&nbsp;&nbsp;&nbsp;&nbsp;码:</label>
          <input
            id="password"
            name="password"
            placeholder="密码"
            onChange={formik.handleChange}
            value={formik.values.password}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          登录
        </button>
      </form>
    </div>
  );
}
