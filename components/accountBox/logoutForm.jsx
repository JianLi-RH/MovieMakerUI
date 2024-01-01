import React, { useContext } from "react";
import {
    SubmitButton,
} from "./common";
import { useState, useEffect } from "react";

import { AccountContext } from './accountContext';

export function LogoutForm({ updateList, updateLogin, updateAlert }) {

    const { switchToSignin } = useContext(AccountContext);

    const [user, setUser] = useState(null);

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