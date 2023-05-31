import axios from 'axios';
import { Api, apiErrorRes, formatDate, headers, jwtExpired, setToken } from './constant';
import { message as messageAlert } from 'antd';

const url = `${Api}/invoice`;

export const getInvoices = () => {
  messageAlert.loading({ content: 'Loading...', key: 1 });
  return axios
    .get(url+ '/', { headers: headers() })
    .then((res) => {
      const { success, message,data } = res?.data;
      jwtExpired(message);
      messageAlert.success({ content: message, key: 1 });
      setToken(res?.headers?.authorization);
      return { success, data };
    })
    .catch((err) => {
      return apiErrorRes(err, 1);
    });
};

export const getInvoiceData = (projectId, startDate, endDate) => {
  return axios
    .get(`${url}/data/${projectId}&${startDate}&${endDate}`, { headers: headers() })
    .then((res) => {
      const { success, message,data } = res?.data;
      jwtExpired(message);
      // messageAlert.success({ content: message, key: 1 });
      setToken(res?.headers?.authorization);
      return { success, data };
    })
    .catch((err) => {
      return apiErrorRes(err, 1);
    });
};

export const createInvoice = (data) => {
  messageAlert.loading({ content: 'Loading...', key: 1 });
  return axios
    .post(url+ '/', data, { headers: headers() })
    .then((res) => {
      const { success, message,data } = res?.data;
      jwtExpired(message);
      messageAlert.success({ content: message, key: 1 });
      setToken(res?.headers?.authorization);
      return { success };
    })
    .catch((err) => {
      return apiErrorRes(err, 1);
    });
};

export const getInvoice = (id) => {
  messageAlert.loading({ content: 'Loading...', key: 1 });
  return axios
    .get(`${url}/${id}`, { headers: headers() })
    .then((res) => {
      const { success, message,data } = res?.data;
      jwtExpired(message);
      messageAlert.success({ content: message, key: 1 });
      setToken(res?.headers?.authorization);
      if (data){
        data['months'] = [formatDate(data['startDate']), formatDate(data['endDate'])]
        data['dueDate'] = formatDate(data['dueDate'])
        data['issueDate'] = formatDate(data['issueDate'])
        // data['organization'] = data['organizationId']
      }
      console.log(data)
      return { success, data };
    })
    .catch((err) => {
      return apiErrorRes(err, 1);
    });
};

export const updateInvoice = (id, data) => {
  messageAlert.loading({ content: 'Loading...', key: 1 });
  return axios
    .put(`${url}/${id}`, data, { headers: headers() })
    .then((res) => {
      const { success, message,data } = res?.data;
      jwtExpired(message);
      messageAlert.success({ content: message, key: 1 });
      setToken(res?.headers?.authorization);
      return { success };
    })
    .catch((err) => {
      return apiErrorRes(err, 1);
    });
};
