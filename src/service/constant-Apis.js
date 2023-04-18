import axios from "axios";
import { message as messageAlert } from "antd";

import { Api, headers, jwtExpired, setToken, sorting } from "./constant";

export const getStates = () => {
    return axios
        .get(`${Api}/states`,{headers:headers()})
        .then((res) => {
            const { success, data } = res.data;
            var states = []
            data.map((el) => {
                states.push({value: el.id, label: el.label})
            });
            setToken(res?.headers?.authorization)
            if (success) return { success: success, data: sorting(states, 'label') };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};
export const getleaveRequestTypes = () => {
    return axios
        .get(`${Api}/leave-request-types`,{headers:headers()})
        .then((res) => {
            const { success, data } = res.data;
            let types = data.map((el) => {
               return {value: el.id, label: el.label}
            });
            setToken(res?.headers?.authorization)
            if (success) return { success: success, data: sorting(types, 'label') };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const getStandardSkills = () => {
    return axios
        .get(`${Api}/standard-skills`, {headers:headers()})
        .then((res) => {
            const { success, data } = res.data;
            var standlevel = []
            data.map((el) => {
                standlevel.push({value: el.id, label: el.label,  levels: el.standardSkillStandardLevels.map(lvlEl=>{ return { value:lvlEl.id, label: lvlEl.standardLevel.label}})})
            });
            setToken(res?.headers?.authorization)
            if (success) return { success: success, data: sorting(standlevel, 'label') };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const getStandardLevels = () => {
    return axios
        .get(`${Api}/standard-levels`, {headers:headers()})
        .then((res) => {
            let { success, data, message } = res.data;
            
            if (success){
                data = data.map((el) => ({ value: el.id, label: el.label }));
            }  
            setToken(res?.headers?.authorization)
            return { success: success, data: data };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const getContactPersons = () =>{ //NOT IN USE
    return axios
    .get(`${Api}/contactpersons`, {headers:headers()})
    .then((res) => {
        const { success, data } = res.data;
        var cps = []
        data.map((el) => {
            cps.push({value: el.id, label: el.firstName +' ' +el.lastName})
        });
        setToken(res?.headers?.authorization)
        if (success) return { success: success, data: sorting(cps, 'label') };
    })
    .catch((err) => {
        return {
            error: "Please login again!",
            success: false,
            message: err.message,
        };
    });
}

export const getEmployees = () => { //NOT IN USE
    return axios
        .get(`${Api}/employees`, {headers:headers()})
        .then((res) => {
            const { success, data } = res.data;
            var cps = []          
            if (success) {
                data.map((el) => {
                    cps.push({value: el.contactPersonOrganization.contactPerson.id, label: el.contactPersonOrganization.contactPerson.firstName +' ' +el.contactPersonOrganization.contactPerson.lastName + '   '+'(Employee)', status: '(Employee)'})
                });
                setToken(res?.headers?.authorization)
                return { success: success, data: sorting(cps, 'label') }
            }
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const getSubContractors = () => { //NOT IN USE
    return axios
        .get(`${Api}/sub-contractors`, {headers:headers()})
        .then((res) => {
            const { success, data } = res.data;
            var cps = []    
            if (success) {
                data.map((el) => {
                    cps.push({value: el.contactPersonOrganization.contactPerson.id, label: el.contactPersonOrganization.contactPerson.firstName +' ' +el.contactPersonOrganization.contactPerson.lastName + '   '+ '(Sub-Contractor)', status: '(Sub-Contractor)'})
                });
                setToken(res?.headers?.authorization)
                return { success: success, data: sorting(cps, 'label') };
            }
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const getOrgPersons = (url) =>{
    return axios
    .get(`${Api}/${url}`, {headers:headers()})
    .then((res) => {
        const { success, data } = res.data;
        setToken(res?.headers?.authorization)
        if (success) return { success: success, data:  sorting(data, 'label') };
    })
    .catch((err) => {
        return {
            error: "Please login again!",
            success: false,
            message: err.message,
        };
    });
}

export const getEmpPersons = (id) =>{ //NOT IN USE
    return axios
    .get(`${Api}/employees/get/contact-persons`, {headers:headers()})
    .then((res) => {
        const { success, data } = res.data;
        var cps = []
        data.map((el) => {
            cps.push({value: el.id, label: el.firstName +' ' +el.lastName})
        });
        setToken(res?.headers?.authorization)
        if (success) return { success: success, data: sorting(cps, 'label')  };
    })
    .catch((err) => {
        return {
            error: "Please login again!",
            success: false,
            message: err.message,
        };
    });
}

export const getOrganizations = (id) => {
    return axios
        .get(`${Api}/Organizations`, {headers:headers()})
        .then((res) => {
            const { success, data } = res.data;
            var orgs = []
            data.map((el) => {
                orgs.push({value: el.id, label: el.name, disabled: el.id === id && true})
            });
            setToken(res?.headers?.authorization)
            if (success) return { success: success, data: sorting(orgs, 'label') };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const getPanels = () => {
    return axios
        .get(`${Api}/panels`, {headers:headers()})
        .then((res) => {
            const { success, data } = res.data;
            var panels = []
            data.map((el) => {
                panels.push({ value: el.id, label: el.label })
            });
            setToken(res?.headers?.authorization)
            if (success) return { success: success, data: sorting(panels, 'label') };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const getPanelSkills = (id) => {
    return axios
        .get(`${Api}/panel-skills?panelId=${id}`, {headers:headers()})
        .then((res) => {
            const { success, data } = res.data;
            var panelskill = []
            data.map((el) => {
                panelskill.push({
                    value: el.id, 
                    label: el.label,  
                    levels: el.panelSkillStandardLevels.map(lvlEl=>{ 
                        return { 
                            value:lvlEl.id, 
                            label: lvlEl.levelLabel, 
                            stceil: lvlEl.shortTermCeil,
                            ltceil: lvlEl.longTermCeil
                            
                        }
                    })
                })
            });
            setToken(res?.headers?.authorization)
            if (success) return { success: success, data: sorting(panelskill, 'label') };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const getProjects = () => {
    return axios
        .get(`${Api}/projects`, { headers: headers() })
        .then((res) => {
            const { success, data } = res.data;
            let work = []
            if (success) {
                data.map((el) => {work.push({ value: el.id, label: el.title}) });
                setToken(res?.headers?.authorization)
            }
            return { success: success, data: sorting(work, 'label') };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const getUserProjects = (userId, mod, phase) => {
    return axios
        .get(`${Api}/helpers/projects?userId=${userId}&mod=${mod}&phase=${phase}`, { headers: headers() })
        .then((res) => {
            const { success, data } = res.data;
            if (success) {
                setToken(res?.headers?.authorization)
            }
            return { success: success, data: sorting(data, 'label') };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const getUserMilestones = (query) => {
    const {userId, phase, startDate, endDate,} = query
    return axios
        .get(`${Api}/helpers/milestones?userId=${userId}&phase=${phase}&startDate=${startDate}&endDate=${endDate}`, { headers: headers() })
        .then((res) => {
            const { success, data } = res.data;
            if (success) {
                setToken(res?.headers?.authorization)
            }
            return { success: success, data: sorting(data, 'label') };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const getSkillLevels = (skill) =>{
    return axios
        .get(`${Api}/helpers/levels-by-skill?${skill}`, {headers:headers()})
        .then((res) => {
            const { success, data } = res.data;
            var pros = []
            if (success){
                setToken(res?.headers?.authorization)
                return { success: success, data: sorting(data, 'label') };
            }
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
}

export const getRoles = () =>{
    return axios
        .get(`${Api}/helpers/roles`, {headers:headers()})
        .then((res) => {
            const { success, data } = res.data;
            if (success){
                setToken(res?.headers?.authorization)
                return { success: success, data: sorting(data, 'label') };
            }
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
}

export const entityProjects = (url, options) =>{
    return axios
    .get(`${Api}/${url}`, {headers:headers()})
    .then((res) => {
        const { success, data } = res.data;
        setToken(res?.headers?.authorization)
        if (options) {
            options = data.map((el) => ({ value: el.id, label: el.title}));
        }
        if (success) return { success: success, data: data??[], options: options?? []};
    })
    .catch((err) => {
        return {
            error: "Please login again!",
            success: false,
            message: err.message,
        };
    });
}

export const getLeavePolicy = () => {
    return axios
        .get(`${Api}/leave-request-policies`, {headers:headers()})
        .then((res) => {
            const { success, data } = res.data;
            var policies = []
            data.map((el) => {
                policies.push({value: el.id, label: el.label})
            });
            policies.push({value: 0, label: 'Unpaid'})
            setToken(res?.headers?.authorization)
            if (success) return { success: success, data: sorting(policies, 'label') };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const getUserLeaveType = () => {
    return axios
        .get(`${Api}/leave-request-types/getOwn`, {headers:headers()})
        .then((res) => {
            const { success, data } = res.data;
            setToken(res?.headers?.authorization)
            if (success){
                const {holidays, contractDetails, LeaveRequestTypes = []} = data
                let requestType = [{id: 0, name: 'Unpaid', include_off_days: false}]
                LeaveRequestTypes.forEach((el,index)=>{
                    const type= {}
                    Object.entries(el).forEach(([key, value]) => {
                        var camelToSnakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
                        type[camelToSnakeKey]= value
                    })
                    requestType.push(type)
                })
                return { success: success, data: data, holidays, contractDetails, LeaveRequestTypes: requestType }
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

export const getLineEmployees = () =>{
    return axios
    .get(`${Api}/auth/users`, {headers:headers()})
    .then((res) => {
        const { success, data } = res.data;
        setToken(res?.headers?.authorization)
        if (success) return { success: success, data: sorting(data, 'label') };
    })
    .catch((err) => {
        return {
            error: "Please login again!",
            success: false,
            message: err.message,
        };
    });
}

export const getManageProjects = (resourcePermission) =>{
    return axios
    .get(`${Api}/auth/projects?resource=${resourcePermission}`, {headers:headers()})
    .then((res) => {
        const { success, data } = res.data;
        setToken(res?.headers?.authorization)
        if (success) return { success: success, data: sorting(data, 'label') };
    })
    .catch((err) => {
        return {
            error: "Please login again!",
            success: false,
            message: err.message,
        };
    });
}

export const getCalendarHolidays = (id) => {
    return axios
        .get(`${Api}/calendar-holidays` + `?calendarId=${id}`, {headers:headers()})
        .then((res) => {
            let { success, data, message } = res.data;
            jwtExpired(message)
            if (success) {
                data = data.map((el) => {
                    return el.date 
                });
                setToken(res?.headers?.authorization)
            }
            return { success: success, data: data, };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const getCalendarHolidaysFormat = () => {
    return axios
        .get(`${Api}/calendar-holidays/keyValueFormat`, {headers:headers()})
        .then((res) => {
            let { success, data, message } = res.data;
            jwtExpired(message)
            if (success) {
                setToken(res?.headers?.authorization)
            }
            return { success: success, data: data, };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};


export const buyCost = (url, id, searchIn) => {
    return axios
        .get(`${Api}/${url}/${id}/buy-cost?searchIn=${searchIn}`, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            if (success) setToken(res?.headers?.authorization)

            return { success: success, data: data };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const getReverseCostCal = (type) => {
    return axios
        .get(`${Api}/global-variables/calculator-variable?type=${type}`, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            if (success) setToken(res?.headers?.authorization)

            return { success: success, data: data };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

