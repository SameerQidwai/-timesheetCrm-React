import axios from "axios";
import { message as messageAlert } from "antd";

import { Api, apiErrorRes, getFiscalYear, headers, jwtExpired, setToken } from "./constant";
import moment from "moment"
const url = `${Api}/reports`


export const getWorkInHandForecast = (queryParam) => {
    let {start, end} = getFiscalYear('dates')
    return axios
      .get(
        `${url}/work-in-hand-forecast?fiscalYearStart=${start.format(
          'YYYY-MM-DD'
        )}&fiscalYearEnd=${end.format('YYYY-MM-DD')}${
          queryParam ? '&' + queryParam : ''
        }`,
        { headers: headers() }
      )
      .then((res) => {
        const { success, data, message } = res.data;
        jwtExpired(message);
        setToken(res?.headers?.authorization);
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

export const getSaveForecast = (queryParam) => {
    let {start, end} = getFiscalYear('dates')
    return axios
      .get(
        `${Api}/forecastReportLabel/`,
        { headers: headers() }
      )
      .then((res) => {
        const { success, data=[], message } = res.data;
        jwtExpired(message);
        let structData = {}
        if (success){
          for (const {values, title} of data) {
            structData[title] = values
          }
        }
        setToken(res?.headers?.authorization);
        return { success: success, data: structData };
      })
      .catch((err) => {
        return {
          error: 'Please login again!',
          success: false,
          message: err.message,
        };
      });
};

export const updateSaveForecast = (data, queryParam) => {
  messageAlert.loading({ content: 'Updating Forecast', key: 1 });
    // let {start, end} = getFiscalYear('dates')
    return axios
      .put(`${Api}/forecastReportLabel/updateReport/`, data, {
        headers: headers(),
      })
      .then((res) => {
        const { success, data = [], message } = res.data;
        jwtExpired(message);
        setToken(res?.headers?.authorization);
        if (success){
          messageAlert.success({ content: 'Forecast Updated Successfully', key: 1 });
        }
        return { success: success};
      })
      .catch((err) => {
        return apiErrorRes(err, 1, 5)
      });
};

export const getSaveBudget = (queryParam) => {
  let {start, end} = getFiscalYear('dates')
  return axios
    .get(
      `${Api}/budgetReportLabel/`,
      { headers: headers() }
    )
    .then((res) => {
      const { success, data=[], message } = res.data;
      jwtExpired(message);
      let structData = {}
      if (success){
        for (const {values, title} of data) {
          structData[title] = values
        }
      }
      setToken(res?.headers?.authorization);
      return { success: success, data: structData };
    })
    .catch((err) => {
      return {
        error: 'Please login again!',
        success: false,
        message: err.message,
      };
    });
};

export const updateSaveBudget = (data, queryParam) => {
  messageAlert.loading({ content: 'Updating Budget', key: 2 });
    // let {start, end} = getFiscalYear('dates')
    return axios
      .put(`${Api}/budgetReportLabel/updateReport/`, data, {
        headers: headers(),
      })
      .then((res) => {
        const { success, data = [], message } = res.data;
        jwtExpired(message);
        setToken(res?.headers?.authorization);
        if (success){
          messageAlert.success({ content: 'Budget Updated Successfully', key: 2 });
        }
        return { success: success};
      })
      .catch((err) => {
        return apiErrorRes(err, 2, 5)
      });
};

export const getSaveCashFlow = (queryParam) => {
  messageAlert.loading({ content: 'Calculating Cash Flow', key: 1 });
  let {start, end} = getFiscalYear('dates')
  return axios
    .get(
      `${Api}/cashflowReportLabel/`,
      { headers: headers() }
    )
    .then((res) => {
      const { success, data=[], message } = res.data;
      jwtExpired(message);
      let structData = {}
      if (success){
        for (const {values, title} of data) {
          structData[title] = values
        }
      }
      setToken(res?.headers?.authorization);
      return { success: success, data: structData };
    })
    .catch((err) => {
      return {
        error: 'Please login again!',
        success: false,
        message: err.message,
      };
    });
};

export const updateSaveCashFlow = (data, queryParam) => {
  messageAlert.loading({ content: 'Updating Cash Flow', key: 2 });
    // let {start, end} = getFiscalYear('dates')
    return axios
      .put(`${Api}/cashflowReportLabel/updateReport/`, data, {
        headers: headers(),
      })
      .then((res) => {
        const { success, data = [], message } = res.data;
        jwtExpired(message);
        setToken(res?.headers?.authorization);
        if (success){
          messageAlert.success({ content: 'Cash Flow Updated Successfully', key: 2 });
        }
        return { success: success};
      })
      .catch((err) => {
        return apiErrorRes(err, 2, 5)
      });
};
