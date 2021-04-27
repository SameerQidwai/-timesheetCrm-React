import { message } from "antd";
import axios from "axios";

import { Api } from "./constant";

const url = `${Api}/panel-skills`;

export const getSkills = () => {
    return axios
        .get(`${Api}/standard-skills`)
        .then((res) => {
            const { success, data } = res.data;
            data.map((el) => {
                el.value = el.id;
                delete el.id;
                delete el.createdAt;
                delete el.deletedAt;
                delete el.updatedAt;
                delete el.standardSkillStandardLevels;
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

export const getlevels = () => {
    return axios
        .get(`${Api}/standard-levels`)
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
    console.log(id);
    return axios
        .get(url + `?panelId=${id}`)
        .then((res) => {
            const { success, data } = res.data;
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
