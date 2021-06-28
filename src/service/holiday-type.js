import axios from "axios";
import { message as messageAlert} from "antd";

import { Api, headers, setToken } from "./constant";

const url = `${Api}/holiday-types`;

export const getList = () => {
    return axios
        .get(url, {headers:headers})
        .then((res) => {
            const { success, data } = res.data;
            setToken(res.headers&& res.headers.authorization)
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

export const addList = (data) => {
            messageAlert.loading({ content: 'Loading...', key: 1 })
    return axios
        .post(url, data, {headers:headers})
        .then((res) => {
            const { success, message } = res.data;
            messageAlert.success({ content: message, key: 1})
            setToken(res.headers&& res.headers.authorization)
            return success;
        })
        .catch((err) => {
            messageAlert.error({ content: err.message, key: 1})
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const delLabel = (id) => {
    return axios
        .delete(url + `/${id}`, {headers:headers})
        .then((res) => {
            const { success } = res.data;
            setToken(res.headers&& res.headers.authorization)
            return success;
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const editLabel = (data) => {
            messageAlert.loading({ content: 'Loading...', key: data.id })
    return axios
        .put(url + `/${data.id}`, data, {headers:headers})
        .then((res) => {
            const { success, message } = res.data;
            messageAlert.success({ content: message, key: data.id})
            setToken(res.headers&& res.headers.authorization)
            return success;
        })
        .catch((err) => {
                        messageAlert.error({ content: err.message, key: data.id})
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};
