import { message as messageAlert } from "antd";
import axios from "axios";

import { Api, headers, jwtExpired, setToken } from "./constant";

const url = `${Api}/timesheets/`;

export const getList = (keys) => {
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
                success: true,
                message: err.message,
                data: [],
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

export const reviewTimeSheet = (keys, stage, data) => {
    messageAlert.loading({ content: 'Loading...', key: 1 })
    return axios
        .post(url + `${keys.startDate}&${keys.endDate}&${keys.userId}/milestoneEntries${stage}`, data, {headers:headers()})
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

export const addMilestoneTimesheetNote = (id, data) => {
    messageAlert.loading({ content: 'Loading...', key: id })
    return axios
        .patch(url + `milestoneEntries/${id}`, data, {headers:headers()})
        .then((res) => {
            const { success, message, data } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: id})
            if (success) {
                let obj = {
                    notes: data.notes,
                    attachment: data.attachment
                }
                setToken(res.headers && res.headers.authorization)
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
        .post(`${url}print/milestoneEntries` ,{ headers: headers() })
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            if (success) {
                setToken(res.headers && res.headers.authorization)
                let milestoneInfo = {
                    company: data.company,
                    employee: data.employee,
                    period: data.period,
                    project:  data.milestone.name,
                    client: data.milestone.client,
                    contact: data.milestone.contact,
                    totalHours: parseFloat(data.milestone.totalHours).toFixed( 2 ),
                    invoicedDays:  parseFloat(data.milestone.invoicedDays).toFixed( 2 )
                }
                let entries = data.milestone.entries
                return { success, data, milestoneInfo, entries}
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

export const getMilestones = () => {
    return axios
        .get(`${url}milestones`, { headers: headers() })
        .then((res) => {
            const { success, data } = res.data;
            if (success) {
                setToken(res.headers && res.headers.authorization)
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

export const getUsersTimesheet = (keys) => {
    return axios
        .get(`${url}milestone` +`/${keys.startDate}&${keys.endDate}&${keys.mileId}`, { headers: headers() })
        .then((res) => {
            const { success, data } = res.data;
            let newData = []
            if (success) {
                    data.timesheets.forEach(el => {
                        let obj = {...el, ...el.milestones[0]}
                        delete obj.milestones
                        newData.push(obj)
                    });      
                setToken(res.headers && res.headers.authorization)
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