import axios from "axios";
import { Api } from "./constant";
import moment from "moment";
const url = `${Api}/projects`;

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
            // console.log(data);
            if (success) {
                const basic = {
                    id: data.id,
                    panelId: data.panelId,
                    organizationId: data.organizationId,
                    organizationName: data.organization && data.organization.name,
                    // organizationId: data.organizationId,
                    ContactName: data.contactPerson && data.contactPerson.firstName +' '+ data.contactPerson.lastName ,
                    contactPersonId: data.contactPersonId,
                    qualifiedOps: data.qualifiedOps,
                    type: data.type,
                    // value: data.value? data.value: 0,
                    title: data.title,
                    stateId: data.stateId
                }
                const tender = {
                    tender: data.tender,
                    tenderNumber: data.tenderNumber,
                }
                const billing = {
                    cmPercentage: data.cmPercentage? data.cmPercentage: 0,
                    cm$: data.value * data.cmPercentage /100,
                    getPercentage: data.getPercentage ? data.getPercentage: 0,
                    goPercentage: data.goPercentage? data.goPercentage: 0,
                    // these Four keys are for Profit and lost
                    totalMonths: (data.startDate && data.endDate) ? Math.round(moment(data.endDate).diff(moment(data.startDate), 'months', true)) : 0, 
                    endDate: data.endDate ? moment(data.endDate): null,
                    startDate: data.startDate ? moment(data.startDate): null,
                    value: data.value? data.value: 0,
                }
                billing.goget = (billing.getPercentage* billing.goPercentage)/100
                billing.discount = (data.value * billing.goget) /100
                billing.upside = (data.value - billing.discount)
                
                const dates = {
                    entryDate: data.entryDate && moment(data.entryDate),
                    startDate: data.startDate && moment(data.startDate),
                    hoursPerDay: data.hoursPerDay,
                    endDate: data.endDate && moment(data.endDate),
                    bidDate: data.bidDate && moment(data.bidDate)
                }
                const manage = {
                    accountDirectorId: data.accountDirectorId,
                    accountManagerId: data.accountManagerId,
                    projectManagerId: data.projectManagerId,
                }
                data.ContactName= data.contactPerson && data.contactPerson.firstName + ' ' + data.contactPerson.lastName
                return {success, data, basic, tender, billing, dates, manage};
            }
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

export const addLeadSkill = (id, data) => {
    return axios
        .post(url + `/${id}/resources`, data)
        .then((res) => {
            const { success, data } = res.data;
            if (success) return {success, data: data[0]};
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const getLeadSkills = (id)=>{
    return axios
        .get(url + `/${id}/resources`)
        .then((res) => {
            const { success, data } = res.data;
            if (success) {
                // console.log(data);
                return { success: success, data: data }
            };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const getLeadSkill = (oppId, resId) => {
    return axios
        .get(url + `/${oppId}/resources/${resId}`)
        .then((res) => {
            const { success, data } = res.data;
            console.log(data);
            if (success){
                let obj = {
                    panelSkillId:  data.panelSkillId,
                    panelSkillStandardLevelId:  data.panelSkillStandardLevelId,
                    contactPersonId:  data.opportunityResourceAllocations && data.opportunityResourceAllocations.contactPersonId,
                    billableHours: data.billableHours,
                    buyingRate:  data.opportunityResourceAllocations && data.opportunityResourceAllocations.buyingRate,
                    sellingRate:  data.opportunityResourceAllocations && data.opportunityResourceAllocations.sellingRate,
                }
                console.log(obj);
                return {success, data: data[0]}
            }
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const editLeadSkill = (oppId, resId, data) => {
    return axios
        .put(url + `/${oppId}/resources/${resId}`, data)
        .then((res) => {
            const { success, data } = res.data;
            if (success) return {success, data: data[0]};
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const delLeadSkill = (oppId, resId) => {
    console.log(oppId, resId);
    return axios
        .delete(url + `/${oppId}/resources/${resId}`)
        .then((res) => {
            const { success } = res.data;
            console.log(res);
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

export const addLeadSkillResource = (oppId, skillId,  data) => {
    return axios
        .post(url + `/${oppId}/resources/${skillId}/allocations`, data)
        .then((res) => {
            const { success, data } = res.data;
            console.log(data);
            if (success) return {success, data: data};
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const getLeadSkillResource = (oppId,skillId, resId) => {
    return axios
        .get(url + `/${oppId}/resources/${skillId}/allocations/${resId}`)
        .then((res) => {
            const { success, data } = res.data;
            return {success, data}
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const editLeadSkillResource = (oppId, skillId, resId, data) => {
    console.log({oppId, skillId, resId, data});
    return axios
        .put(url + `/${oppId}/resources/${skillId}/allocations/${resId}`, data)
        .then((res) => {
            const { success, data } = res.data;
            if (success) return {success, data};
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const delLeadSkillResource = (oppId, skillId, resId,) => {
    return axios
        .delete(url + `/${oppId}/resources/${skillId}/allocations/${resId}`)
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

export const selectLeadSkillResource = (oppId, skillId, resId) => {
    console.log(oppId, skillId, resId);
    return axios
        .patch(url + `/${oppId}/resources/${skillId}/allocations/${resId}/mark-as-selected`)
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