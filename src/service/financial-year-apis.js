import { message as messageAlert } from 'antd';
import axios from 'axios';

import { Api, apiErrorRes, headers, jwtExpired, setToken } from './constant';

const url = `${Api}/expenses`;

export const createFY = (data) => {
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

export const updateFY = (fyId) => {
  return axios
    .get(`${url}/${fyId}`, { headers: headers() })
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