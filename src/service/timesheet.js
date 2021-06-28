import { message as messageAlert } from "antd";
import axios from "axios";

import { Api, headers, setToken } from "./constant";

const url = `${Api}/timesheets/`;

export const getList = (keys) => {
    return axios
        .get(url + `${keys.startDate}&${keys.endDate}&${keys.userId}`, {headers:headers})
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
    messageAlert.loading({ content: 'Loading...', key: 1 })
    return axios
        .post(url +`${keys.startDate}&${keys.endDate}&${keys.userId}`, data, {headers:headers})
        .then((res) => {
            const { success, data } = res.data;
            if (success) {
                messageAlert.success({ content: 'Success!', key: 1})
                data.actualHours = data.hours
                setToken(res.headers&& res.headers.authorization)
                return {success, data}
            };
            return { success }
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

export const editTime = (entryId ,data) => {
    messageAlert.loading({ content: 'Loading...', key: 1 })
    return axios
        .put(url +`entries/${entryId}`, data, {headers:headers})
        .then((res) => {
            const { success, data } = res.data;
            if (success) {
                messageAlert.success({ content: 'Success!', key: 1})
                data.actualHours = data.hours
                setToken(res.headers&& res.headers.authorization)
                return {success, data}
            };
            return { success }
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

export const deleteTime = (entryId ) => {
    messageAlert.loading({ content: 'Loading...', key: 1 })
    return axios
        .delete(url +`entries/${entryId}`)
        .then((res) => {
            const { success, data } = res.data;
            messageAlert.success({ content: 'Success!', key: 1})
            if (success) setToken(res.headers&& res.headers.authorization)
            return {success, data};
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
export const reviewTimeSheet = (keys, stage) => {
    messageAlert.loading({ content: 'Loading...', key: 1 })
    return axios
        .post(url + `${keys.startDate}&${keys.endDate}&${keys.userId}/projectEntries/${keys.pEntryId}/${stage}`, {headers:headers})
        .then((res) => {
            const { success, data } = res.data;
            messageAlert.success({ content: 'Success!', key: 1})
            if (success)setToken(res.headers&& res.headers.authorization)
            
            return {success, data};
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


export const editLabel = (data) => {
    messageAlert.loading({ content: 'Loading...', key: data.id })
    return axios
        .put(url + `/${data.id}`, data, {headers:headers})
        .then((res) => {
            const { success } = res.data;
            messageAlert.success({ content: 'Success!', key: data.id})
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

export const addProjectNote = (id, data) => {
    messageAlert.loading({ content: 'Loading...', key: id })
    return axios
        .patch(url + `/projectEntries/${id}`, data, {headers:headers})
        .then((res) => {
            const { success } = res.data;
            messageAlert.success({ content: 'Success!', key: id})
            if (success) setToken(res.headers&& res.headers.authorization)
            
            return {success};
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

