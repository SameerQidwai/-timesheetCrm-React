import axios from "axios";

import { Api } from "./constant";
import moment from "moment";

const url = `${Api}/employees`;

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
            if (success) {
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
                    username: data.username
                }
                const detail = {
                    superannuationName: data.superannuationName,
                    superannuationBankName: data.superannuationBankName,
                    superannuationBankAccountOrMembershipNumber: data.superannuationBankAccountOrMembershipNumber,
                    superannuationAbnOrUsi: data.superannuationAbnOrUsi,
                    superannuationBankBsb: data.superannuationBankBsb,
                    superannuationAddress: data.superannuationAddress,
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
                    smsfBankAccountId: bankAccount.smsfBankAccountId,
                    bankName: bankAccount.name,
                    bankAccountNo: bankAccount.accountNo,
                    bankBsb: bankAccount.bsb,
                    memberNumber: data.memberNumber,
                    taxFreeThreshold: data.taxFreeThreshold,
                    helpHECS: data.helpHECS,
                }
                const employmentContracts = data.employmentContracts.length >0 ? data.employmentContracts[0] : {}
                const billing ={
                    employeeId: employmentContracts.employeeId,
                    payslipEmail: employmentContracts.payslipEmail, 
                    membershipAccountNo: employmentContracts.membershipAccountNo, 
                    payFrequency: employmentContracts.payFrequency, 
                    startDate: employmentContracts.startDate ? moment(employmentContracts.startDate) : null, 
                    endDate: employmentContracts.endDate ? moment(employmentContracts.endDate) : null,
                    type: employmentContracts.type, 
                    noOfHours: employmentContracts.noOfHours, 
                    noOfHoursPer: employmentContracts.noOfHoursPer, 
                    remunerationAmount:employmentContracts.remunerationAmount,
                    remunerationAmountPer: employmentContracts.remunerationAmountPer,  
                    comments: employmentContracts.comments
                }
                const smsf = {
                    training: data.training,
                }
                return {success, data, basic, detail, kin, bank, billing, smsf}
            };
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
    return axios
        .post(url, data)
        .then((res) => {
            const { success } = res.data;
            if (success) return {success: true, data: res.data};
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

export const editList = (id, data) => {
    return axios
        .put(url + `/${id}`, data)
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
