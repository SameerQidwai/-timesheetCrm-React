import axios from 'axios';
import { Api, apiErrorRes, headers, jwtExpired, setToken } from './constant';
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
  messageAlert.loading({ content: 'Loading...', key: 1 });
  return axios
    .get(`${url}/data/${projectId}&${startDate}&${endDate}`, { headers: headers() })
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
export const createInvoice = () => {
  messageAlert.loading({ content: 'Loading...', key: 1 });
  return axios
    .get(url+ '/create-invoice', { headers: headers() })
    .then((res) => {
      const { success, message,data } = res?.data;
    //   jwtExpired(message);
    let popup = window.open(`${data}`, '_blank', 'toolbar=0,location=0,menubar=0')
    window.addEventListener('message', event => {
      // Only accept messages from http://example.com.
        if (event.data === 'close') {
          console.log(event.data)
          popup.close()
        }
    })
    //   messageAlert.success({ content: message, key: 1 });
    //   if (success) setToken(res?.headers?.authorization);
      return { success };
    })
    .catch((err) => {
      return apiErrorRes(err, 1);
    });
};


