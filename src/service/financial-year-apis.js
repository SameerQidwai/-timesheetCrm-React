import { message as messageAlert } from 'antd';
import axios from 'axios';

import { Api, apiErrorRes, headers, jwtExpired, setToken } from './constant';

const url = `${Api}/financial-years`;

export const getAllFY = (option) => {
  messageAlert.loading({ content: 'Loading...', key: 1 }, 3);
  return axios
    .get(url, { headers: headers() })
    .then((res) => {
      const { success, message, data } = res.data;
      jwtExpired(message);
      messageAlert.destroy();
      setToken(res.headers && res.headers.authorization);

      if (option) {
        option = data.forEach((year) => ({
          value: year.id,
          label: year.label,
          start: year.startDate,
          end: year.endDate,
        }));
      }

      return { success, data, option };
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

export const createFY = (data) => {
  messageAlert.loading({ content: 'Creating FY...', key: 1 }, 5);
  return axios
    .post(url, data, { headers: headers() })
    .then((res) => {
      const { success, message, data } = res.data;
      jwtExpired(message);
      messageAlert.success({ content: message, key: 1 }, 5);
      setToken(res.headers && res.headers.authorization);

      return { success, data };
    })
    .catch((err) => {
      return apiErrorRes(err, 1, 5);
    });
};

export const updateFY = (fyId, data) => {
  messageAlert.loading({ content: 'Updating FY...', key: fyId }, 5);
  return axios
    .put(`${url}/${fyId}`, data, { headers: headers() })
    .then((res) => {
      const { success, data, message } = res.data;
      jwtExpired(message);
      messageAlert.success({ content: message, key: fyId }, 5);
      setToken(res.headers && res.headers.authorization);

      return { success, data };
    })
    .catch((err) => {
      return apiErrorRes(err, 1, 5);
    });
};

export const closingFY = (fyId, query = '') => {
  messageAlert.loading({ content: 'Closing FY...', key: 1 }, 5);
  return axios
    .patch(`${url}/${fyId}/closeYear${query}`, {}, { headers: headers() })
    .then((res) => {
      const { success, data, message } = res.data;
      jwtExpired(message);
      messageAlert.destroy();
      setToken(res.headers && res.headers.authorization);

      return { success, data };
    })
    .catch((err) => {
      return apiErrorRes(err, fyId, 5);
    });
};
