import axios from "axios";
import { message as messageAlert } from "antd";
import { Api, headers, setToken, jwtExpired, thumbUrl } from "./constant";

const url = `${Api}/leave-requests`

export const addRequest = (data) => {
    messageAlert.loading({ content: 'Loading...', key: 1 })
    return axios
        .post(url, data, {headers:headers()})
        .then((res) => {
            // console.log('RES: ', res);
            const { success, message } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: 'Success!', key: 1})
            if (success) 
                setToken(res.headers && res.headers.authorization)
            return {success};
        })
        .catch((err) => {
            const {message} = err?.response?.data
            if (message === 'Balance is less than minimum balance!'){
                messageAlert.error({ content: message, duration: 0, key: 1, style: { marginTop: '15vh', }}) 
                return {
                    balanceError: true,
                    success: false, 
                    message
                }
            }
            messageAlert.error({ content: message, key: 1})
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const getRequests = () => {
    return axios
        .get(url,{headers:headers()})
        .then((res) => {
            const { success, data } = res.data;
            setToken(res.headers && res.headers.authorization)
            if (success) return { success: success, data: data };
        })
        .catch((err) => {
            const {message} = err.response.data
            if(message !== 'Leave Requests not found'){
                messageAlert.error({ content: message, key: 1})
            }
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const getSingleRequest = (id) => {
    messageAlert.loading({ content: 'Loading...', key: id })
    return axios
        .get(`${url}/${id}`,{headers:headers()})
        .then((res) => {
            const { success, message, data } = res.data;
            messageAlert.success({ content: message, key: id})
            setToken(res.headers && res.headers.authorization)
            if (success){ 
                const entries = data?.entries
                let attachments = data?.attachments ?? []
                var fileIds = []
                var fileList = []
                attachments.map((el) => {
                    fileIds.push(el.id)
                    fileList.push({
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
                return { success, data, entries, fileIds, fileList }
            }
            return {success, data }
        })
        .catch((err) => {
            const {message} = err.response.data
            messageAlert.error({ content: message, key: id})
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const editRequest = (id, data) => {
    messageAlert.loading({ content: 'Loading...', key: id })
    return axios
    .patch(`${url}/${id}`, data, {headers:headers()})
        .then((res) => {
            const { success, message, data } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: id})
            if (success) setToken(res.headers && res.headers.authorization)

            return {success, data: data};
        })
        .catch((err) => {
            const {message} = err.response.data
            messageAlert.error({ content: message, key: id})
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const getApprovalRequests = (queries) => {
    return axios //${query?.startDate}&${query?.endDate}&${query?.userId}&${query?.workId}
    .get(`${url}/approvalLeaveRequests?${queries}`,{headers:headers()})
        .then((res) => {
            const { success, data } = res.data;
            setToken(res.headers && res.headers.authorization)
            if (success) return { success: success, data: data };
        })
        .catch((err) => {
            const {message} = err.response.data
            messageAlert.error({ content: message, key: 1})
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const manageLeaveRequests = (manage, data) => {
    return axios
    .post(`${url}/${manage}`, data,{headers:headers()})
        .then((res) => {
            const { success, data } = res.data;
            setToken(res.headers && res.headers.authorization)
            if (success) return { success: success, data: data };
        })
        .catch((err) => {
            const {message} = err.response.data
            messageAlert.error({ content: message, key: 1})
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};
    export const getLeaveBalance = (id) => {
        return axios
            .get(`${Api}/leave-request-balances?employeeId=${id}`,{headers:headers()})
            .then((res) => {
                const { success, data } = res.data;
                setToken(res.headers && res.headers.authorization)
                if (success) return { success: success, data: data };
            })
            .catch((err) => {
                const {message} = err?.response?.data
                messageAlert.error({ content: message??err.message , key: 1})
                return {
                    error: "Please login again!",
                    success: false,
                    message: err.message,
                };
            });
    };
    export const updateLeavebalance = (id, data) => {
        return axios
            .patch(`${Api}/leave-request-balances/${id}`, data,{headers:headers()})
            .then((res) => {
                const { success, data } = res.data;
                setToken(res.headers && res.headers.authorization)
                if (success) return { success: success, data: data };
            })
            .catch((err) => {
                const {message} = err?.response?.data
                messageAlert.error({ content: message??err.message , key: 1})
                return {
                    error: "Please login again!",
                    success: false,
                    message: err.message,
                };
            });
    };