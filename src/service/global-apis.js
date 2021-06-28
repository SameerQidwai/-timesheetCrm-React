import { message as messageAlert } from "antd";
import axios from "axios";

import { Api, headers, setToken } from "./constant";

const url = `${Api}/global-setting`;

export const getSettings = () => {
    return axios
        .get(url, {headers:headers})
        .then((res) => {
            const { success, data } = res.data;
            console.log(res);
            if (success) setToken(res.headers&& res.headers.authorization)
            return { success, data };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const upadteSettings = (data) => {
    messageAlert.loading({ content: 'Loading...', key: 1 },5)
    return axios
        .post(url, data, {headers:headers})
        .then((res) => {
            const { success, message, data } = res.data;
            messageAlert.success({ content: message, key: 1},5)
            if (success) setToken(res.headers&& res.headers.authorization)
            
            return {success, data};
        })
        .catch((err) => {
                        messageAlert.error({ content: 'Error!', key: 1},5)
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};