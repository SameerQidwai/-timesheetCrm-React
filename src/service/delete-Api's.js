import axios from "axios";

import { Api, headers, jwtExpired, setToken,  } from "./constant";

export const generalDelete = (url, id, index, data, filterdata) => {
    return axios
        .delete( `${Api}${url}/${id}`, {headers:headers()})
        .then((res) => {
            const { success, message } = res.data;
            jwtExpired(message)
            if (success){  
                setToken(res.headers && res.headers.authorization)
                data.splice(index,1) // deleting Index
                filterdata.splice(index,1) // deleting Index
                return {success, data, filterdata} //Set the data...
            }
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