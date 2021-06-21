import { message as messageAlert } from "antd";
import axios from "axios";

import { Api, localStore, headers } from "./constant";
import moment from "moment";

export const login = (data) => {
    return axios
        .post(`${Api}/login`, data)
        .then((res) => {
            const { success, data, message } = res.data;
                messageAlert.success({ content: message, key: 'logout'})
            if (success){
                let permissions = {}
                let role = data.role
                console.log(data.role);
                delete data.role
                role.permissions.map(el=>{
                    if (permissions[el.resource]){
                        permissions[el.resource][`${el.action}${el.grant}`] = true
                    }else { 
                        var key = `${el.action}${el.grant}`
                        console.log(key);
                        permissions[el.resource] = {[key]: true}
                    }
                })
                const keys = Object.keys(data)
                let len = keys.length
                while ( len-- ) {
                    const key = keys[len]
                    localStorage.setItem(key, data[key])
                }
                return {success, data};
            } 
            
        })
        .catch((err) => {
                messageAlert.error({ content: err.message, key: 'logout'})
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const upadtePassword = (data) => {
    return axios
        .patch(`${Api}/password`, data, {headers:headers})
        .then((res) => {
            const { success, data, message } = res.data;
                    messageAlert.success({ content: message, key: 'logout'})
            if (success) return {success, data};
        })
        .catch((err) => {
                messageAlert.error({ content: 'Error!', key: 'logout'})
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const getSettings = () => {
    return axios
        .get(`${Api}/settings`, {headers: headers})
        .then((res) => {
            const { success, data, message } = res.data;
            console.log('res',res);
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
                    username: data.username,
                    password: data.password
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
                return { success, data, basic, detail, kin, bank, billing }
            }
        })
        .catch((err) => {
            console.log('err',err);
            // messageAlert.error({ content: message, key: 'logout'})
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const upadteSettings = (data) => {
    return axios
        .patch(`${Api}/settings`, data, {headers: headers})
        .then((res) => {
            const { success, data, message } = res.data;
                    messageAlert.success({ content: message, key: 'logout'})
            if (success) return {success, data};
        })
        .catch((err) => {
                messageAlert.error({ content: 'Error!', key: 'logout'})
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const loggedIn = () =>{
    if (localStore().accessToken){
        return true
    }else{
        return false
    }
}