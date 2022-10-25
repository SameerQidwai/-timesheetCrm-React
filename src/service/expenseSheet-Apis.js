import { message as messageAlert } from 'antd';
import axios from 'axios';

import { Api, apiErrorRes, headers, jwtExpired, setToken } from './constant';

const url = `${Api}/expense-sheets`;

export const addExpenseSheet = (data) => {
    messageAlert.loading({ content: 'Loading...', key: 1 }, 5);
    return axios
      .post(url, data, { headers: headers() })
        .then((res) => {
        const { success, message, data } = res.data;
        jwtExpired(message);
        messageAlert.success({ content: message, key: 1 }, 5);
        setToken(res.headers && res.headers.authorization);

        return { success, data }

      })
      .catch((err) => {
        messageAlert.error({ content: 'Error!', key: 1 }, 5);
        return {
          error: 'Please login again!',
          status: false,
          message: err.message,
        };
      });
};

export const getExpenseSheets = () => {
  return axios
    .get(`${url}`, { headers: headers() })
    .then((res) => {
      const { success, data, message } = res.data;
      jwtExpired(message);
      setToken(res.headers && res.headers.authorization);

      return { success, data };
    })
    .catch((err) => {
      return {
        error: 'Please login again!',
        success: false,
        message: err.message,
      };
    });
};

export const editExpenseSheet = (id,data) => {
  messageAlert.loading({ content: 'Loading...', key: id }); // this open toast
  return axios
    .put(url + `/${id}`, data, { headers: headers() }) 
    .then((res) => {
      const { success, message, data } = res.data;
      jwtExpired(message); // checking jwd isExpired?
      messageAlert.success({ content: message, key: id }, 5); // open toast on sceess
      setToken(res.headers && res.headers.authorization); //
      return {success, data};

    })
    .catch((err) => {
      // messageAlert.error({ content: 'Error!', key: id });
      // return {
      //   error: 'Please login again!',
      //   status: false,
      //   message: err.message,
      // };
      return apiErrorRes(err, id, 5)
    });
};

export const addExpenseInSheet = (id, data) => {
  messageAlert.loading({ content: 'Loading...', key: id }, 5);
  return axios
    .post(`${url}/${id}/expenses`, data, { headers: headers() })
      .then((res) => {
      const { success, message, data } = res.data;
      jwtExpired(message);
      messageAlert.success({ content: message, key: id }, 5);
      setToken(res.headers && res.headers.authorization);

      return { success, data }

    })
    .catch((err) => {
      messageAlert.error({ content: 'Error!', key: id }, 5);
      return {
        error: 'Please login again!',
        status: false,
        message: err.message,
      };
    });
};
