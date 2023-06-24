import axios from 'axios';
import { Api, apiErrorRes, headers, jwtExpired, setToken } from './constant';
import { message as messageAlert } from 'antd';

const url = `${Api}/integration`;

export const toolLogin = (toolName) => {
    messageAlert.loading({ content: 'Loading...', key: 1 });
    return axios
      .get(`${url}/${toolName}/auth`, { headers: headers() })
      .then((res) => {
        const { success, message,data } = res?.data;
        jwtExpired(message);
      let popup = window.open(`${data}`, '_blank', 'toolbar=0,location=0,menubar=0')
      window.addEventListener('message', event => {
        // Only accept messages from http://example.com.
          if (event.data === 'close') {
            console.log(event.data)
            popup.close()
            window.location.reload();
          }
      })
        messageAlert.success({ content: message, key: 1 });
        if (success) setToken(res?.headers?.authorization);
        return { success };
      })
      .catch((err) => {
        return apiErrorRes(err, 1);
      });
};
export const checkToolLogin = (toolName) => {
    messageAlert.loading({ content: 'Loading...', key: 1 });
    return axios
      .put(`${url}/${toolName}/auth`,{}, { headers: headers() })
      .then((res) => {
        const { success, message,data } = res?.data;
        jwtExpired(message);
        messageAlert.destroy()
        setToken(res?.headers?.authorization);
        return { success, data };
      })
      .catch((err) => {
        return apiErrorRes(err, 1);
      });
};
export const toolLogout = (toolName) => {
    messageAlert.loading({ content: 'Loading...', key: 1 });
    return axios
      .delete(`${url}/${toolName}/auth`, { headers: headers() })
      .then((res) => {
        const { success, message } = res?.data;
        jwtExpired(message);
        messageAlert.destroy()
        setToken(res?.headers?.authorization);
        return { success };
      })
      .catch((err) => {
        return apiErrorRes(err, 1);
      });
};

export const getToolOrganizations = (toolName) => {
  messageAlert.loading({ content: 'Loading...', key: 1 });
  return axios
    .get(`${url}/${toolName}/organizations`, { headers: headers() })
    .then((res) => {
      const { success, message,data } = res?.data;
      jwtExpired(message);
      messageAlert.success({ content: message, key: 1 });
      setToken(res?.headers?.authorization);
      return { success, data};
    })
    .catch((err) => {
      return apiErrorRes(err, 1);
    });
};

export const getToolAssets = (toolName, data) => {
  messageAlert.loading({ content: 'Loading...', key: `${toolName}/tool-assets`, duration: 0});
  return axios
    .post(`${url}/${toolName}/tool-assets`,data, { headers: headers() })
    .then((res) => {
      const { success, message,data } = res?.data;
      jwtExpired(message);
      messageAlert.destroy(`${toolName}/tool-assets`)
      setToken(res?.headers?.authorization);
      return { success, data};
    })
    .catch((err) => {
      return apiErrorRes(err, 1);
    });
};