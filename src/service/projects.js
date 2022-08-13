import axios from "axios";
import { Api, apiErrorRes, headers, jwtExpired, formatDate, setToken, thumbUrl } from "./constant";
import { message as messageAlert } from "antd";
import moment from 'moment'
const url = `${Api}/projects`;

export const addList = (data) => {
    messageAlert.loading({ content: 'Loading...', key: 1 })
    return axios
        .post(url, data, {headers:headers()})
        .then((res) => {
            const { success, message } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: 1})
            if (success) 
                setToken(res.headers && res.headers.authorization)
            return {success};
        })
        .catch((err) => {
            return apiErrorRes(err, 1)
        });
};

export const getList = () => {
    return axios
        .get(url, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            if (success) 
                setToken(res.headers && res.headers.authorization)
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
                    ContactName: data.contactPerson && `${data.contactPerson.firstName}  ${data.contactPerson.lastName} - ${data.contactPerson.phoneNumber ?? ''}` ,
                    contactPersonId: data.contactPersonId,
                    qualifiedOps: data.qualifiedOps,
                    type: data.type,
                    status: data.status,
                    // value: data.value? data.value: 0,
                    phase: data.phase,
                    title: data.title,
                    stateId: data.stateId,
                    linkedWorkId: data.linkedWorkId,
                }
                const tender = {
                    tender: data.tender,
                    tenderNumber: data.tenderNumber,
                }
                const billing = {
                    cmPercentage: data.cmPercentage ?? 0,
                    cm$: (data.value * data.cmPercentage /100).toFixed(2),
                    getPercentage: data.getPercentage ?? 0,
                    goPercentage: data.goPercentage ?? 0,
                    // these Four keys are for Profit and lost
                    totalMonths: (data.startDate && data.endDate) ? Math.round(formatDate(data.endDate).diff(formatDate(data.startDate), 'months', true)) : 0, 
                    endDate: data.endDate ? formatDate(data.endDate): null,
                    startDate: data.startDate ? formatDate(data.startDate): null,
                    value: data.value? data.value: 0,
                }
                billing.goget = (billing.getPercentage* billing.goPercentage)/100
                billing.discount = (data.value * billing.goget) /100
                billing.upside = (data.value - billing.discount)
                
                const dates = {
                    entryDate: data.entryDate && formatDate(data.entryDate),
                    startDate: data.startDate && formatDate(data.startDate),
                    hoursPerDay: data.hoursPerDay,
                    endDate: data.endDate && formatDate(data.endDate),
                    bidDate: data.bidDate && formatDate(data.bidDate)
                }
                const manage = {
                    accountDirectorId: data.accountDirectorId,
                    accountManagerId: data.accountManagerId,
                    projectManagerId: data.projectManagerId,
                }
                data.ContactName= data.contactPerson && data.contactPerson.firstName + ' ' + data.contactPerson.lastName
                data.organizationName = data.organization && data.organization.name 
                setToken(res.headers && res.headers.authorization)
                return {success, data, basic, tender, billing, dates, manage};
            }
            return { success }
        })
        .catch((err) => {
            if (err.response?.data){
                const { status } = err.response
                const { message, success } = err.response?.data
                return { authError: message === "Not Authorized!", status, success, message, };
            }
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
            if (success) 
                setToken(res.headers && res.headers.authorization)
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
        .put(url + `/${data.id}`, data, {headers:headers()})
        .then((res) => {
            const { success, message} = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: data.id})
            if (success) 
                setToken(res.headers && res.headers.authorization)
            return {success};
        })
        .catch((err) => {
            return apiErrorRes(err, data.id, 5)
        });
};

export const addLeadSkill = (crud, data, id) => {
    messageAlert.loading({ content: 'Loading...', key: id })
    return axios
        .post(`${Api}${crud}`, data, {headers:headers()})
        .then(res=>{
        const { success, message } = res.data
        jwtExpired(message)
        messageAlert.success({ content: message, key: id})
        if(success) 
            setToken(res.headers && res.headers.authorization)
        return { success }
    })
    .catch(err=>{
        return apiErrorRes(err, id, 5)
    })
};

export const getLeadSkills = (crud, id)=>{
    return axios
        .get(`${Api}${crud}`, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            if (success) {
                setToken(res.headers && res.headers.authorization)
            };
            return { success: success, data: data }
        })
        .catch((err) => {
            if (err.response?.data){
                const { status } = err.response
                const { message, success } = err.response?.data
                return { authError: message === "Not Authorized!", status, success, message, };
            }
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const getHierarchy = (projectId) => {
    return axios
        .get(`${url}/${projectId}/hierarchy`, {headers:headers()})
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

export const getProfitLoss = (projectId, dates) => {
    const actualDate = moment().endOf('month').subtract(1, 'months').format('D-M-YYYY')
    return axios
        .get(`${url}/${projectId}/profit-loss?startDate=${formatDate(dates.start, true, 'D-M-YYYY')}&endDate=${formatDate(dates.end, true, 'D-M-YYYY')}&actualDate=${actualDate}`, {headers:headers()})
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

export const getLeadSkill = (crud, resId) => {
    return axios
        .get(`${Api}${crud}/${resId}`, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            if (success){
                let obj = {
                    panelSkillId:  data.panelSkillId,
                    title:  data.title,
                    panelSkillStandardLevelId:  data.panelSkillStandardLevelId,
                    ltceil: data.panelSkillStandardLevel?.longTermCeil,
                    stceil: data.panelSkillStandardLevel?.shortTermCeil,
                    billableHours: data.billableHours,
                    startDate:  formatDate(data.startDate),
                    endDate: formatDate(data.endDate),
                    contactPersonId: data?.opportunityResourceAllocations?.[0]?.contactPersonId,
                    buyingRate:  data?.opportunityResourceAllocations?.[0]?.buyingRate,
                    sellingRate:  data?.opportunityResourceAllocations?.[0]?.sellingRate,
                    effortRate: data?.opportunityResourceAllocations?.[0]?.effortRate,
                    allocationId: data?.opportunityResourceAllocations?.[0]?.id,
                    role: data.opportunityResourceAllocations?.[0]?.role
                }
                setToken(res.headers && res.headers.authorization)
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

export const editLeadSkill = (crud, resId, data) => {
    messageAlert.loading({ content: 'Loading...', key: resId })
    // return { success: false }
    return axios
        .put(`${Api}${crud}/${resId}`, data, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: resId})
            if (success) 
                setToken(res.headers && res.headers.authorization)
            return {success, data: data[0]};
        })
        .catch((err) => {
            return apiErrorRes(err, resId, 5)
        });
};

export const delLeadSkill = (proId, resId) => {
    return axios
        .delete(url + `/${proId}/resources/${resId}`, {headers:headers()})
        .then((res) => {
            const { success, message } = res.data;
            jwtExpired(message)
            if (success) 
                setToken(res.headers && res.headers.authorization)
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
        .post(url + `/${proId}/resources/${skillId}/allocations`, data, {headers:headers()})
        .then((res) => {
            const { success, data , message} = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: skillId})
            if (success) 
                setToken(res.headers && res.headers.authorization)
            return {success, data: data};
        })
        .catch((err) => {
            return apiErrorRes(err, skillId, 5)
        });
};

export const getLeadSkillResource = (proId,skillId, resId) => {
    return axios
        .get(url + `/${proId}/resources/${skillId}/allocations/${resId}`, {headers:headers()})
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

export const editLeadSkillResource = (proId, skillId, resId, data) => {
    return axios
        .put(url + `/${proId}/resources/${skillId}/allocations/${resId}`, data, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            if (success) 
                setToken(res.headers && res.headers.authorization)
            return {success, data};
        })
        .catch((err) => {
            return apiErrorRes(err, skillId, 5)
        });
};

export const delLeadSkillResource = (proId, skillId, resId,) => {
    return axios
        .delete(url + `/${proId}/resources/${skillId}/allocations/${resId}`, {headers:headers()})
        .then((res) => {
            const { success, message } = res.data;
            jwtExpired(message)
            if (success) 
                setToken(res.headers && res.headers.authorization)
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
        .patch(url + `/${proId}/resources/${skillId}/allocations/${resId}/mark-as-selected`, {headers:headers()})
        .then((res) => {
            const { success, message } = res.data;
            jwtExpired(message)
            if (success) 
                setToken(res.headers && res.headers.authorization)
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
        .post(url + `/${proId}/purchaseOrders`, data, {headers:headers()})
        .then((res) => {
            const { success , message, data} = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: proId})
            if (success) 
                setToken(res.headers && res.headers.authorization)
            return {success, data};
        })
        .catch((err) => {
            return apiErrorRes(err, proId, 5)
        });
};

export const getOrders = (proId) => {
    return axios
        .get(url + `/${proId}/purchaseOrders`, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            if (success) 
                setToken(res.headers && res.headers.authorization)
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
        .put(url + `/${proId}/purchaseOrders/${id}`, data, {headers:headers()})
        .then((res) => {
            const { success , message, data} = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: id})
            if (success) 
                setToken(res.headers && res.headers.authorization)
            return {success, data};
        })
        .catch((err) => {
            return apiErrorRes(err, id, 5)
        });
};

export const getOrder = (proId,id) => {
    return axios
        .get(url + `/${proId}/purchaseOrders/${id}`, {headers:headers()})
        .then((res) => {
            let { success, data, message } = res.data;
            jwtExpired(message)
            if (success) {
                data = {
                    ...data,
                    issueDate: formatDate(data.issueDate),
                    expiryDate: formatDate(data.expiryDate),
                    file: data.fileId ? [{
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

                setToken(res.headers && res.headers.authorization)
                return {success, data: data };
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
        .delete(url + `/${proId}/purchaseOrders/${id}`, {headers:headers()})
        .then((res) => {
            const { success, message } = res.data;
            jwtExpired(message)
            if (success) 
                setToken(res.headers && res.headers.authorization)
                
            return {success};
        })
        .catch((err) => {
            return apiErrorRes(err, id, 5)
        });
};

export const Outcomes = (phase, proId) => {
    messageAlert.loading({ content: 'Loading...', key: proId })
    return axios
        .post(url + `/${proId}/phase/${phase}`,{}, {headers:headers()})
        .then((res) => {
            const { success , message, data} = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: proId})
            if (success) 
                setToken(res.headers && res.headers.authorization)
            return {success, data};
        })
        .catch((err) => {
            return apiErrorRes(err, proId, 5)
        });
};