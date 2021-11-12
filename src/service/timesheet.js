import { message as messageAlert } from "antd";
import axios from "axios";

import { Api, headers, jwtExpired, setToken } from "./constant";

const url = `${Api}/timesheets/`;

export const getList = (keys) => {
    console.log({headers:headers()})
    return axios
        .get(url + `${keys.startDate}&${keys.endDate}&${keys.userId}`, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            if (success)  setToken(res.headers && res.headers.authorization)
            
            return { success: success, data: data }
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
        .post(url +`${keys.startDate}&${keys.endDate}&${keys.userId}`, data, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            if (success) {
                messageAlert.success({ content: message, key: 1})
                data.actualHours = data.hours
                setToken(res.headers && res.headers.authorization)
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
        .put(url +`entries/${entryId}`, data, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            if (success) {
                messageAlert.success({ content: message, key: 1})
                data.actualHours = data.hours
                setToken(res.headers && res.headers.authorization)
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
        .delete(url +`entries/${entryId}`, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: 1})
            if (success) setToken(res.headers && res.headers.authorization)
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
        .post(url + `${keys.startDate}&${keys.endDate}&${keys.userId}/projectEntries/${keys.pEntryId}/${stage}`, {}, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: 1})
            if (success) setToken(res.headers && res.headers.authorization)
            console.log({success, data});
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
        .put(url + `${data.id}`, data, {headers:headers()})
        .then((res) => {
            const { success, message } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: data.id})
            if (success) setToken(res.headers && res.headers.authorization)
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
        .patch(url + `projectEntries/${id}`, data, {headers:headers()})
        .then((res) => {
            const { success, message } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: id})
            if (success) setToken(res.headers && res.headers.authorization)
            
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
        .get(`${url}users`, { headers: headers() })
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            var pros = []
            if (success) setToken(res.headers && res.headers.authorization)
            
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

export const getPdf = (entryId) => {
    return axios
        .get(`${url}print/${entryId}`, { headers: headers() })
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            console.log(data);
            if (success) {
                setToken(res.headers && res.headers.authorization)
                let projectInfo = {
                    company: data.company,
                    employee: data.employee,
                    period: data.period,
                    project:  data.project.name,
                    client: data.project.client,
                    contact: data.project.contact,
                    totalHours: parseFloat(data.project.totalHours).toFixed( 2 ),
                    invoicedDays:  parseFloat(data.project.invoicedDays).toFixed( 2 )
                }
                let entries = data.project.entries
                return { success, data, projectInfo, entries}
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

