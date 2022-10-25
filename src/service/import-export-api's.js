import axios from "axios";
import { message as messageAlert } from "antd";

import { Api, apiErrorRes, headers, jwtExpired, setToken, localStore } from "./constant";

export const transfer = (action, type, file, config) => {
    messageAlert.loading({ content: 'Loading...', key: type })
    return axios
        .post(`${Api}/data/${action}/${type}`,file, {headers: config ? {"content-type": "multipart/form-data", Authorization: localStore().accessToken}: headers()})
        .then((res) => {
            const { success , message, data} = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: type})
            if (success) 
                setToken(res?.headers?.authorization)
            return {success, data};
        })
        .catch((err) => {
            return apiErrorRes(err, type, 5)
        });
};

export const status = () => {
    return axios
        .get(`${Api}/data/status`, {headers: headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            if (success) {
                setToken(res?.headers?.authorization)
                return { success, data }
            };
            return { success: false }
        })
        .catch((err) => {
            return apiErrorRes(err, `type`, 1)
        });
};