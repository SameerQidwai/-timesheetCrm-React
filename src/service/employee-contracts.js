import axios from "axios";

import { Api } from "./constant";

const url = `${Api}/employment-contracts`;

export const getList = (id) => {
    return axios
        .get(url+ `?employeeId=${id}`)
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

export const getRecord = (id) => {
    return axios
        .get(url + `/${id}`)
        .then((res) => {
            const { success, data } = res.data;
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

export const addList = (id, data) => {
    return axios
        .post(url+`?employeeId=${id}`, data)
        .then((res) => {
            console.log(res);
            const { success } = res.data;
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

export const delList = (id) => {
    return axios
        .delete(url + `/${id}`)
        .then((res) => {
            const { success } = res.data;
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
    return axios
        .put(url + `/${id}`, data)
        .then((res) => {
            const { success } = res.data;
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
