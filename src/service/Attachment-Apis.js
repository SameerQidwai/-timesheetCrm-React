import axios from "axios";

import { Api, headers, jwtExpired, localStore, setToken, thumbUrl } from "./constant";

const url = `${Api}/attachments/`;

export const addFiles = (data, config) => {
    return axios
        .post(`${Api}/files`, data, {headers: {"content-type": "multipart/form-data", Authorization: localStore().accessToken}})
        .then((res) => {
            const { status } = res;
            if (status === 200) {
                const { success, data, message } = res.data;
                jwtExpired(message)
                const file = {
                    fileId: data[0].id,
                    uid: data[0]&&data[0].uniqueName,
                    name: data[0]&&data[0].originalName,
                    type: data[0]&&data[0].type,
                    url: `${Api}/files/${data[0]&&data[0].uniqueName}`,
                    thumbUrl:thumbUrl(data[0].type)
                }
                setToken(res.headers && res.headers.authorization)
                return { success, file };
            }
            return { success: false }
        })
        .catch((err) => {
            console.log(err);
            return {}
            // return {
            //     error: err.response.status,
            //     status: false,
            //     message: err.message, 
            // };
        });
};

export const addAttachments = (targetType, targetId, data) => {
    return axios
        .post(`${url}${targetType}/${targetId}`, data, {headers:headers()})
        .then((res) => {
            const { status } = res;
            if (status === 200) {
                let { success, data, message } = res.data;
                jwtExpired(message)
                data = {
                    id: data[0].id,
                    createdAt: data[0].createdAt,
                    fileId: data[0].fileId,
                    status: data[0].status,
                    targetId: data[0].targetId,
                    targetType: data[0].type,
                    uid: data[0]&&data[0].file.uniqueName,
                    name: data[0]&&data[0].file.originalName,
                    type: data[0]&&data[0].file.type,
                    url: `${Api}/files/${data[0]&&data[0].file.uniqueName}`,
                    thumbUrl: thumbUrl(data[0].file.type)
                }
                setToken(res.headers && res.headers.authorization)
                return { success, data };
            }
            return { success: false }
        })
        .catch((err) => {
            console.log(err);
            return {}
            // return {
            //     error: err.response.status,
            //     status: false,
            //     message: err.message,
            // };
        });
};

export const getAttachments = (targetType, targetId) => {
    return axios
        .get(`${url}${targetType}/${targetId}`, {headers: headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            if (success) {
                var fileIds = []
                var fileList = []
                data.map((el) => {
                    fileIds.push(el.id)
                    fileList.push( {
                        id: el.id,
                        createdAt: el.createdAt,
                        fileId: el.fileId,
                        status: el.status,
                        targetId: el.targetId,
                        targetType: el.targetType,
                        uid: el.file.uniqueName,
                        name: el.file.originalName,
                        type: el.file.type === 'png'? 'image/png': el.file.type,
                        url: `${Api}/files/${el.file.uniqueName}`,
                        thumbUrl: thumbUrl(el.file.type)
                    })
                });
                setToken(res.headers && res.headers.authorization)
                return { success, fileList, fileIds }
            };
            return { success: false }
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const delAttachment = (id,) => {
    return axios
        .delete(`${url}${id}`, {headers: headers()})
        .then((res) => {
            const { success, message } = res.data;
            jwtExpired(message)
            setToken(res.headers && res.headers.authorization)
            return { success };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};