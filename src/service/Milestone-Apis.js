import axios from "axios";
import { message as messageAlert } from "antd";

import { Api, headers, jwtExpired, setToken } from "./constant";
import moment from "moment";

const url = `${Api}/milestones`;

export const getMilestones = (crud, id) => {
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
