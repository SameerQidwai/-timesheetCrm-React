import axios from "axios";

import { Api } from "./constant";

const url = `${Api}/comments/`;


export const addComment = (targetType, targetId, data) => {
    // const header ={ 'content-type': 'multipart/form-data',  'Accept': 'application/json'}
    console.log(`data`, data)
    return axios
        .post(`${url}${targetType}/${targetId}`, data)
        .then((res) => {
            const { status } = res;
            if (status === 200) {
                const { success, data } = res.data;
                console.log('after data',data);
                return { success, data };
            }
        })
        .catch((err) => {
            console.log(err);
            return {}
            // return {
            //     error: err.response.status,
            //     status: false,
            //     message: err.message,
            // };
        });
};

export const getComments = (targetType, targetId) => {
    return axios
        .get(`${url}${targetType}/${targetId}`)
        .then((res) => {
            const { success, data } = res.data;
            if (success) return { success, data  };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const delComments = (id,) => {
    return axios
        .delete(`${url}${id}`)
        .then((res) => {
            const { success } = res.data;
            if (success) return { success };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};