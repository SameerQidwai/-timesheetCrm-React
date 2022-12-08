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