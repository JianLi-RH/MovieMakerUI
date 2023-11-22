import { Formik, Field, Form, FormikHelpers, useFormikContext } from "formik";
import { useState, useEffect } from "react";
import styles from "./login-form.module.css";
import Alert from "@mui/material/Alert";

export default function LoginForm() {
  const [serverUrl, setServerUrl] = useState("/api/auth");
  const [alert, setAlert] = useState({
    display: "none",
    severity: "info",
    message: "",
  });

  const login = async (values) => {
    const body = new FormData();
    body.append("username", values.username);
    body.append("password", values.password);
    const result = await fetch(serverUrl, {
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
    }, 2000);
  };
  return (
    <div className={styles.login_box + " p-3"}>
      <Alert style={{ display: alert.display }} severity={alert.severity}>
        {alert.message}
      </Alert>
      <h1 className="display-6 mb-3">Login</h1>
      <Formik
        actions="/api/auth"
        initialValues={{
          username: "",
          password: "",
        }}
        validate={(values) => {
          const errors = {};
          if (values.username.length < 5 || values.password.length < 5) {
            errors.token = "用户名和密码不能为空且长度必须大于5位";
          }
          return errors;
        }}
        onSubmit={(values, actions) => {
          login(values);
        }}
      >
        <Form action="/api/auth">
          <div className="mb-3">
            <Field
              className="form-control"
              id="username"
              name="username"
              placeholder="用户名"
              aria-describedby="usernameHelp"
            />
          </div>

          <div className="mb-3">
            <Field
              className="form-control"
              id="password"
              name="password"
              placeholder="密码"
              type="password"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            登录
          </button>
        </Form>
      </Formik>
    </div>
  );
}
