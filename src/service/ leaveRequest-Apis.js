import axios from "axios";
import { message as messageAlert } from "antd";
import { Api, headers, setToken, jwtExpired } from "./constant";

export const getLeaveTypes = () => {
    return axios
        .get(`${Api}/time-off-types`,{headers:headers()})
        .then((res) => {
            const { success, data } = res.data;
            var states = []
            data.map((el) => {
                states.push({value: el.id, label: el.label})
            });
            setToken(res.headers && res.headers.authorization)
            if (success) return { success: success, data: states };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const addRequest = (data) => {
    messageAlert.loading({ content: 'Loading...', key: 1 })
    return axios
        .post(`${Api}/leaveRequests`, data, {headers:headers()})
        .then((res) => {
            // console.log('RES: ', res);
            const { success, message } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: 'Success!', key: 1})
            if (success) 
                setToken(res.headers && res.headers.authorization)
            return success;
        })
        .catch((err) => {
            // console.log('ERR: ', err)
            messageAlert.error({ content: err.message, key: 1})
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const getRequests = () => {
    return axios
        .get(`${Api}/leaveRequests`,{headers:headers()})
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

export const getSingleRequest = (data) => {
    return axios
        .get(`${Api}/leaveRequests/${data}`,{headers:headers()})
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

export const editRequest = (id, data) => {
    messageAlert.loading({ content: 'Loading...', key: id })
    return axios
        .patch(`${Api}/leaveRequests/${id}`, data, {headers:headers()})
        .then((res) => {
            const { success, message, data } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: id})
            if (success) setToken(res.headers && res.headers.authorization)

            return {success, data: data};
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
