import axios from "axios";
import { message as messageAlert } from "antd";

import { Api, headers, jwtExpired, setToken } from "./constant";

const url = `${Api}/calendar-holidays`;

export const holidayType = () => {
    return axios
        .get(`${Api}/holiday-types`, {headers:headers})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            if (success) {
                data.map((el) => {
                    el.value = el.id;
                    delete el.id;
                    delete el.createdAt;
                    delete el.deletedAt;
                    delete el.updatedAt;
                });
                setToken(res.headers && res.headers.authorization)
            }
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

export const getList = (id) => {
    return axios
        .get(url + `?calendarId=${id}`, {headers:headers})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            if (success) {
                data.map((el) => {
                    el.label = el.holidayType.label;
                });
                setToken(res.headers && res.headers.authorization)
            }
            return { success: success, data: data };
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
            jwtExpired(message)
            messageAlert.success({ content: message, key: 1})
            if (success) setToken(res.headers && res.headers.authorization)
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
            const { success, message } = res.data;
            jwtExpired(message)
            setToken(res.headers && res.headers.authorization)
            if (success) return success;
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
            jwtExpired(message)
            messageAlert.success({ content: message, key: data.id})
            if (success) setToken(res.headers && res.headers.authorization)
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
