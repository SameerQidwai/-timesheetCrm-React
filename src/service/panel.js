import axios from "axios";

import { Api } from "./constant";

const url = `${Api}/panels`;

// export const timeOff = () => {
//     return axios
//         .get(`${Api}/panels`)
//         .then((res) => {
//             const { success, data } = res.data;
//             data.map((el) => {
//                 el.value = el.id;
//                 delete el.id;
//                 delete el.createdAt;
//                 delete el.deletedAt;
//                 delete el.updatedAt;
//             });
//             if (success) return { success: success, data: data };
//         })
//         .catch((err) => {
//             return {
//                 error: "Please login again!",
//                 success: false,
//                 message: err.message,
//             };
//         });
// };

export const getList = () => {
    return axios
        .get(url)
        .then((res) => {
            const { success, data } = res.data;
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

export const addList = (data) => {
    return axios
        .post(url, data)
        .then((res) => {
            const { success } = res.data;
            if (success) return success;
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const delLabel = (id) => {
    return axios
        .delete(url + `/${id}`)
        .then((res) => {
            const { success } = res.data;
            if (success) return success;
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const editLabel = (data) => {
    return axios
        .put(url + `/${data.id}`, data)
        .then((res) => {
            const { success } = res.data;
            if (success) return success;
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};
