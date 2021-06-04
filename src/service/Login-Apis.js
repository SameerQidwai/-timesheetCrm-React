import { message } from "antd";
import axios from "axios";

import { Api, localStore } from "./constant";

export const login = (data) => {
    return axios
        .post(`${Api}/login`, data)
        .then((res) => {
            const { success, data } = res.data;
                    message.success({ content: 'Success!', key: 'logout'})
                    console.log(res);
            if (success) return {success, data};
        })
        .catch((err) => {
                message.error({ content: 'Error!', key: 'logout'})
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