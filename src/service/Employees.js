import axios from "axios";
import { message as messageAlert } from "antd";

import { Api, apiErrorRes, headers, jwtExpired, setToken, thumbUrl } from "./constant";
import moment from "moment";

const url = `${Api}/employees`;

export const getList = () => {
    return axios
        .get(url, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            if (success) setToken(res.headers && res.headers.authorization)

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

export const getRecord = (id) => {
    return axios
        .get(url + `/${id}`, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            if (success) {
                const {basic, detail, kin, bank, billing, train} = reStructure(data)
                return {success, data, basic, detail, kin, bank, billing, train}
            };
            return { success }
        })
        .catch((err) => {
            if (err.response?.data){
                const { status } = err.response
                const { message, success } = err.response?.data
                return { authError: message === "Not Authorized!", status, success, message, };
            }
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
            const { success, message, data } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: 1})
            if (success) {
                const { billing } = reStructure(data)
                return { success, data, billing }
            }
            return { success, data };
        })
        .catch((err) => {
            return apiErrorRes(err, 1, 5)
        });
};

export const delList = (id) => {
    return axios
        .delete(url + `/${id}`, {headers:headers()})
        .then((res) => {
            const { success, message } = res.data;
            jwtExpired(message)
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
    console.log(data)
    return axios
        .put(url + `/${id}`, data, {headers:headers()})
        .then((res) => {
            const { success, message, data } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: id})
            if (success) {
                const { billing } = reStructure(data)
                setToken(res.headers && res.headers.authorization)
                return { success, data, billing }
            }
            return { success, data };
        })
        .catch((err) => {
            return apiErrorRes(err, id, 5)
        });
};

export const buyCost = (id) => {
    return axios
        .get(`${url}/${id}/buy-cost`, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            if (success) setToken(res.headers && res.headers.authorization)

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

function reStructure(data) {
    const contactPerson = data.contactPersonOrganization ? data.contactPersonOrganization.contactPerson : {}
    const basic = {
        cpCode: `Emp-00${contactPerson.id}`,
        firstName: contactPerson.firstName,
        lastName: contactPerson.lastName,
        gender: contactPerson.gender,
        dateOfBirth: contactPerson.dateOfBirth ? moment(contactPerson.dateOfBirth): null,
        phoneNumber: contactPerson.phoneNumber,
        email: contactPerson.email,
        address: contactPerson.address,
        stateId:contactPerson.stateId,
        username: data.username,
        password: data.password,
        roleId: data.roleId,
        lineManagerId: data.lineManagerId
    }
    const detail = {
        superannuationName: data.superannuationName,
        superannuationBankName: data.superannuationBankName,
        superannuationBankAccountOrMembershipNumber: data.superannuationBankAccountOrMembershipNumber,
        superannuationAbnOrUsi: data.superannuationAbnOrUsi,
        superannuationBankBsb: data.superannuationBankBsb,
        superannuationAddress: data.superannuationAddress,
        superannuationType: data.superannuationType
    }
    const kin = {
        nextOfKinDateOfBirth: data.nextOfKinDateOfBirth? moment(data.nextOfKinDateOfBirth) : null,
        nextOfKinEmail: data.nextOfKinEmail,
        nextOfKinGender: data.nextOfKinGender,
        nextOfKinName:  data.nextOfKinName,
        nextOfKinPhoneNumber: data.nextOfKinPhoneNumber,
        nextOfKinRelation: data.nextOfKinRelation
    }
    const bankAccount = data.bankAccounts.length > 0 ? data.bankAccounts[0] : {}
    const bank = {
            bankName: bankAccount.name,
            bankAccountNo: bankAccount.accountNo,
            bankBsb: bankAccount.bsb,
            tfn: data.tfn,
            taxFreeThreshold: data.taxFreeThreshold,
            helpHECS: data.helpHECS,
    }
    const employmentContracts = data.employmentContracts.length >0 ? data.employmentContracts[0] : {}

    const billing ={
        employmentContractId: employmentContracts.id,
        employeeId: employmentContracts.employeeId,
        payslipEmail: employmentContracts.payslipEmail, 
        membershipAccountNo: employmentContracts.membershipAccountNo, 
        payFrequency: employmentContracts.payFrequency, 
        startDate: employmentContracts.startDate ? moment(employmentContracts.startDate) : null, 
        endDate: employmentContracts.endDate ? moment(employmentContracts.endDate) : null,
        type: employmentContracts.type, 
        noOfHours: employmentContracts.noOfHours, 
        noOfDays: employmentContracts.noOfDays, 
        noOfHoursPer: employmentContracts.noOfHoursPer, 
        remunerationAmount:employmentContracts.remunerationAmount,
        remunerationAmountPer: employmentContracts.remunerationAmountPer,  
        comments: employmentContracts.comments,
        leaveRequestPolicyId: employmentContracts.leaveRequestPolicyId ?? 0,
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
        }]: []
    }
    const train = {
        training: data.training,
    }
    return {basic, detail, kin, bank, billing, train}
}