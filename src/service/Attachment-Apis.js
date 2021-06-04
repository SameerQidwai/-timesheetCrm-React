import axios from "axios";

import { Api } from "./constant";

const url = `${Api}/attachments/`;

export const addFiles = (data, config) => {
    // const header ={ 'content-type': 'multipart/form-data',  'Accept': 'application/json'}
    return axios
        .post(`${Api}/files`, data, config)
        .then((res) => {
            const { status } = res;
            if (status === 200) {
                const { success, data } = res.data;
                console.log(data);
                return { success, data };
            }
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
        .post(`${url}${targetType}/${targetId}`, data)
        .then((res) => {
            const { status } = res;
            if (status === 200) {
                let { success, data } = res.data;
                console.log(data);
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
                    url: `${Api}/files/${data[0]&&data[0].file.uniqueName}`
                }
                return { success, data };
            }
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
        .get(`${url}${targetType}/${targetId}`)
        .then((res) => {
            const { success, data } = res.data;
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
                    type: el.file.type,
                    url: `${Api}/files/${el.file.uniqueName}`
                })
            });
            if (success) return { success, fileList, fileIds };
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
        .delete(`${url}${id}`)
        .then((res) => {
            const { success } = res.data;
            if (success) return { success };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};