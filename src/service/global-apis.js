import axios from "axios";
import { message as messageAlert } from "antd";

import { Api, apiErrorRes, formatDate, headers, jwtExpired, setToken } from "./constant";

const global_url = `${Api}/global-setting`;
const var_url = `${Api}/global-variables`;

export const getSettings = () => {
    return axios
        .get(global_url, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            if (success) setToken(res?.headers?.authorization)
            return { success, data };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const upadteSettings = (data) => {
    messageAlert.loading({ content: 'Loading...', key: 1 },5)
    return axios
        .post(global_url, data, {headers:headers()})
        .then((res) => {
            const { success, message, data } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: 1},5)
            setToken(res?.headers?.authorization)
            let response = {}
            if (success){ 
                data.forEach(({keyLabel, keyValue}) => {
                    response[keyLabel] = keyValue;
                });
            }
            
            return {success, data: response};
        })
        .catch((err) => {
                        messageAlert.error({ content: 'Error!', key: 1},5)
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const getVariables = (query) => {
    return axios
        .get(var_url + (query? `?variableName=${query}`: ''), {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            setToken(res?.headers?.authorization)
            let variables= {}
            if (success) {
                if (!query){
                    for (var {variable, globalVariableId, value, startDate, endDate} of data){
                        variables[variable?.name] = {globalVariableId, value, startDate: formatDate(startDate), endDate: formatDate(endDate)}
                    }
                }else{
                    variables = data?.values??[]
                }
            }
            return { success, data: variables };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const upadteVariables = (data) => {
    messageAlert.loading({ content: 'Loading...', key: 1 },5)
    return axios
        .post(`${var_url}/create-update`, data, {headers:headers()})
        .then((res) => {
            const { success, message, data } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: 1},5)
            setToken(res?.headers?.authorization)
            let variables= {}
            if (success) {
                data.forEach(({name, values: [{globalVariableId, value, startDate, endDate}]}) =>{
                    variables[name] = {globalVariableId, value, startDate: formatDate(startDate), endDate: formatDate(endDate)}
                })
            }
            return { success, data: variables };
        })
        .catch((err) => {
            return apiErrorRes(err, 1, 5)
        });
};
