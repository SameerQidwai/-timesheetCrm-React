import { notification } from "antd";
import axios from "axios";
import { Api, formatDate, headers, jwtExpired, parseDate, setToken } from "./constant";
import moment from 'moment'

const url = `${Api}/auth`;

export const getNotifications = (query) => {
    return axios
        .get(`${url}/notifications?${query}`, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            if (success)  setToken(res?.headers?.authorization)

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

export const getRecentNotifications = (redirect) => {
    
    return axios
        .get(`${url}/unclearedNotifications`, {headers:headers()})
        .then((res) => {
            let { success, data, message } = res.data;
            jwtExpired(message)
            let counter = 0
            if (success){
                counter = data.length
                data= data.filter(notify => {
                    if(Math.abs(moment().utcOffset(0, true).diff(formatDate(notify.createdAt)), 'seconds')  <= 10000){
                    notification.info({
                        message: notify.title,
                        description: notify.content,
                        onClick:()=>{
                            notification.destroy();
                            redirect.push(notify.url);
                        },
                        className: 'mouse-pointer',
                        placement: 'bottomRight'
                    })
                        return true
                    // }else{
                    //     return false
                    }
                });
            }  
            setToken(res?.headers?.authorization)
            return { success, data, counter };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const markAsRead = (notificationIds=[]) => {
    return axios
        .patch(`${url}/readNotifications?notificationIds=${notificationIds}`,{}, {headers:headers()})
        .then((res) => {
            const { success, message } = res.data;
            jwtExpired(message)
            if (success)  setToken(res?.headers?.authorization)

            return { success: success};
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const markAsUnRead = (notificationIds=[]) => {
    return axios
        .patch(`${url}/unreadNotifications?notificationIds=${notificationIds}`,{}, {headers:headers()})
        .then((res) => {
            const { success, message } = res.data;
            jwtExpired(message)
            if (success)  setToken(res?.headers?.authorization)

            return { success: success};
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const clearNotification = () => {
    return axios
        .patch(`${url}/clearNotifications`,{}, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            if (success)  setToken(res?.headers?.authorization)

            return { success: success };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};
