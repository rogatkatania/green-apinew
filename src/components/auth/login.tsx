import { FC, memo } from "react";

import { useForm } from "../../utils/hooks";
import styles from "./login.module.scss";
import Input from "../input/input";
import Button from "../button/button";
import { FormInputType, ERequestStatus } from "../../utils/vars";
import {
    GET_SETTINGS,
    GET_STATE_INSTANCE,
} from "../../services/account/actions";
import { useAppDispatch, useAppSelector } from "../../services/store/hooks";
import { getAccountRequestStatus } from "../../services/account/selectors";

const Login: FC = () => {
    const isLoading: boolean =
        useAppSelector(getAccountRequestStatus) === ERequestStatus.LOADING
            ? true
            : false;
    const isLoadError: boolean =
        useAppSelector(getAccountRequestStatus) === ERequestStatus.ERROR
            ? true
            : false;
    const dispatch = useAppDispatch();

    // работаем с формой
    const { formState, handleChange } = useForm();
    const isFormFilled = formState.id && formState.token;
    const handleSubmit = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        if (isFormFilled) {
            const sendData = {
                id: formState.id,
                token: formState.token,
            };
            dispatch(GET_SETTINGS(sendData));
            dispatch(GET_STATE_INSTANCE(sendData));
        }
    };

    return (
        <>
            <form className={styles.form} onSubmit={handleSubmit}>
                {isLoadError && (
                    <span className={styles.error}>Login error</span>
                )}
                <Input
                    onChange={handleChange}
                    value={formState.id}
                    name={FormInputType.ID}
                    disabled={isLoading}
                />
                <Input
                    onChange={handleChange}
                    value={formState.token}
                    name={FormInputType.TOKEN}
                    disabled={isLoading}
                />
                <Button
                    blocked={isLoading ? true : !isFormFilled ? true : false}
                    submit
                >
                    {isLoading ? "Loading" : "Login"}
                </Button>
            </form>
        </>
    );
};

export default memo(Login);
