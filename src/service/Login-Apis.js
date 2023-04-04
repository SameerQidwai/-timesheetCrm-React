import { message as messageAlert } from 'antd';
import axios from 'axios';
import moment from 'moment'
import { Api, localStore, headers, setToken, jwtExpired, formatDate, thumbUrl, } from './constant';
const url = `${Api}/auth`;
export const login = (data) => {
  return axios
    .post(`${Api}/login`, data)
    .then((res) => {
      localStorage.clear();
      const { success, data, message } = res.data;
      if (success) {
        messageAlert.success({ content: message, key: 'logout' }, 5);
        // let permissions = { DASHBOARD: {READ: {ANY: true } } }
        let permissions = {};
        let role = data.role;
        // data.role = role.roleId
        role.permissions.map((el) => {
          if (!permissions[el.resource]) {
            permissions[el.resource] = {};
          }
          if (!permissions[el.resource][el.action]) {
            permissions[el.resource][el.action] = {};
          }
          permissions[el.resource][el.action][el.grant] = true;
        });
        data.permissions = JSON.stringify(permissions);
        delete data.role.permissions;
        data.role = JSON.stringify(data.role);
        const keys = Object.keys(data);
        let len = keys.length - 1;
        for (len; len >= 0; len--) {
          const key = keys[len];
          localStorage.setItem(key, data[key]);
        }
        return { success, data };
      } else {
        messageAlert.error({ content: message, key: 'logout' }, 5);
      }
    })
    .catch((err) => {
      messageAlert.error({ content: err.message, key: 'logout' }, 5);
      return {
        error: 'Please login again!',
        status: false,
        message: err.message,
      };
    });
};

export const forgotPassword = async (data) => {
  return axios
    .post(`${Api}/forgotPassword`, data)
    .then((res) => {
      const { success, data, message } = res.data;

      if (success) {
        messageAlert.success({ content: message, key: 'logout' }, 5);
        // let permissions = { DASHBOARD: {READ: {ANY: true } } }
        return { success, data };
      }
    })
    .catch((err) => {
      messageAlert.error({ content: err.message, key: 'logout' }, 5);
      return {
        error: 'Something went wrong!',
        status: false,
        message: err.message,
      };
    });
};

export const resetPassword = async (token, data) => {
  return axios
    .post(`${Api}/resetPassword/${token}`, data)
    .then((res) => {
      const { success, data, message } = res.data;

      if (success) {
        messageAlert.success({ content: message, key: 'logout' }, 5);
        // let permissions = { DASHBOARD: {READ: {ANY: true } } }
        return { success, data };
      }
    })
    .catch((err) => {
      messageAlert.error(
        { content: err.response.data.message ?? err.message, key: 'logout' },
        5
      );
      return {
        error: 'Something went wrong!',
        status: false,
        message: err.message,
      };
    });
};

export const upadtePassword = (data) => {
  return axios
    .patch(`${url}/password`, data, { headers: headers() })
    .then((res) => {
      const { success, data, message } = res.data;
      jwtExpired(message);
      messageAlert.success({ content: message, key: 'logout' }, 5);
      if (success) setToken(res?.headers?.authorization);

      return { success, data };
    })
    .catch((err) => {
      const message = err?.response?.data.message;
      messageAlert.error({ content: message || err.message, key: 'logout' });
      return {
        error: 'Please login again!',
        status: false,
        message: err.message,
      };
    });
};

export const getSettings = () => {
  return axios
    .get(`${url}/settings`, { headers: headers() })
    .then((res) => {
      const { success, data, message } = res.data;
      jwtExpired(message);
      if (success) {
        const contactPerson = data.contactPersonOrganization
          ? data.contactPersonOrganization.contactPerson
          : {};
        const basic = {
          cpCode: `Emp-00${contactPerson.id}`,
          firstName: contactPerson.firstName,
          lastName: contactPerson.lastName,
          gender: contactPerson.gender,
          dateOfBirth: formatDate(contactPerson.dateOfBirth),
          phoneNumber: contactPerson.phoneNumber,
          email: contactPerson.email,
          address: contactPerson.address,
          stateId: contactPerson.stateId,
          username: data.username,
          // password: data.password
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
          file: data.superannuationFileId
            ? [
                {
                  id: data.superannuationFile.id,
                  createdAt: data.superannuationFile.createdAt,
                  fileId: data.superannuationFile.id,
                  uid: data.superannuationFile.uniqueName,
                  name: data.superannuationFile.originalName,
                  type: data.superannuationFile.type,
                  url: `${Api}/files/${data.superannuationFile.uniqueName}`,
                  thumbUrl: thumbUrl(data.superannuationFile.type),
                },
              ]
            : [],
        };
        const kin = {
          nextOfKinDateOfBirth: formatDate(data.nextOfKinDateOfBirth),
          nextOfKinEmail: data.nextOfKinEmail,
          nextOfKinGender: data.nextOfKinGender,
          nextOfKinName: data.nextOfKinName,
          nextOfKinPhoneNumber: data.nextOfKinPhoneNumber,
          nextOfKinRelation: data.nextOfKinRelation,
        };
        const bankAccount =
          data.bankAccounts.length > 0 ? data.bankAccounts[0] : {};
        const bank = {
          bankName: bankAccount.name,
          bankAccountNo: bankAccount.accountNo,
          bankBsb: bankAccount.bsb,
          tfn: data.tfn,
          taxFreeThreshold: data.taxFreeThreshold,
          helpHECS: data.helpHECS,
          bankAccountFileId: bankAccount.fileId,
          file: bankAccount.fileId
            ? [
                {
                  id: bankAccount.file.id,
                  createdAt: bankAccount.file.createdAt,
                  fileId: bankAccount.file.id,
                  uid: bankAccount.file.uniqueName,
                  name: bankAccount.file.originalName,
                  type: bankAccount.file.type,
                  url: `${Api}/files/${bankAccount.file.uniqueName}`,
                  thumbUrl: thumbUrl(bankAccount.file.type),
                },
              ]
            : [],
        };
        // const employmentContracts =
        //   data.employmentContracts && data.employmentContracts.length > 0
        //     ? data.employmentContracts[0]
        //     : {};
        let activeContractId = 'NAC';
        const contracts = (data.employmentContracts ?? []).map(
          (contract, index) => {
            if (activeContractId === 'NAC') {
              if (contract.endDate == null) {
                activeContractId = contract.id;
              } else if (
                formatDate(contract.startDate) <= formatDate(moment()) &&
                formatDate(contract.endDate) >= formatDate(moment())
              ) {
                activeContractId = contract.id;
              } else {
                activeContractId = 'NAC';
              }
            }
            return {
              ...contract,
              startDate: formatDate(contract?.startDate),
              endDate: formatDate(contract?.endDate),
              file: contract.file?.id
                ? [
                    {
                      id: contract.file.id,
                      createdAt: contract.file.createdAt,
                      fileId: contract.file.id,
                      uid: contract.file.uniqueName,
                      name: contract.file.originalName,
                      type: contract.file.type,
                      url: `${Api}/files/${contract.file.uniqueName}`,
                      thumbUrl: thumbUrl(contract.file.type),
                    },
                  ]
                : [],
            };
          }
        );

        const sClearance = {
          clearanceLevel: contactPerson.clearanceLevel,
          clearanceGrantedDate: formatDate(contactPerson.clearanceGrantedDate),
          clearanceExpiryDate: formatDate(contactPerson.clearanceExpiryDate),
          clearanceSponsorId: contactPerson.clearanceSponsorId,
          csidNumber: contactPerson.csidNumber,
        };
        const resourceSkill = contactPerson.standardSkillStandardLevels;

        setToken(res?.headers?.authorization);
        return {
          success,
          data,
          basic,
          detail,
          kin,
          bank,
          billing: {contracts, activeContractId},
          sClearance,
          resourceSkill,
        };
      }
      return { success };
    })
    .catch((err) => {
      console.log('err', err);
      // messageAlert.error({ content: message, key: 'logout'})
      return {
        error: 'Please login again!',
        status: false,
        message: err.message,
      };
    });
};

export const upadteSettings = (data) => {
  return axios
    .patch(`${url}/settings`, data, { headers: headers() })
    .then((res) => {
      const { success, data, message } = res.data;
      jwtExpired(message);
      messageAlert.success({ content: message, key: 'logout' });
      if (success) setToken(res?.headers?.authorization);
      return { success, data };
    })
    .catch((err) => {
      messageAlert.error({ content: err.message, key: 'logout' });
      return {
        error: 'Please login again!',
        status: false,
        message: err.message,
      };
    });
};
export const addNewSill = (data) => {
  return axios
    .post(`${url}/addSkill`, data, { headers: headers() })
    .then((res) => {
      const { success, data, message } = res.data;
      jwtExpired(message);
      messageAlert.success({ content: message, key: 'logout' });
      if (success) setToken(res?.headers?.authorization);
      return { success, data };
    })
    .catch((err) => {
      messageAlert.error({ content: err.message, key: 'logout' });
      return {
        error: 'Please login again!',
        status: false,
        message: err.message,
      };
    });
};

export const upadteAddress = (data) => {
  return axios
    .patch(`${url}/address`, data, { headers: headers() })
    .then((res) => {
      const { success, data, message } = res.data;
      jwtExpired(message);
      messageAlert.success({ content: message, key: 'logout' });
      if (success) setToken(res?.headers?.authorization);
      return { success, data };
    })
    .catch((err) => {
      messageAlert.error({ content: err.message, key: 'logout' });
      return {
        error: 'Please login again!',
        status: false,
        message: err.message,
      };
    });
};

export const loggedIn = () => {
  const accessToken = localStorage.getItem('accessToken');
  const jwtExpired = localStorage.getItem('jwtExpired');
  if (accessToken && jwtExpired) {
    return 'jwtExpired';
  } else if (accessToken) {
    return true;
  } else {
    return false;
  }
};

export const refreshToken = () => {
  return axios
    .get(`${Api}/helpers/refresh-token`, { headers: headers() })
    .then((res) => {
      const { success, message } = res.data;
      jwtExpired(message);
      if (success) {
        messageAlert.success({ content: 'Token Refresh Successfully' }, 5);
        setToken(res?.headers?.authorization);
      }
      return { success: success };
    })
    .catch((err) => {
      return {
        error: 'Please login again!',
        success: false,
        message: err.message,
      };
    });
};
