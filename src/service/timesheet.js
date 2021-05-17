import { message } from "antd";
import axios from "axios";

import { Api } from "./constant";

const url = `${Api}/timesheets/`;

export const getList = (keys) => {
    console.log(`${keys.startDate}&${keys.endDate}&${keys.userId}`);
    return axios
        .get(url + `${keys.startDate}&${keys.endDate}&${keys.userId}`)
        .then((res) => {
            const { success, data } = res.data;
            console.log(res);
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

export const addTime = (keys ,data) => {
    message.loading({ content: 'Loading...', key: 1 })
    return axios
        .post(url +`${keys.startDate}&${keys.endDate}&${keys.userId}`, data)
        .then((res) => {
            const { success, data } = res.data;
            message.success({ content: 'Success!', key: 1})
            if (success) return {success, data};
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

export const editTime = (entryId ,data) => {
    message.loading({ content: 'Loading...', key: 1 })
    return axios
        .put(url +`entries/${entryId}`, data)
        .then((res) => {
            const { success, data } = res.data;
            message.success({ content: 'Success!', key: 1})
            if (success) return {success, data};
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

export const deleteTime = (entryId ) => {
    message.loading({ content: 'Loading...', key: 1 })
    return axios
        .delete(url +`entries/${entryId}`)
        .then((res) => {
            const { success, data } = res.data;
            message.success({ content: 'Success!', key: 1})
            if (success) return {success, data};
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
export const reviewTimeSheet = (keys, stage) => {
    message.loading({ content: 'Loading...', key: 1 })
    console.log(`${keys.startDate}&${keys.endDate}&${keys.userId}/projectEntries/${keys.pEntryId}/${stage}`);
    return axios
        .post(url + `${keys.startDate}&${keys.endDate}&${keys.userId}/projectEntries/${keys.pEntryId}/${stage}`)
        .then((res) => {
            const { success, data } = res.data;
            message.success({ content: 'Success!', key: 1})
            if (success) return {success, data};
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


export const editLabel = (data) => {
    message.loading({ content: 'Loading...', key: data.is })
    return axios
        .put(url + `/${data.id}`, data)
        .then((res) => {
            const { success } = res.data;
            message.success({ content: 'Success!', key: data.is})
            if (success) return success;
        })
        .catch((err) => {
            message.error({ content: 'Error!', key: data.is})
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};
