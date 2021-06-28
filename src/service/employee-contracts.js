import axios from "axios";
import { message as messageAlert} from "antd";

import { Api, headers, setToken } from "./constant";

const url = `${Api}/employment-contracts`;

export const getList = (id) => {
    return axios
        .get(url+ `?employeeId=${id}`, {headers:headers})
        .then((res) => {
            const { success, data } = res.data;
            if (success)  setToken(res.headers&& res.headers.authorization)
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

export const getRecord = (id) => {
    return axios
        .get(url + `/${id}`, {headers:headers})
        .then((res) => {
            const { success, data } = res.data;
            if (success)  setToken(res.headers&& res.headers.authorization)
            return { success, data };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: false,
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
            if (success) setToken(res.headers&& res.headers.authorization)
            return {success};
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

export const delList = (id) => {
    return axios
        .delete(url + `/${id}`, {headers:headers})
        .then((res) => {
            const { success } = res.data;
            setToken(res.headers&& res.headers.authorization)
            if (success) return {success};
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const editList = (id, data) => {
    messageAlert.loading({ content: 'Loading...', key: id })
    return axios
        .put(url + `/${id}`, data, {headers:headers})
        .then((res) => {
            const { success, message } = res.data;
            messageAlert.success({ content: message, key: id})
            setToken(res.headers&& res.headers.authorization)
            if (success) return {success};
        })
        .catch((err) => {
            messageAlert.error({ content: err.message, key: id})
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};
