import React, { useContext } from "react";
import {
    BoldLink,
    BoxContainer,
    FormContainer,
    Input,
    LineText,
    MutedLink,
    SubmitButton,
} from "./common";
import { useFormik } from "formik";

import { Marginer } from "../marginer";
import { AccountContext } from './accountContext';

export function LoginForm({ updateList, updateLogin, updateAlert }) {

    const { switchToSignup, switchToSignout } = useContext(AccountContext);

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        onSubmit: (values) => {
            login(values);
        },
    });

    // 登录
    const login = async (values) => {
        const body = new FormData();
        body.append("username", values.username);
        body.append("password", values.password);
        const response = await fetch("/api/auth", {
            method: "POST",
            body,
        });
        const res = await response.json();
        if (res.code === 200) {
            sessionStorage.setItem("token", res.token);
            updateAlert({
                display: "flex",
                severity: "success",
                message: res.msg,
            });
            switchToSignout();
            updateList();
            updateLogin(true, values.username);
        } else {
            updateAlert({
                display: "flex",
                severity: "error",
                message: res.msg,
            });
        }
    };

    return (
        <BoxContainer>
            <FormContainer onSubmit={formik.handleSubmit}>
                <Input id="username" type="text" placeholder="用户名" onChange={formik.handleChange}
                    value={formik.values.username} />
                <Input id="password" type="password" placeholder="密码" onChange={formik.handleChange}
                    value={formik.values.password} />
                <Marginer direction="vertical" margin={0} />
                {/* <MutedLink href="#">忘记密码？</MutedLink> */}
                <Marginer direction="vertical" margin="1.6em" />
                <SubmitButton type="submit">登录</SubmitButton>
            </FormContainer>
            <Marginer direction="vertical" margin="5px" />
            <LineText>
                还没有账号？{" "}
                <BoldLink onClick={switchToSignup} href="#">
                    注册
                </BoldLink>
            </LineText>
        </BoxContainer>
    );
}