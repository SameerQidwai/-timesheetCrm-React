import axios from "axios";
import { Api, headers, jwtExpired, setToken } from "./constant";
import moment from "moment";
import { message as messageAlert } from "antd";

const url = `${Api}/projects`;

export const addList = (data) => {
    messageAlert.loading({ content: 'Loading...', key: 1 })
    return axios
        .post(url, data, {headers:headers})
        .then((res) => {
            const { success, message } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: 1})
            if (success) 
                setToken(res.headers&& res.headers.authorization)
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
        .get(url, {headers:headers})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            if (success) 
                setToken(res.headers&& res.headers.authorization)
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

export const getRecord = (id) => {
    return axios
        .get(url + `/${id}`, {headers:headers})
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
                    ContactName: data.contactPerson && `${data.contactPerson.firstName}  ${data.contactPerson.lastName} - ${data.contactPerson.phoneNumber ?? ''}` ,
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
                    cmPercentage: data.cmPercentage ?? 0,
                    cm$: data.value * data.cmPercentage /100,
                    getPercentage: data.getPercentage ?? 0,
                    goPercentage: data.goPercentage ?? 0,
                    // these Four keys are for Profit and lost
                    totalMonths: (data.startDate && data.endDate) ? Math.round(moment(data.endDate).diff(moment(data.startDate), 'months', true)) : 0, 
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
                    projectManagerId: data.projectManagerId,
                }
                data.ContactName= data.contactPerson && data.contactPerson.firstName + ' ' + data.contactPerson.lastName
                data.organizationName = data.organization && data.organization.name 
                setToken(res.headers&& res.headers.authorization)
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
        .delete(url + `/${id}`, {headers:headers})
        .then((res) => {
            const { success, message } = res.data;
            jwtExpired(message)
            if (success) 
                setToken(res.headers&& res.headers.authorization)
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
        .put(url + `/${data.id}`, data, {headers:headers})
        .then((res) => {
            const { success, message} = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: data.id})
            if (success) 
                setToken(res.headers&& res.headers.authorization)
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

export const addLeadSkill = (id, data) => {
    messageAlert.loading({ content: 'Loading...', key: id })
    return axios
        .post(url + `/${id}/resources`, data, {headers:headers})
        .then(res=>{
        const { success, message } = res.data
        jwtExpired(message)
        messageAlert.success({ content: message, key: id})
        if(success) 
            setToken(res.headers&& res.headers.authorization)
        return { success }
    })
    .catch(err=>{
        messageAlert.error({ content: err.message, key: id})
        return {
            error: "Please look into it",
            status: false,
            success: false,
            message: err.message
        }
    })
};

export const getLeadSkills = (id)=>{
    return axios
        .get(url + `/${id}/resources`, {headers:headers})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            if (success) {
                setToken(res.headers&& res.headers.authorization)
            };
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

export const getLeadSkill = (proId, resId) => {
    return axios
        .get(url + `/${proId}/resources/${resId}`, {headers:headers})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            if (success){
                let obj = {
                    panelSkillId:  data.panelSkillId,
                    panelSkillStandardLevelId:  data.panelSkillStandardLevelId,
                    billableHours: data.billableHours,
                    contactPersonId:  data.opportunityResourceAllocations[0] && data.opportunityResourceAllocations[0].contactPersonId,
                    buyingRate:  data.opportunityResourceAllocations && data.opportunityResourceAllocations[0].buyingRate,
                    sellingRate:  data.opportunityResourceAllocations && data.opportunityResourceAllocations[0].sellingRate,
                    startDate: data.opportunityResourceAllocations && data.opportunityResourceAllocations[0].startDate && moment(data.opportunityResourceAllocations[0].startDate),
                    endDate: data.opportunityResourceAllocations && data.opportunityResourceAllocations[0].endDate && moment(data.opportunityResourceAllocations[0].endDate),
                    effortRate: data.opportunityResourceAllocations && data.opportunityResourceAllocations[0].effortRate,
                    allocationId: data.opportunityResourceAllocations && data.opportunityResourceAllocations[0].id
                }
                setToken(res.headers&& res.headers.authorization)
                return {success, data: obj}
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

export const editLeadSkill = (proId, resId, data) => {
    messageAlert.loading({ content: 'Loading...', key: resId })
    // return { success: false }
    return axios
        .put(url + `/${proId}/resources/${resId}`, data, {headers:headers})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: resId})
            if (success) 
                setToken(res.headers&& res.headers.authorization)
            return {success, data: data[0]};
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

export const delLeadSkill = (proId, resId) => {
    return axios
        .delete(url + `/${proId}/resources/${resId}`, {headers:headers})
        .then((res) => {
            const { success, message } = res.data;
            jwtExpired(message)
            if (success) 
                setToken(res.headers&& res.headers.authorization)
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

export const addLeadSkillResource = (proId, skillId,  data) => {
    messageAlert.loading({ content: 'Loading...', key: skillId })
    return axios
        .post(url + `/${proId}/resources/${skillId}/allocations`, data, {headers:headers})
        .then((res) => {
            const { success, data , message} = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: skillId})
            if (success) 
                setToken(res.headers&& res.headers.authorization)
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

export const getLeadSkillResource = (proId,skillId, resId) => {
    return axios
        .get(url + `/${proId}/resources/${skillId}/allocations/${resId}`, {headers:headers})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            setToken(res.headers&& res.headers.authorization)
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

export const editLeadSkillResource = (proId, skillId, resId, data) => {
    return axios
        .put(url + `/${proId}/resources/${skillId}/allocations/${resId}`, data, {headers:headers})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            if (success) 
                setToken(res.headers&& res.headers.authorization)
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

export const delLeadSkillResource = (proId, skillId, resId,) => {
    return axios
        .delete(url + `/${proId}/resources/${skillId}/allocations/${resId}`, {headers:headers})
        .then((res) => {
            const { success, message } = res.data;
            jwtExpired(message)
            if (success) 
                setToken(res.headers&& res.headers.authorization)
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

export const selectLeadSkillResource = (proId, skillId, resId) => {
    return axios
        .patch(url + `/${proId}/resources/${skillId}/allocations/${resId}/mark-as-selected`, {headers:headers})
        .then((res) => {
            const { success, message } = res.data;
            jwtExpired(message)
            if (success) 
                setToken(res.headers&& res.headers.authorization)
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

export const addOrder = (proId, data) => {
    messageAlert.loading({ content: 'Loading...', key: proId })
    return axios
        .post(url + `/${proId}/purchaseOrders`, data, {headers:headers})
        .then((res) => {
            const { success , message} = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: proId})
            if (success) 
                setToken(res.headers&& res.headers.authorization)
            return {success};
        })
        .catch((err) => {
            messageAlert.error({ content: err.message, key: proId})
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const getOrders = (proId) => {
    return axios
        .get(url + `/${proId}/purchaseOrders`, {headers:headers})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            if (success) 
                setToken(res.headers&& res.headers.authorization)
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

export const editOrder = (proId, id, data) => {
    
    messageAlert.loading({ content: 'Loading...', key: id })
    return axios
        .put(url + `/${proId}/purchaseOrders/${id}`, data, {headers:headers})
        .then((res) => {
            const { success , message} = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: id})
            if (success) 
                setToken(res.headers&& res.headers.authorization)
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

export const getOrder = (proId,id) => {
    return axios
        .get(url + `/${proId}/purchaseOrders/${id}`, {headers:headers})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            if (success) {
               const obj = {...data,
                    issueDate: data.issueDate ? moment(data.issueDate): null,
                    expiryDate: data.expiryDate ? moment(data.expiryDate): null
                }
                setToken(res.headers&& res.headers.authorization)
                return {success, data: obj };
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

export const delOrder = (proId,id) => {
    return axios
        .delete(url + `/${proId}/purchaseOrders/${id}`, {headers:headers})
        .then((res) => {
            const { success, message } = res.data;
            jwtExpired(message)
            if (success) 
                setToken(res.headers&& res.headers.authorization)
                
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