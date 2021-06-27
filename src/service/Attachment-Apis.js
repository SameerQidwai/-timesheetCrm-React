import axios from "axios";

import { Api, headers, localStore, setToken } from "./constant";

const url = `${Api}/attachments/`;

export const addFiles = (data, config) => {
    return axios
        .post(`${Api}/files`, data, {headers: {"content-type": "multipart/form-data", Authorization: localStore().accessToken}})
        .then((res) => {
            const { status } = res;
            if (status === 200) {
                const { success, data } = res.data;
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
    console.log({headers:headers});
    return axios
        .post(`${url}${targetType}/${targetId}`, data, {headers:headers})
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
                    url: `${Api}/files/${data[0]&&data[0].file.uniqueName}`,
                    thumbUrl: thumbUrl(data[0].file.type)
                }
                setToken(res.headers && res.headers.authorization)
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
    console.log(targetType, targetId);
    return axios
        .get(`${url}${targetType}/${targetId}`)
        .then((res) => {
            const { success, data } = res.data;
            var fileIds = []
            var fileList = []
            console.log(data);
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
const thumbUrl = (type) =>{
    if (type === 'pdf') {
        return "/icons/pdf.png";
    }else if ( type === 'doc' || type === 'docx'){
        return "/icons/doc.png";
    }else if ( type === 'xls' || type === 'xlsx'){
        return "/icons/xls.png";
    }else if ( type === 'ppt' || type === 'pptx'){
        return "/icons/ppt.png";
    }else if (type === 'csv'){
        return "/icons/csv.png";
    }else if (/(webp|svg|png|gif|jpg|jpeg|jfif|bmp|dpg|ico)$/i.test(type)){
        return "/icons/img.png"
    }else{
        return "/icons/default.png"
    }
}
export const delAttachment = (id,) => {
    return axios
        .delete(`${url}${id}`)
        .then((res) => {
            const { success } = res.data;
            setToken(res.headers && res.headers.authorization)
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