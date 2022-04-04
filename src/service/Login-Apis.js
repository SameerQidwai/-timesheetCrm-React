import { message as messageAlert } from "antd";
import axios from "axios";

import { Api, localStore, headers, setToken, jwtExpired } from "./constant";
import moment from "moment";

export const login = (data) => {
    return axios
        .post(`${Api}/login`, data)
        .then((res) => {
            localStorage.clear()
            const { success, data, message } = res.data;
            messageAlert.success({ content: message, key: 'logout'}, 5)
            if (success){
                let permissions = {}
                let role = data.role
                // data.role = role.roleId
                role.permissions.map(el=>{
                    if(!permissions[el.resource]){
                        permissions[el.resource] = {}
                    }
                    if (!permissions[el.resource][el.action]){
                        permissions[el.resource][el.action] = {}
                    }
                    permissions[el.resource][el.action][el.grant] = true
                })
                data.permissions = JSON.stringify(permissions)
                delete data.role.permissions
                data.role = JSON.stringify(data.role)
                const keys = Object.keys(data)
                let len = keys.length -1
                for( len; len>=0; len-- ) {
                    const key = keys[len]
                    localStorage.setItem(key, data[key])
                }
                return {success, data};
            } 
            
        })
        .catch((err) => {
                messageAlert.error({ content: err.message, key: 'logout'}, 5)
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const upadtePassword = (data) => {
    return axios
        .patch(`${Api}/password`, data, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: 'logout'}, 5)
            if (success) setToken(res.headers && res.headers.authorization)
            
            return {success, data};
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

export const getSettings = () => {
    return axios
        .get(`${Api}/auth/settings`, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
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
                    // password: data.password
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
                const employmentContracts = (data.employmentContracts && data.employmentContracts.length >0) ? data.employmentContracts[0] : {}
                const billing ={
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
                }
                const sClearance = {
                    clearanceLevel: contactPerson.clearanceLevel,
                    clearanceGrantedDate: contactPerson.clearanceGrantedDate ? moment(contactPerson.clearanceGrantedDate) : null, 
                    clearanceExpiryDate: contactPerson.clearanceExpiryDate ? moment(contactPerson.clearanceExpiryDate) : null, 
                    clearanceSponsorId: contactPerson.clearanceSponsorId,
                }
                const resourceSkill = contactPerson.standardSkillStandardLevels

                setToken(res.headers && res.headers.authorization)
                return { success, data, basic, detail, kin, bank, billing, sClearance, resourceSkill }
            }
            return { success }
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
        .patch(`${Api}/auth/settings`, data, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: 'logout'})
            if (success) setToken(res.headers && res.headers.authorization)
            return {success, data};
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

export const upadteAddress = (data) => {
    return axios
        .patch(`${Api}/auth/address`, data, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: 'logout'})
            if (success) setToken(res.headers && res.headers.authorization)
            return {success, data};
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

export const loggedIn = () =>{
    const accessToken = localStorage.getItem('accessToken')
    const jwtExpired = localStorage.getItem('jwtExpired')
    if (accessToken && jwtExpired){
        return 'jwtExpired'
    }
    else if (accessToken ){
        return true
    }else{
        return false
    }
}