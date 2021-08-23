import axios from "axios";

import { Api, headers, jwtExpired, setToken } from "./constant";
import moment from "moment";
import { message as messageAlert } from "antd";

const url = `${Api}/employees/`;

export const getList = (empId) => {
    return axios
        .get(url+ `${empId}/leases`, {headers:headers})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            if (success) setToken(res.headers && res.headers.authorization)

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

export const addList = (empId, data) => {
    messageAlert.loading({ content: 'Loading...', key: empId })
    return axios
        .post(url+ `${empId}/leases`, data, {headers:headers})
        .then((res) => {
            const { success, message } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: empId})
            if (success) setToken(res.headers && res.headers.authorization)
            
            return {success};
        })
        .catch((err) => {
            messageAlert.error({ content: err.message, key: empId})
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const getRecord = (empId, id) => {
    return axios
        .get(url+ `${empId}/leases/${id}`, {headers:headers})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            if (success){
                data.startDate = data.startDate && moment(data.startDate)
                data.endDate = data.endDate && moment(data.endDate) 
                data.totalDeduction = (data.preTaxDeductionAmount ? data.preTaxDeductionAmount : 0) + (data.postTaxDeductionAmount ? data.postTaxDeductionAmount : 0)
                setToken(res.headers && res.headers.authorization)
            }
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

export const delList = (empId, id) => {
    return axios
        .delete(url+ `${empId}/leases/${id}`, {headers:headers})
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

export const editList = (empId, id, data) => {
    messageAlert.loading({ content: 'Loading...', key: id })
    return axios
        .put(url+ `${empId}/leases/${id}`, data, {headers:headers})
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
