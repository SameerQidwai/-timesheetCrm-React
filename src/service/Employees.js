import axios from 'axios';
import { message as messageAlert } from 'antd';

import {
  Api,
  apiErrorRes,
  formatDate,
  headers,
  jwtExpired,
  setToken,
  thumbUrl,
} from './constant';

const url = `${Api}/employees`;

export const getList = () => {
  return axios
    .get(url, { headers: headers() })
    .then((res) => {
      const { success, data, message } = res.data;
      jwtExpired(message);
      if (success) setToken(res?.headers?.authorization);

      return { success: success, data: data };
    })
    .catch((err) => {
      return {
        error: 'Please login again!',
        success: false,
        message: err.message,
      };
    });
};

export const getRecord = (id) => {
  return axios
    .get(url + `/${id}`, { headers: headers() })
    .then((res) => {
      const { success, data, message } = res.data;
      jwtExpired(message);
      if (success) {
        // const { basic, detail, kin, bank, billing, train, tfn } = reStructure(data);
        return { success, data, ...reStructure(data) };
      }
      return { success };
    })
    .catch((err) => {
      if (err.response?.data) {
        const { status } = err.response;
        const { message, success } = err.response?.data;
        return {
          authError: message === 'Not Authorized!',
          status,
          success,
          message,
        };
      }
      return {
        error: 'Please login again!',
        status: false,
        message: err.message,
      };
    });
};

export const addList = (data) => {
  messageAlert.loading({ content: 'Loading...', key: 1 });
  return axios
    .post(url, data, { headers: headers() })
    .then((res) => {
      const { success, message, data } = res.data;
      jwtExpired(message);
      messageAlert.success({ content: message, key: 1 });
      if (success) {
        const { billing } = reStructure(data);
        return { success, data, billing };
      }
      return { success, data };
    })
    .catch((err) => {
      return apiErrorRes(err, 1, 5);
    });
};

export const delList = (id) => {
  return axios
    .delete(url + `/${id}`, { headers: headers() })
    .then((res) => {
      const { success, message } = res.data;
      jwtExpired(message);
      return { success };
    })
    .catch((err) => {
      return {
        error: 'Please login again!',
        status: false,
        message: err.message,
      };
    });
};

export const editList = (id, data) => {
  messageAlert.loading({ content: 'Loading...', key: id });
  return axios
    .put(url + `/${id}`, data, { headers: headers() })
    .then((res) => {
      const { success, message, data } = res.data;
      jwtExpired(message);
      messageAlert.success({ content: message, key: id });
      if (success) {
        const { billing } = reStructure(data);
        setToken(res?.headers?.authorization);
        return { success, data, billing };
      }
      return { success, data };
    })
    .catch((err) => {
      return apiErrorRes(err, id, 5);
    });
};

export const toggleActiveStatus = (id) => {
  messageAlert.loading({ content: 'Loading...', key: id });
  return axios
    .put(url + `/${id}/toggleActive`, {}, { headers: headers() })
    .then((res) => {
      const { success, message, data } = res.data;
      jwtExpired(message);
      messageAlert.success({ content: message, key: id });
      if (success) {
        setToken(res?.headers?.authorization);
        return { success, data };
      }
      return { success, data };
    })
    .catch((err) => {
      return apiErrorRes(err, id, 5);
    });
};

function reStructure(data) {
  const contactPerson = data.contactPersonOrganization
    ? data.contactPersonOrganization.contactPerson
    : {};
  const basic = {
    cpCode: `Emp-00${contactPerson.id}`,
    firstName: contactPerson.firstName,
    lastName: contactPerson.lastName,
    gender: contactPerson.gender,
    phoneNumber: contactPerson.phoneNumber,
    email: contactPerson.email,
    dateOfBirth: formatDate(contactPerson.dateOfBirth),
    birthPlace: contactPerson.birthPlace,
    address: contactPerson.address,
    stateId: contactPerson.stateId,
    username: data.username,
    password: data.password,
    roleId: data.roleId,
    lineManagerId: data.lineManagerId,
    active: data.active,
  };
  const detail = {
    superannuationName: data.superannuationName,
    superannuationBankName: data.superannuationBankName,
    superannuationBankAccountOrMembershipNumber:
    data.superannuationBankAccountOrMembershipNumber,
    superannuationAbnOrUsi: data.superannuationAbnOrUsi,
    superannuationBankBsb: data.superannuationBankBsb,
    superannuationAddress: data.superannuationAddress,
    superannuationType: data.superannuationType,
    superannuationFileId: data.superannuationFileId,
    file: data.superannuationFileId && data.superannuationFile
      ? [
          {
            id: data.superannuationFile?.id,
            createdAt: data.superannuationFile?.createdAt,
            fileId: data.superannuationFile?.id,
            uid: data.superannuationFile?.uniqueName,
            name: data.superannuationFile?.originalName,
            type: data.superannuationFile?.type,
            url: `${Api}/files/${data.superannuationFile?.uniqueName}`,
            thumbUrl: thumbUrl(data.superannuationFile?.type),
          },
        ]
      : [],
  };
  const tfn = {
    tfnFileId: data.tfnFileId,
    file: data?.tfnFile?.id
      ? [
          {
            id: data.tfnFile.id,
            createdAt: data.tfnFile.createdAt,
            fileId: data.tfnFile.id,
            uid: data.tfnFile.uniqueName,
            name: data.tfnFile.originalName,
            type: data.tfnFile.type,
            url: `${Api}/files/${data.tfnFile.uniqueName}`,
            thumbUrl: thumbUrl(data.tfnFile.type),
          },
        ]
      : [],
  }
  const kin = {
    nextOfKinDateOfBirth: formatDate(data.nextOfKinDateOfBirth),
    nextOfKinEmail: data.nextOfKinEmail,
    nextOfKinGender: data.nextOfKinGender,
    nextOfKinName: data.nextOfKinName,
    nextOfKinPhoneNumber: data.nextOfKinPhoneNumber,
    nextOfKinRelation: data.nextOfKinRelation,
  };
  const bankAccount = data.bankAccounts.length > 0 ? data.bankAccounts[0] : {};
  const bank = {
    bankName: bankAccount.name,
    bankAccountNo: bankAccount.accountNo,
    bankBsb: bankAccount.bsb,
    tfn: data.tfn,
    taxFreeThreshold: data.taxFreeThreshold,
    helpHECS: data.helpHECS,
    bankAccountFileId: bankAccount.fileId,
    file: bankAccount.fileId && bankAccount?.file
      ? [
          {
            id: bankAccount?.file?.id,
            createdAt: bankAccount?.file?.createdAt,
            fileId: bankAccount?.file?.id,
            uid: bankAccount?.file?.uniqueName,
            name: bankAccount?.file?.originalName,
            type: bankAccount?.file?.type,
            url: `${Api}/files/${bankAccount?.file?.uniqueName}`,
            thumbUrl: thumbUrl(bankAccount?.file?.type),
          },
        ]
      : [],
  };
  const employmentContracts =
    data.employmentContracts.length > 0 ? data.employmentContracts[0] : {};

  const billing = {
    employmentContractId: employmentContracts.id,
    employeeId: employmentContracts.employeeId,
    payslipEmail: employmentContracts.payslipEmail,
    membershipAccountNo: employmentContracts.membershipAccountNo,
    payFrequency: employmentContracts.payFrequency,
    startDate: formatDate(employmentContracts.startDate),
    endDate: formatDate(employmentContracts.endDate),
    type: employmentContracts.type,
    noOfHours: employmentContracts.noOfHours,
    noOfDays: employmentContracts.noOfDays,
    noOfHoursPer: employmentContracts.noOfHoursPer,
    bohPercent: employmentContracts.bohPercent,
    remunerationAmount: employmentContracts.remunerationAmount,
    remunerationAmountPer: employmentContracts.remunerationAmountPer,
    comments: employmentContracts.comments,
    leaveRequestPolicyId: employmentContracts.leaveRequestPolicyId ?? 0,
    fileId: employmentContracts.fileId,
    file: employmentContracts.fileId
      ? [
          {
            id: employmentContracts.file.id,
            createdAt: employmentContracts.file.createdAt,
            fileId: employmentContracts.file.id,
            uid: employmentContracts.file.uniqueName,
            name: employmentContracts.file.originalName,
            type: employmentContracts.file.type,
            url: `${Api}/files/${employmentContracts.file.uniqueName}`,
            thumbUrl: thumbUrl(employmentContracts.file.type),
          },
        ]
      : [],
  };
  const train = {
    training: data.training,
  };
  return { basic, detail, kin, bank, billing, train, tfn };
}
