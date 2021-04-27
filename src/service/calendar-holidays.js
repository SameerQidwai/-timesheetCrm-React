import axios from "axios";
import { message } from "antd";

import { Api } from "./constant";

const url = `${Api}/calendar-holidays`;

export const holidayType = () => {
    return axios
        .get(`${Api}/holiday-types`)
        .then((res) => {
            const { success, data } = res.data;
            data.map((el) => {
                el.value = el.id;
                delete el.id;
                delete el.createdAt;
                delete el.deletedAt;
                delete el.updatedAt;
            });
            if (success) return { success: success, data: data };
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
        .get(url + `?calendarId=${id}`)
        .then((res) => {
            const { success, data } = res.data;
            data.map((el) => {
                el.label = el.holidayType.label;
            });

            if (success) return { success: success, data: data };
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
        message.loading({ content: 'Loading...', key: 1 })

    return axios
        .post(url, data)
        .then((res) => {
            const { success } = res.data;
                        message.success({ content: 'Success!', key: 1})

            if (success) return success;
        })
        .catch((err) => {
                        message.error({ content: 'Error!', key: 1})

            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const delLabel = (id) => {
    return axios
        .delete(url + `/${id}`)
        .then((res) => {
            const { success } = res.data;
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
        message.loading({ content: 'Loading...', key: data.id })
    return axios
        .put(url + `/${data.id}`, data)
        .then((res) => {
            const { success } = res.data;
            message.success({ content: 'Success!', key: data.id})

            if (success) return success;
        })
        .catch((err) => {
            message.error({ content: 'Error!', key: data.id})
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};
