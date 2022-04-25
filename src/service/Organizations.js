import axios from "axios";

import { Api, apiErrorRes, headers, jwtExpired, setToken } from "./constant";
import moment from "moment";
import { message as messageAlert } from "antd";

const url = `${Api}/organizations`;

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

const reConstruct = (data) =>{
    const vake = data
        const { delegateContactPerson } = data
        const basic = {
            name: vake.name,
            title: vake.title,
            parent: vake.parentOrganization && vake.parentOrganization.id,
            phone: vake.phoneNumber,
            delegate_cp: vake.delegateContactPersonId,
            delegate_contactPerson: delegateContactPerson && `${delegateContactPerson.firstName} ${delegateContactPerson.lastName} - ${delegateContactPerson.phoneNumber ?? ''}`,
            email: vake.email,
            EBA: vake.expectedBusinessAmount,
            address: vake.address,
            website: vake.website,
            businessType: vake.businessType
        }
        const billing = {
            ABN: vake.abn,
            tax_Code: vake.taxCode,
            invoice_email: vake.invoiceEmail,
            invoice_number: vake.invoiceContactNumber,
            CTI: vake.cti,
        }
        const insured = {
            insurer_PI: vake.piInsurer,
            insurer_PL: vake.plInsurer,
            insurer_WC: vake.wcInsurer,
            policy_PI: vake.piPolicyNumber,
            policy_PL: vake.plPolicyNumber,
            policy_WC: vake.wcPolicyNumber,
            SumIns_PI: vake.piSumInsured,
            SumIns_PL: vake.plSumInsured,
            SumIns_WC: vake.wcSumInsured,
            expiry_PI: vake.piInsuranceExpiry ? moment(vake.piInsuranceExpiry): null,
            expiry_PL: vake.piInsuranceExpiry ? moment(vake.plInsuranceExpiry) : null,
            expiry_WC: vake.piInsuranceExpiry ? moment(vake.wcInsuranceExpiry) : null,
        }
        const bank = {
            bankName: vake.bankAccounts[0] && vake.bankAccounts[0].name,
            bankAccountNo: vake.bankAccounts[0] && vake.bankAccounts[0].accountNo,
            bankBsb: vake.bankAccounts[0] && vake.bankAccounts[0].bsb,
        }
        const future = {
            currentForecast: vake.currentFinancialYearTotalForecast ,
            nextForecast: vake.nextFinancialYearTotalForecast ,
        }
        return {basic, billing, insured, bank, future}
}

export const getOrgRecord = (id) => {
    return axios
        .get(url + `/${id}`, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message)
            if (success) {
                const { basic, billing, insured, bank, future } = reConstruct(data)
                setToken(res.headers && res.headers.authorization)
                return {success ,basic, billing, insured, bank, future, data}
            }
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
            const { success, message } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: 1})
            if (success) setToken(res.headers && res.headers.authorization)
            return {success};
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

export const delOrg = (id) => {
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

export const editList = (data) => {
            messageAlert.loading({ content: 'Loading...', key: data.id })
    return axios
        .put(url + `/${data.id}`, data, {headers:headers()})
        .then((res) => {
            const { success, message, data } = res.data;
            jwtExpired(message)
            messageAlert.success({ content: message, key: data.id})
            if (success) {
                const { basic, billing, insured, bank, future } = reConstruct(data)
                setToken(res.headers && res.headers.authorization)
                return {success ,basic, billing, insured, bank, future, data}
            }
            return {success, data};
        })
        .catch((err) => {
            return apiErrorRes(err, data.id, 5)
        });
};
