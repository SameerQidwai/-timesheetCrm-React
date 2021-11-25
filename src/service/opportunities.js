import axios from "axios";
import { Api, headers, jwtExpired, setToken } from "./constant";
import { message as messageAlert } from "antd";
import moment from "moment";

const url = `${Api}/opportunities`;

export const addList = (data) => {
    messageAlert.loading({ content: 'Loading...', key: 1 },5)
    return axios
        .post(url, data, {headers:headers()})
        .then((res) => {
            const { success, message } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: 1},5)
            if (success) setToken(res.headers && res.headers.authorization)
            return {success};
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

export const getList = () => {
    return axios
        .get(url, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
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

export const getRecord = (id) => {
    return axios
        .get(url + `/${id}`, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            if (success) {
                const basic = {
                    id: data.id,
                    panelId: data.panelId,
                    organizationId: data.organizationId,
                    organizationName: data.organization && data.organization.name,
                    // organizationId: data.organizationId,
                    ContactName: data.contactPerson && `${data.contactPerson.firstName}  ${data.contactPerson.lastName} - ${data.contactPerson.phoneNumber }` ,
                    contactPersonId: data.contactPersonId,
                    qualifiedOps: data.qualifiedOps,
                    type: data.type,
                    // value: data.value? data.value: 0,
                    title: data.title,
                    stateId: data.stateId
                }
                const tender = {
                    tender: data.tender,
                    tenderNumber: data.tenderNumber,
                }
                const billing = {
                    cmPercentage: data.cmPercentage? data.cmPercentage: 0,
                    cm$: data.value * data.cmPercentage /100,
                    getPercentage: data.getPercentage ? data.getPercentage: 0,
                    goPercentage: data.goPercentage? data.goPercentage: 0,
                    // these Four keys are for Profit and lost
                    totalMonths: (data.startDate && data.endDate) ? Math.ceil(moment(data.endDate).diff(moment(data.startDate), 'months', true)) : 0, 
                    endDate: data.endDate ? moment(data.endDate): null,
                    startDate: data.startDate ? moment(data.startDate): null,
                    value: data.value? data.value: 0,
                }
                billing.goget = (billing.getPercentage* billing.goPercentage)/100
                billing.discount = (data.value * billing.goget) /100
                billing.upside = (data.value - billing.discount)
                
                const dates = {
                    entryDate: data.entryDate && moment(data.entryDate),
                    startDate: data.startDate && moment(data.startDate),
                    hoursPerDay: data.hoursPerDay,
                    endDate: data.endDate && moment(data.endDate),
                    bidDate: data.bidDate && moment(data.bidDate)
                }
                const manage = {
                    accountDirectorId: data.accountDirectorId,
                    accountManagerId: data.accountManagerId,
                    opportunityManagerId: data.opportunityManagerId,
                }
                data.ContactName= data.contactPerson && data.contactPerson.firstName + ' ' + data.contactPerson.lastName
                setToken(res.headers && res.headers.authorization)
                return {success, data, basic, tender, billing, dates, manage};
            }
            return { success }
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const delList = (id) => {
    return axios
        .delete(url + `/${id}`, {headers:headers()})
        .then((res) => {
            const { success, message } = res.data;
            jwtExpired(message)
            if (success)  setToken(res.headers && res.headers.authorization)
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

export const editList = (data) => {
    messageAlert.loading({ content: 'Loading...', key: data.id })
    return axios
        .put(url + `/${data.id}`, data, {headers:headers() })
        .then((res) => {
            const { success, message } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: data.id},5)
            if (success)  setToken(res.headers && res.headers.authorization)

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

export const addLeadSkill = (crud, data, mileId) => {
    messageAlert.loading({ content: 'Loading...', key: mileId })
    return axios
        .post(`${Api}${crud}`, data, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: mileId})
            if (success) setToken(res.headers && res.headers.authorization)

            return {success, data: data[0]};
        })
        .catch((err) => {
            messageAlert.error({ content: err.message, key: mileId})
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const getLeadSkills = (crud)=>{
    return axios
        .get( `${Api}${crud}`, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            if (success) {
                // console.log(data);
                setToken(res.headers && res.headers.authorization)
                return { success: success, data: data }
            };
            return { success }
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const getLeadSkill = (oppId, resId) => {
    return axios
        .get(url + `/${oppId}/resources/${resId}`, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            setToken(res.headers && res.headers.authorization)
            return {success, data: data && data[0]}
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const editLeadSkill = (crud, resId, data) => {
    messageAlert.loading({ content: 'Loading...', key:  resId})
    return axios
        .put(`${Api}${crud}/${resId}`, data, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: resId})
            if (success)  setToken(res.headers && res.headers.authorization)
            return {success, data: data && data[0]};
        })
        .catch((err) => {
            messageAlert.error({ content: err.message, key: resId})
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const delLeadSkill = (oppId, resId) => {
    console.log(oppId, resId);
    return axios
        .delete(url + `/${oppId}/resources/${resId}`, {headers:headers()})
        .then((res) => {
            const { success, message } = res.data;
            jwtExpired(message)
            if (success) setToken(res.headers && res.headers.authorization)

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

export const addLeadSkillResource = (crud, skillId,  data) => {
    messageAlert.loading({ content: 'Loading...', key:  skillId})
    return axios
        .post(`${Api}${crud}/${skillId}/allocations`, data, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: skillId})
            if (success) setToken(res.headers && res.headers.authorization)

            return {success, data: data};
        })
        .catch((err) => {
            messageAlert.error({ content: err.message, key: skillId})
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const getLeadSkillResource = (oppId,skillId, resId) => {
    return axios
        .get(url + `/${oppId}/resources/${skillId}/allocations/${resId}`, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            setToken(res.headers && res.headers.authorization)
            return {success, data}
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const editLeadSkillResource = (crud, skillId, resId, data) => {
    messageAlert.loading({ content: 'Loading...', key: resId })
    console.log(crud);
    return axios
        .put(`${Api}${crud}/${skillId}/allocations/${resId}`, data, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: resId})
            if (success) setToken(res.headers && res.headers.authorization)

            return {success, data};
        })
        .catch((err) => {
            messageAlert.error({ content: err.message, key: resId})
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const delLeadSkillResource = (oppId, skillId, resId,) => {
    return axios
        .delete(url + `/${oppId}/resources/${skillId}/allocations/${resId}`, {headers:headers()})
        .then((res) => {
            const { success, message } = res.data;
            jwtExpired(message)
            if (success) setToken(res.headers && res.headers.authorization)

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

export const selectLeadSkillResource = (crud, skillId, resId) => {
    return axios
        .patch(`${Api}${crud}/${skillId}/allocations/${resId}/mark-as-selected`, {},  {headers:headers()})
        .then((res) => {
            const { success, message } = res.data;
            jwtExpired(message)
            setToken(res.headers && res.headers.authorization)
            messageAlert.success({ content: message, key: resId})
            if (success) return {success};
        })
        .catch((err) => {
            messageAlert.error({ content: err.message, key: resId})
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const workIsLost = (oppId) => {
    return axios
        .put(url + `/${oppId}/lost`, {headers:headers()})
        .then((res) => {
            const { success, message } = res.data;
            jwtExpired(message)
            if (success) setToken(res.headers && res.headers.authorization)

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

export const workWon = (oppId, data) => {
    messageAlert.loading({ content: 'Loading...', key: oppId })
    return axios
        .put(url + `/${oppId}/win`, data, {headers:headers()})
        .then((res) => {
            const { success, message } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: oppId})
            if (success) setToken(res.headers && res.headers.authorization)
            
            return {success};
        })
        .catch((err) => {
            messageAlert.error({ content: err.message, key: oppId})
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};