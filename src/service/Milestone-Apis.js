import axios from "axios";
import { message as messageAlert } from "antd";

import { Api, headers, jwtExpired, setToken } from "./constant";
import moment from "moment";

const url = `${Api}/milestones`;

export const getMilestones = (crud ) => {
    return axios
    // /${id}
        .get(`${Api}${crud}`, {headers:headers()})
        .then((res) => {
            const { success, data } = res.data;
            setToken(res.headers && res.headers.authorization)
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

export const getMilestone = (id) => {
    return axios
        .get(`${url}/${id}`, {headers:headers()})
        .then((res) => {
            const { success, data } = res.data;
            setToken(res.headers && res.headers.authorization)
            if (success){
                data.startDate = moment(data.startDate)
                data.endDate = moment(data.endDate)
                return { success: success, data: data }
            };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const addMilestone = (crud, data) => {
    messageAlert.loading({ content: 'Loading...', key: 1 })
    console.log(crud);
    return axios
        .post(`${Api}${crud}`, data, {headers:headers()})
        .then((res) => {
            const { success, message, data } = res.data;
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

export const delMilestones = (id) => {
    return axios
        .delete(url + `/${id}`, {headers:headers()})
        .then((res) => {
            const { success, message, data } = res.data;
            jwtExpired(message)
            if (success) setToken(res.headers && res.headers.authorization)
            
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

export const editMilestone = (crud, id, data) => {
    messageAlert.loading({ content: 'Loading...', key: id })
    return axios
        .put(`${Api}${crud}/${id}`, data, {headers:headers()})
        .then((res) => {
            const { success, message, data } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: id})
            if (success) setToken(res.headers && res.headers.authorization)

            return {success, data: data[0]};
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

export const getProjectDetail = (crud, id) => {
    return axios
        .get(`${Api}/${crud}`, {headers:headers()})
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
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};