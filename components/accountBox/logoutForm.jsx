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
import { useState, useEffect } from "react";


import { Marginer } from "../marginer";
import { AccountContext } from './accountContext';

export function LogoutForm({ updateList, updateLogin, updateAlert }) {

    const { switchToSignin } = useContext(AccountContext);

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
            const response = await fetch("/api/auth", {
                method: "DELETE",
                headers: { Authorization: sessionStorage.token },
            })
            const res = await response.json();
            if (res.code === 200) {
                sessionStorage.removeItem("token");
                updateAlert({
                    display: "flex",
                    severity: "success",
                    message: res.msg,
                });
                switchToSignin();
                updateList();
                updateLogin(false);
            } else {
                updateAlert({
                    display: "flex",
                    severity: "error",
                    message: res.msg,
                });
            }
        }
    };

    return (
        <SubmitButton onClick={logout}>退出</SubmitButton>
    );
}