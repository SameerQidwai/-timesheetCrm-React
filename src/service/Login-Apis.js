import { message as messageAlert } from "antd";
import axios from "axios";

import { Api, localStore, headers } from "./constant";

export const login = (data) => {
    return axios
        .post(`${Api}/login`, data)
        .then((res) => {
            const { success, data, message } = res.data;
                    messageAlert.success({ content: message, key: 'logout'})
            if (success) return {success, data};
        })
        .catch((err) => {
                messageAlert.error({ content: err.message, key: 'logout'})
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const upadtePassword = (data) => {
    return axios
        .patch(`${Api}/password`, data, {headers:headers})
        .then((res) => {
            const { success, data, message } = res.data;
                    messageAlert.success({ content: message, key: 'logout'})
            if (success) return {success, data};
        })
        .catch((err) => {
                messageAlert.error({ content: 'Error!', key: 'logout'})
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const upadteSettings = (data) => {
    return axios
        .patch(`${Api}/settings`, data, {headers: headers})
        .then((res) => {
            const { success, data, message } = res.data;
                    messageAlert.success({ content: message, key: 'logout'})
            if (success) return {success, data};
        })
        .catch((err) => {
                messageAlert.error({ content: 'Error!', key: 'logout'})
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const loggedIn = () =>{
    if (localStore().accessToken){
        return true
    }else{
        return false
    }
}