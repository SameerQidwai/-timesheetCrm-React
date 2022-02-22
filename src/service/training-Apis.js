import { message as messageAlert } from "antd";
import axios from "axios";

import { Api, headers, setToken, jwtExpired } from "./constant";

export const getTraining = () => {
    return axios
        .get(`${Api}/auth/training`, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: 'logout'})
            if (success) setToken(res.headers && res.headers.authorization)
            return {success, data};
        })
        .catch((err) => {
                messageAlert.error({ content: err.message, key: 'logout'})
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const upadteTraining = (data) => {
    return axios
        .patch(`${Api}/auth/training`, data, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: 'logout'})
            if (success) setToken(res.headers && res.headers.authorization)
            return {success, data};
        })
        .catch((err) => {
                messageAlert.error({ content: err.message, key: 'logout'})
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};
