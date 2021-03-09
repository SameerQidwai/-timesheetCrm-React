import axios from "axios";
import { Api } from "./constant";
import moment from "moment";
const url = `${Api}/opportunities`;

export const addList = (data) => {
    return axios
        .post(url, data)
        .then((res) => {
            const { success } = res.data;
            if (success) return {success};
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const getList = () => {
    return axios
        .get(url)
        .then((res) => {
            const { success, data } = res.data;
            if (success) return { success: success, data: data };
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
        .get(url + `/${id}`)
        .then((res) => {
            const { success, data } = res.data;
            // console.log(data);
            if (success) {
                const basic = {
                    id: data.id,
                    panelId: data.panelId,
                    organizationId: data.organizationId,
                    organizationName: data.organization && data.organization.name,
                    // organizationId: data.organizationId,
                    ContactName: data.contactPerson && data.contactPerson.firstName +' '+ data.contactPerson.lastName ,
                    contactPersonId: data.contactPersonId,
                    qualifiedOps: data.qualifiedOps,
                    type: data.type,
                    value: data.value? data.value: 0,
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
                    totalMonths: (data.startDate && data.endDate) ? Math.round(moment(data.endDate).diff(moment(data.startDate), 'months', true)) : 0, 
                    endDate: data.endDate ? moment(data.endDate): null,
                    startDate: data.startDate ? moment(data.startDate): null,
                    value: data.value
                }
                billing.goget = (billing.getPercentage* billing.goPercentage)/100
                billing.discount = (data.value * billing.goget) /100
                billing.upside = (data.value - billing.discount)
                
                const dates = {
                    entryDate: moment(data.entryDate),
                    startDate: moment(data.startDate),
                    endDate: moment(data.endDate),
                    bidDate: moment(data.bidDate)
                }
                data.ContactName= data.contactPerson && data.contactPerson.firstName + ' ' + data.contactPerson.lastName
                return {success, data, basic, tender, billing, dates};
            }
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
        .delete(url + `/${id}`)
        .then((res) => {
            const { success } = res.data;
            if (success) return {success};
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
    return axios
        .put(url + `/${data.id}`, data)
        .then((res) => {
            const { success } = res.data;
            if (success) return {success};
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const addResource = (id, data) => {
    return axios
        .post(url + `/${id}/resources`, data)
        .then((res) => {
            const { success } = res.data;
            if (success) return {success};
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const getResources = (id)=>{
    return axios
        .get(url + `/${id}/resources`)
        .then((res) => {
            const { success, data } = res.data;
            if (success) return { success: success, data: data };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const getResource = (oppId, resId) => {
    return axios
        .get(url + `/${oppId}/resources/${resId}`)
        .then((res) => {
            const { success, data } = res.data;
            return {success, data: data[0]}
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const editResource = (oppId, resId, data) => {
    return axios
        .put(url + `/${oppId}/resources/${resId}`, data)
        .then((res) => {
            const { success } = res.data;
            if (success) return {success};
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const delResource = (oppId, resId) => {
    return axios
        .delete(url + `/${oppId}/resources/${resId}`)
        .then((res) => {
            const { success } = res.data;
            if (success) return {success};
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};