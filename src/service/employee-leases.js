import axios from "axios";

import { Api } from "./constant";
import moment from "moment";

const url = `${Api}/employees/`;

export const getList = (empId) => {
    return axios
        .get(url+ `${empId}/leases`)
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

export const addList = (empId, data) => {
    return axios
        .post(url+ `${empId}/leases`, data)
        .then((res) => {
            console.log(res);
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

export const getRecord = (empId, id) => {
    return axios
        .get(url+ `${empId}/leases/${id}`)
        .then((res) => {
            const { success, data } = res.data;
            if (success){
                data.startDate = data.startDate && moment(data.startDate)
                data.endDate = data.endDate && moment(data.endDate) 
                data.totalDeduction = (data.preTaxDeductionAmount ? data.preTaxDeductionAmount : 0) + (data.postTaxDeductionAmount ? data.postTaxDeductionAmount : 0)
                return {success, data}
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

export const delList = (empId, id) => {
    return axios
        .delete(url+ `${empId}/leases/${id}`)
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

export const editList = (empId, id, data) => {
    return axios
        .put(url+ `${empId}/leases/${id}`, data)
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