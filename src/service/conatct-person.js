import axios from "axios";
import { Api, apiErrorRes, headers, jwtExpired, setToken } from "./constant";
import { message as messageAlert } from "antd";

const url = `${Api}/contactpersons`;

export const getList = () => {
    return axios
        .get(url, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            if (success) setToken(res?.headers?.authorization)
            
            return { success, data };
        })
        .catch((err) => {
            console.log(err);
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const getContactRecord = (id) => {
    return axios
        .get(url + `/${id}`,{headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            setToken(res?.headers?.authorization)
            if (success) return {success, data};
        })
        .catch((err) => {
            if (err.response?.data){
                const { status } = err.response
                const { message, success } = err.response?.data
                jwtExpired(message)
                return { authError: message === "Not Authorized!", status, success, message, };
            }
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const addList = (data) => {
    messageAlert.loading({ content: 'Loading...', key: 1 })
    return axios
        .post(url, data, {headers:headers()})
        .then((res) => {
            const { success, message } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: 1})
            if (success) setToken(res?.headers?.authorization)
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

export const delList = (id) => {
    return axios
        .delete(url + `/${id}`, {headers:headers()})
        .then((res) => {
            const { success, message } = res.data;
            jwtExpired(message)

            if (success)  setToken(res?.headers?.authorization)

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

export const editList = (updateData) => {
    messageAlert.loading({ content: 'Loading...', key: updateData.id })
    return axios
        .put(url + `/${updateData.id}`, updateData, {headers:headers()})
        .then((res) => {
            const { success, message, data} = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: updateData.id})
            setToken(res?.headers?.authorization)
            if (success){
                return {success, data}
            } 
            return {success};
        })
        .catch((err) => {
            return apiErrorRes(err, updateData.id, 5)
        });
};
