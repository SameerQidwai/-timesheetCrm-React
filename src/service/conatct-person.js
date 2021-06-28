import axios from "axios";
import { Api, headers, setToken } from "./constant";
import { message as messageAlert } from "antd";

const url = `${Api}/contactpersons`;

export const getList = () => {
    return axios
        .get(url, {headers:headers})
        .then((res) => {
            const { success, data } = res.data;
            if (success) setToken(res.headers&& res.headers.authorization)
            
            return { success, data };
        })
        .catch((err) => {
            console.log(err);
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const getContactRecord = (id) => {
    return axios
        .get(url + `/${id}`,{headers:headers})
        .then((res) => {
            const { success, data } = res.data;
            setToken(res.headers&& res.headers.authorization)
            if (success) return {success, data};
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
            if (success)  setToken(res.headers&& res.headers.authorization)

            return {success};
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const editList = (data) => {
    messageAlert.loading({ content: 'Loading...', key: data.id })
    return axios
        .put(url + `/${data.id}`, data, {headers:headers})
        .then((res) => {
            const { success, message } = res.data;
            messageAlert.success({ content: message, key: data.id})
            if (success) setToken(res.headers&& res.headers.authorization)
            return {success};
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
