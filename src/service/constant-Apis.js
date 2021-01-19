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
                success: "failed",
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
                success: "failed",
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
        console.log(cps);
        if (success) return { success: success, data: cps };
    })
    .catch((err) => {
        return {
            error: "Please login again!",
            success: "failed",
            message: err.message,
        };
    });
}