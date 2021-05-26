import axios from "axios";

import { Api } from "./constant";
import moment from "moment";
import { message } from "antd";

const url = `${Api}/organizations`;

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

export const getOrgRecord = (id) => {
    return axios
        .get(url + `/${id}`)
        .then((res) => {
            const { success, data } = res.data;
            if (success) {
                const vake = data
                const basic = {
                    name: vake.name,
                    parent: vake.parentOrganization && vake.parentOrganization.id,
                    phone: vake.phoneNumber,
                    delegate_cp: vake.delegatecontactPersonOrganization && vake.delegatecontactPersonOrganization.id,
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
                return {success,basic, billing, insured, bank, future, data}
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

export const addList = (data) => {
            message.loading({ content: 'Loading...', key: 1 })
    return axios
        .post(url, data)
        .then((res) => {
                        message.success({ content: 'Success!', key: 1})
            const { success } = res.data;
            if (success) return {success};
        })
        .catch((err) => {
                        message.error({ content: 'Error!', key: 1})
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const delOrg = (id) => {
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
            message.loading({ content: 'Loading...', key: data.id })
    return axios
        .put(url + `/${data.id}`, data)
        .then((res) => {
            const { success } = res.data;
                        message.success({ content: 'Success!', key: data.id})
            if (success) return {success};
        })
        .catch((err) => {
                        message.error({ content: 'Error!', key: data.id})
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};
