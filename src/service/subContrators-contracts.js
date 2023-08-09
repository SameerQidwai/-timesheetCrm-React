import { message as messageAlert } from "antd";
import axios from "axios";

import { Api, apiErrorRes, headers, jwtExpired, setToken, thumbUrl } from "./constant";

const url = `${Api}/sub-contractors-contracts`;

export const getList = (id) => {
    return axios
        .get(url+ `?subContractorId=${id}`, {headers:headers()})
        .then((res) => {
            const { success, data } = res.data;
            setToken(res?.headers?.authorization)
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
        .get(url + `/${id}`, {headers:headers()})
        .then((res) => {
            const { success, data } = res.data;
            if (success) {
                setToken(res?.headers?.authorization)
                data.file= data.fileId ? [{
                    id: data.file.id,
                    createdAt: data.file.createdAt,
                    fileId: data.file.id,
                    uid: data.file.uniqueName,
                    name: data.file.originalName,
                    type: data.file.type,
                    url: `${Api}/files/${data.file.uniqueName}`,
                    thumbUrl: thumbUrl(data.file.type)
                }] : []
            }
            return {success, data};
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
        .post(url, data, {headers:headers()})
        .then((res) => {
            const { success, message } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: 1})
            if (success) 
                setToken(res?.headers?.authorization)
            return {success};
        })
        .catch((err) => {
            return apiErrorRes(err, 1, 5);
        });
};

export const delList = (id) => {
    return axios
        .delete(url + `/${id}`, {headers:headers()})
        .then((res) => {
            const { success, message } = res.data;
            jwtExpired(message)
            if (success) 
                setToken(res?.headers?.authorization)
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

export const editList = (id, data) => {
    messageAlert.loading({ content: 'Loading...', key: id })
    return axios
        .put(url + `/${id}`, data, {headers:headers()})
        .then((res) => {
            const { success, message } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: id})
            if (success) 
                setToken(res?.headers?.authorization)
            return {success};
        })
        .catch((err) => {
            return apiErrorRes(err, 1, 5);
        });
};
