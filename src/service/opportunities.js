import axios from "axios";
import { Api } from "./constant";
import moment from "moment";
const url = `${Api}/opportunities`;

export const addList = (data) => {
    return axios
        .post(url, data)
        .then((res) => {
            const { success } = res.data;
            if (success) return {success};
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

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

export const getRecord = (id) => {
    return axios
        .get(url + `/${id}`)
        .then((res) => {
            const { success, data } = res.data;
            const basic = {
                id: data.id,
                panelId: data.panelId,
                organisationId: data.organisationId,
                organisationName: data.organisation && data.organisation.name,
                organisationId: data.organisationId,
                ContactName: data.contactPerson && data.contactPerson.firstName + data.contactPerson.lastName ,
                contactPersonId: data.contactPersonId,
                qualifiedOps: data.qualifiedOps,
                type: data.type,
                value: data.value,
                title: data.title,
                stateId: data.stateId
            }
            const tender = {
                tender: data.tender,
                tenderNumber: data.tenderNumber,
                tenderValue: data.tenderValue
            }
            const billing = {
                cmPercentage: data.cmPercentage,
                getPercentage: data.getPercentage,
                goPercentage: data.goPercentage
            }
            const dates = {
                entryDate: moment(data.entryDate),
                startDate: moment(data.startDate),
                endDate: moment(data.endDate),
                bidDate: moment(data.bidDate)
            }
            if (success) return {success, data, basic, tender, billing, dates};
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};


export const delList = (id) => {
    return axios
        .delete(url + `/${id}`)
        .then((res) => {
            const { success } = res.data;
            if (success) return {success};
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const editList = (data) => {
    return axios
        .put(url + `/${data.id}`, data)
        .then((res) => {
            const { success } = res.data;
            if (success) return {success};
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const addResource = (id, data) => {
    return axios
        .post(url + `/${id}/resources`, data)
        .then((res) => {
            const { success } = res.data;
            if (success) return {success};
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const getResources = (id)=>{
    return axios
        .get(url + `/${id}/resources`)
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

export const getResource = (oppId, resId) => {
    return axios
        .get(url + `/${oppId}/resources/${resId}`)
        .then((res) => {
            const { success, data } = res.data;
            return {success, data: data[0]}
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const editResource = (oppId, resId, data) => {
    return axios
        .put(url + `/${oppId}/resources/${resId}`, data)
        .then((res) => {
            const { success } = res.data;
            if (success) return {success};
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const delResource = (oppId, resId) => {
    return axios
        .delete(url + `/${oppId}/resources/${resId}`)
        .then((res) => {
            const { success } = res.data;
            if (success) return {success};
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};