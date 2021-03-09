import axios from "axios";

import { Api } from "./constant";

export const getStates = () => {
    return axios
        .get(`${Api}/states`)
        .then((res) => {
            const { success, data } = res.data;
            var states = []
            data.map((el) => {
                states.push({value: el.id, label: el.label})
            });
            if (success) return { success: success, data: states };
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
        .get(`${Api}/standard-skills`)
        .then((res) => {
            const { success, data } = res.data;
            var standlevel = []
            data.map((el) => {
                standlevel.push({value: el.id, label: el.label,  levels: el.standardSkillStandardLevels.map(lvlEl=>{ return { value:lvlEl.id, label: lvlEl.standardLevel.label}})})
            });
            if (success) return { success: success, data: standlevel };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const getContactPersons = () =>{
    return axios
    .get(`${Api}/contactpersons`)
    .then((res) => {
        const { success, data } = res.data;
        var cps = []
        data.map((el) => {
            cps.push({value: el.id, label: el.firstName +' ' +el.lastName})
        });
        if (success) return { success: success, data: cps };
    })
    .catch((err) => {
        return {
            error: "Please login again!",
            success: false,
            message: err.message,
        };
    });
}

export const getEmployees = () => {
    return axios
        .get(`${Api}/employees`)
        .then((res) => {
            const { success, data } = res.data;
            var cps = []
            console.log(data);
            data.map((el) => {
                cps.push({value: el.id, label: el.contactPersonOrganization.contactPerson.firstName +' ' +el.contactPersonOrganization.contactPerson.lastName})
            });
            console.log(cps);
            if (success) return { success: success, data: cps };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const getOrgPersons = (id) =>{
    console.log(id);
    return axios
    .get(`${Api}/sub-contractors/get/contact-persons?organizationId=${id}`)
    .then((res) => {
        console.log(res);
        const { success, data } = res.data;
        var cps = []
        data.map((el) => {
            cps.push({value: el.id, label: el.firstName +' ' +el.lastName})
        });
        if (success) return { success: success, data: cps };
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
        .get(`${Api}/Organizations`)
        .then((res) => {
            const { success, data } = res.data;
            var orgs = []
            // console.log(data);
            data.map((el) => {
                orgs.push({value: el.id, label: el.name, disabled: el.id === id && true})
            });
            if (success) return { success: success, data: orgs };
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
        .get(`${Api}/panels`)
        .then((res) => {
            const { success, data } = res.data;
            var panels = []
            data.map((el) => {
                panels.push({ value: el.id, label: el.label })
            });
            if (success) return { success: success, data: panels };
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
        .get(`${Api}/panel-skills?panelId=${id}`)
        .then((res) => {
            const { success, data } = res.data;
            var panelskill = []
            data.map((el) => {
                panelskill.push({value: el.id, label: el.label,  levels: el.panelSkillStandardLevels.map(lvlEl=>{ return { value:lvlEl.id, label: lvlEl.levelLabel}})})
            });
            if (success) return { success: success, data: panelskill };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};