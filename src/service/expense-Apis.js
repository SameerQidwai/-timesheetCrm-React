import { message as messageAlert } from 'antd';
import axios from 'axios';

import { Api, apiErrorRes, headers, jwtExpired, setToken } from './constant';

const url = `${Api}/expenses`;

export const addExpense = (data) => {
  console.log('data',data)
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

export const getListOfExpenses = (forSheets) => {
  return axios
    .get(`${url}${forSheets ? '/available': ''}`, { headers: headers() })
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

export const editExpense = (id,data) => {
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
