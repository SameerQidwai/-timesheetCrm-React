import { message } from "antd";
import axios from "axios";

import { Api, headers, setToken } from "./constant";

const url = `${Api}/timesheets/`;

export const getList = (keys) => {
    return axios
        .get(url + `${keys.startDate}&${keys.endDate}&${keys.userId}`)
        .then((res) => {
            const { success, data } = res.data;
            setToken(res.headers&& res.headers.authorization)
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
        .post(url +`${keys.startDate}&${keys.endDate}&${keys.userId}`, data, {headers:headers})
        .then((res) => {
            const { success, data } = res.data;
            if (success) {
                message.success({ content: 'Success!', key: 1})
                data.actualHours = data.hours
                setToken(res.headers&& res.headers.authorization)
                return {success, data}
            };
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
        .put(url +`entries/${entryId}`, data, {headers:headers})
        .then((res) => {
            const { success, data } = res.data;
            if (success) {
                message.success({ content: 'Success!', key: 1})
                data.actualHours = data.hours
                setToken(res.headers&& res.headers.authorization)
                return {success, data}
            };
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
            setToken(res.headers&& res.headers.authorization)
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
    return axios
        .post(url + `${keys.startDate}&${keys.endDate}&${keys.userId}/projectEntries/${keys.pEntryId}/${stage}`, {headers:headers})
        .then((res) => {
            const { success, data } = res.data;
            message.success({ content: 'Success!', key: 1})
            setToken(res.headers&& res.headers.authorization)
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
    message.loading({ content: 'Loading...', key: data.id })
    return axios
        .put(url + `/${data.id}`, data, {headers:headers})
        .then((res) => {
            const { success } = res.data;
            message.success({ content: 'Success!', key: data.id})
            setToken(res.headers&& res.headers.authorization)
            if (success) return {success};
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

export const addProjectNote = (id, data) => {
    message.loading({ content: 'Loading...', key: id })
    return axios
        .patch(url + `/projectEntries/${id}`, data, {headers:headers})
        .then((res) => {
            const { success } = res.data;
            message.success({ content: 'Success!', key: id})
            setToken(res.headers&& res.headers.authorization)
            if (success) return {success};
        })
        .catch((err) => {
            message.error({ content: 'Error!', key: id})
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

