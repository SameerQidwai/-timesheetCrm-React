import axios from "axios";

import { Api } from "./constant";

const url = `${Api}/organizations`;

export const getList = () => {
    return axios
        .get(url)
        .then((res) => {
            const { success, data } = res.data;
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

export const getOrgRecord = (id) => {
    return axios
        .get(url + `/${id}`)
        .then((res) => {
            const { success, data } = res.data;
            if (success) return {success, data};
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: "failed",
                message: err.message,
            };
        });
};

export const addList = (data) => {
    return axios
        .post(url, data)
        .then((res) => {
            const { success } = res.data;
            if (success) return {success};
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: "failed",
                message: err.message,
            };
        });
};

export const delOrg = (id) => {
    return axios
        .delete(url + `/${id}`)
        .then((res) => {
            const { success } = res.data;
            if (success) return {success};
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: "failed",
                message: err.message,
            };
        });
};

export const editList = (data) => {
    return axios
        .put(url + `/${data.id}`, data)
        .then((res) => {
            const { success } = res.data;
            if (success) return {success};
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: "failed",
                message: err.message,
            };
        });
};
