import axios from "axios";

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
                success: "failed",
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
                success: "failed",
                message: err.message,
            };
        });
};

export const addList = (data) => {
    return axios
        .post(url, data)
        .then((res) => {
            const { success } = res.data;
            if (success) return success;
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: "failed",
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
                status: "failed",
                message: err.message,
            };
        });
};

export const editLabel = (data) => {
    return axios
        .put(url + `/${data.id}`, data)
        .then((res) => {
            const { success } = res.data;
            if (success) return success;
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: "failed",
                message: err.message,
            };
        });
};
