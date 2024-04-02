import { message as messageAlert } from "antd";
import axios from "axios";

import { Api, apiErrorRes, createQueryParams, headers, jwtExpired, setToken } from "./constant";

const url = `${Api}/timesheets`;

export const getList = (query) => {
    return axios
        .get(url + `${query}`, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            if (success)  setToken(res?.headers?.authorization)
            
            return { success: success, data: data }
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
                data: [],
            };
        });
};

export const addTime = (keys ,data) => {
    messageAlert.loading({ content: 'Loading...', key: 1 })
    return axios
        .post(url +`/${keys.startDate}&${keys.endDate}&${keys.userId}`, data, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            if (success) {
                messageAlert.success({ content: message, key: 1})
                data.actualHours = data.hours
                setToken(res?.headers?.authorization)
                return {success, data}
            };
            return { success }
        })
        .catch((err) => {
            return apiErrorRes(err, 1, 5)
        });
};
export const addBulkTime = (keys ,data) => {
    messageAlert.loading({ content: 'Loading...', key: 1 })
    return axios
        .post(url +`/bulkEntry/${keys.monthStart}&${keys.monthEnd}&${keys.userId}`, data, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            if (success) {
                messageAlert.success({ content: message, key: 1})
                data.actualHours = data.hours
                setToken(res?.headers?.authorization)
                return {success, data}
            };
            return { success }
        })
        .catch((err) => {
            return apiErrorRes(err, 1, 5)
        });
};

export const editTime = (entryId ,data) => {
    messageAlert.loading({ content: 'Loading...', key: 1 })
    return axios
        .put(url +`/entries/${entryId}`, data, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            if (success) {
                messageAlert.success({ content: message, key: 1})
                data.actualHours = data.hours
                setToken(res?.headers?.authorization)
                return {success, data}
            };
            return { success }
        })
        .catch((err) => {
            return apiErrorRes(err, 1, 5)
        });
};

export const deleteTime = (entryId ) => {
    messageAlert.loading({ content: 'Loading...', key: 1 })
    return axios
        .delete(url +`/entries/${entryId}`, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: 1})
            if (success) setToken(res?.headers?.authorization)
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

export const reviewTimeSheet = (keys, stage, data) => {
    messageAlert.loading({ content: 'Loading...', key: 1 })
    return axios
        .post(url + `/${keys.startDate}&${keys.endDate}&${keys.userId}/milestoneEntries${stage}`, data, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: 1})
            if (success) setToken(res?.headers?.authorization)
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
        .put(url + `/${data.id}`, data, {headers:headers()})
        .then((res) => {
            const { success, message } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: data.id})
            if (success) setToken(res?.headers?.authorization)
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

export const addMilestoneTimesheetNote = (id, data) => {
    messageAlert.loading({ content: 'Loading...', key: id })
    return axios
        .patch(url + `/milestoneEntriesUpdate`, data, {headers:headers()})
        .then((res) => {
            const { success, message, data } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: id})
            if (success) {
                let obj = {
                    notes: data.notes,
                    attachment: data.attachment
                }
                setToken(res?.headers?.authorization)
                return {success, data};
            }
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

export const getUsers = () => {
    return axios
        .get(`${url}/users`, { headers: headers() })
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            var pros = []
            if (success) setToken(res?.headers?.authorization)
            
            return { success, data };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const getPdf = (entryIds) => {
    return axios
        .post(`${url}/print/milestoneEntries`,entryIds,{ headers: headers() })
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            if (success) {
                setToken(res?.headers?.authorization)
                return { success, data}
            }
            
            return { success, data };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const getMilestones = (query) => {
    query = createQueryParams(query)
    return axios
        .get(`${url}/milestones${query}`, { headers: headers() })
        .then((res) => {
            const { success, data } = res.data;
            if (success) {
                setToken(res?.headers?.authorization)
            }
            return { success: success, data: data };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const getUsersTimesheet = (query) => {
    return axios
        .get(`${url}/approvals${query}` , { headers: headers() })
        .then((res) => {
            const { success, data } = res.data;
            let newData = []
            if (success) {
                    data.timesheets.forEach(el => {
                        let obj = {...el, ...el.milestones[0]}
                        delete obj.milestones
                        newData.push(obj)
                    });      
                setToken(res?.headers?.authorization)
            }
            console.log(newData);
            return { success: success, data: newData };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};