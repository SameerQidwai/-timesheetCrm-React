import axios from "axios";
import { message as messageAlert} from "antd";

import { Api, headers, jwtExpired, setToken, thumbUrl } from "./constant";
import moment from "moment";

const url = `${Api}/sub-contractors`;

export const getList = () => {
    return axios
        .get(url, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            setToken(res.headers && res.headers.authorization)
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
        .get(url + `/${id}`, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            if (success) {
                const {basic, kin, billing}= reStructure(data)
                setToken(res.headers && res.headers.authorization)
                return {success, data, basic, billing, kin}
            }
            return { success: false}
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const addList = (data) => {
    messageAlert.loading({ content: 'Loading...', key: 1 })
    return axios
        .post(url, data, {headers:headers()})
        .then((res) => {
            const { success, message } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: 1})
            if (success) {
                setToken(res.headers && res.headers.authorization)
                return {success, data: res.data};
            }
            return {success: false }
        })
        .catch((err) => {
            messageAlert.error({ content: err.message, key: 1})
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const delList = (id) => {
    return axios
        .delete(url + `/${id}`, {headers:headers()})
        .then((res) => {
            const { success, message } = res.data;
            jwtExpired(message)
            if (success) setToken(res.headers && res.headers.authorization)
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

export const editList = (id, data) => {
    messageAlert.loading({ content: 'Loading...', key: id })
    return axios
        .put(url + `/${id}`, data, {headers:headers()})
        .then((res) => {
            const { success, message } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: id})
            if (success) setToken(res.headers && res.headers.authorization)
            return {success};
        })
        .catch((err) => {
            messageAlert.error({ content: err.message, key: id})
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

function reStructure(data) {
    const contactPerson = data.contactPersonOrganization ? data.contactPersonOrganization.contactPerson : {}
    const basic = {
        cpCode: `Sub-00${contactPerson.id}`,
        firstName: contactPerson.firstName,
        lastName: contactPerson.lastName,
        gender: contactPerson.gender,
        dateOfBirth: contactPerson.dateOfBirth ? moment(contactPerson.dateOfBirth): null,
        phoneNumber: contactPerson.phoneNumber,
        email: contactPerson.email,
        address: contactPerson.address,
        stateId:contactPerson.stateId,
        username: data.username,
        roleId: data.roleId
    }
    const kin = {
        nextOfKinDateOfBirth: data.nextOfKinDateOfBirth? moment(data.nextOfKinDateOfBirth) : null,
        nextOfKinEmail: data.nextOfKinEmail,
        nextOfKinGender: data.nextOfKinGender,
        nextOfKinName:  data.nextOfKinName,
        nextOfKinPhoneNumber: data.nextOfKinPhoneNumber,
        nextOfKinRelation: data.nextOfKinRelation
    }
    const employmentContracts = data.employmentContracts.length >0 ? data.employmentContracts[0] : {}
    const billing ={
        employeeId: employmentContracts.employeeId,
        payslipEmail: employmentContracts.payslipEmail, 
        startDate: employmentContracts.startDate ? moment(employmentContracts.startDate) : null, 
        endDate: employmentContracts.endDate ? moment(employmentContracts.endDate) : null,
        noOfHours: employmentContracts.noOfHours, 
        noOfHoursPer: employmentContracts.noOfHoursPer, 
        remunerationAmount:employmentContracts.remunerationAmount,
        remunerationAmountPer: employmentContracts.remunerationAmountPer,  
        comments: employmentContracts.comments,
        fileId: employmentContracts.fileId,
        file: employmentContracts.fileId ? [{
            id: employmentContracts.file.id,
            createdAt: employmentContracts.file.createdAt,
            fileId: employmentContracts.file.id,
            uid: employmentContracts.file.uniqueName,
            name: employmentContracts.file.originalName,
            type: employmentContracts.file.type,
            url: `${Api}/files/${employmentContracts.file.uniqueName}`,
            thumbUrl: thumbUrl(employmentContracts.file.type)
        }] :[]
    }
    return {basic, kin, billing}
}