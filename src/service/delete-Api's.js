import axios from "axios";

import { Api, headers, jwtExpired, setToken,  } from "./constant";

export const generalDeleteFromList = (url, id, index, filterData, data) => {
    return axios
        .delete( `${Api}${url}/${id}`, {headers:headers()})
        .then((res) => {
            const { success, message } = res.data;
            jwtExpired(message)
            if (success){  
                setToken(res.headers && res.headers.authorization)
                filterData.splice(index,1) // deleting Index
                if (data){ //searching data  to show in filterData
                    data.splice(index,1) // deleting Index
                }
                
                return {success, data, filterData} //Set the data...
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

export const generalDeleteFromEntity = (url, id, index, history) => {
    return axios
        .delete( `${Api}${url}/${id}`, {headers:headers()})
        .then((res) => {
            const { success, message } = res.data;
            jwtExpired(message)
            if (success){  
                setToken(res.headers && res.headers.authorization)
                history.goBack()
                return {success} //Set the data...
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