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
import { Marginer } from "../marginer";
import { AccountContext } from './accountContext';

export function SignupForm(props) {

    const { switchToSignin } = useContext(AccountContext);
    return (
        <BoxContainer>
            <FormContainer>
                <Input type="text" placeholder="用户名" />
                <Input type="password" placeholder="密码" defaultValue="" />
                <Input type="password" placeholder="确认密码" defaultValue="" />
            </FormContainer>
            <Marginer direction="vertical" margin={0} />
            <SubmitButton type="submit">注册</SubmitButton>
            <Marginer direction="vertical" margin="0px" />
            <LineText>
                已经注册过MovieMaker?{" "}
                <BoldLink onClick={switchToSignin} href="#">
                    请登录
                </BoldLink>
            </LineText>
        </BoxContainer>
    );
}