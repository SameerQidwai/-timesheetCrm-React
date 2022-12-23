import axios from "axios";
import { message as messageAlert } from "antd";

import { Api, headers, jwtExpired, setToken } from "./constant";

const url = `${Api}/reports`;

export const getBenchResources = (queryParam) => {
    return axios
        .get(`${url}/bench-resources${queryParam? '?'+ queryParam: ''}`, {headers:headers()})
        .then((res) => {
            const { success, data } = res.data;
            setToken(res?.headers?.authorization)
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

export const getWorkforceSkills = (queryParam) => {
    return axios
        .get(`${url}/workforce-skills${queryParam? '?'+ queryParam: ''}`, {headers:headers()})
        .then((res) => {
            const { success, data } = res.data;
            setToken(res?.headers?.authorization)
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

export const getPositions = (queryParam) => {
    return axios
        .get(`${url}/allocations${queryParam? '?'+ queryParam: ''}`, {headers:headers()})
        .then((res) => {
            const { success, data } = res.data;
            setToken(res?.headers?.authorization)
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

export const getAllocations = (queryParam) => {
    return axios
        .get(`${url}/allocations-all${queryParam? '?'+ queryParam: ''}`, {headers:headers()})
        .then((res) => {
            const { success, data } = res.data;
            setToken(res?.headers?.authorization)
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

export const getProjectRevenueAnalysis = (queryParam) => {
    return axios
        .get(`${url}/project-revenue-analysis${queryParam? '?'+ queryParam: ''}`, {headers:headers()})
        .then((res) => {
            const { success, data } = res.data;
            setToken(res?.headers?.authorization)
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