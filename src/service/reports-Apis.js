import axios from "axios";
import { message as messageAlert } from "antd";

import { Api, getFiscalYear, headers, jwtExpired, setToken } from "./constant";

const url = `${Api}/reports`;

export const getBenchResources = (queryParam) => {
    return axios
        .get(`${url}/bench-resources${queryParam? '?'+ queryParam: ''}`, {headers:headers()})
        .then((res) => {
            const { success, data } = res.data;
            setToken(res?.headers?.authorization)
             return { success: success, data: data };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const getWorkforceSkills = (queryParam) => {
    return axios
        .get(`${url}/workforce-skills${queryParam? '?'+ queryParam: ''}`, {headers:headers()})
        .then((res) => {
            const { success, data } = res.data;
            setToken(res?.headers?.authorization)
             return { success: success, data: data };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const getPositions = (queryParam) => {
    return axios
        .get(`${url}/allocations${queryParam? '?'+ queryParam: ''}`, {headers:headers()})
        .then((res) => {
            const { success, data } = res.data;
            setToken(res?.headers?.authorization)
             return { success: success, data: data };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const getAllocations = (queryParam) => {
    return axios
        .get(`${url}/allocations-all${queryParam? '?'+ queryParam: ''}`, {headers:headers()})
        // .get(`${url}/allocations-all?bookingType=4`, {headers:headers()})
        .then((res) => {
            const { success, data } = res.data;
            setToken(res?.headers?.authorization)
             return { success: success, data: data };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const getTimesheetSummary = (queryParam) => {
    return axios
        .get(`${url}/timesheet-summary${queryParam? '?'+ queryParam: ''}`, {headers:headers()})
        .then((res) => {
            const { success, data } = res.data;
            setToken(res?.headers?.authorization)
             return { success: success, data: data };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const getLeaveSummary = (queryParam) => {
    return axios
        .get(`${url}/leave-request-summary-view${queryParam? '?'+ queryParam: ''}`, {headers:headers()})
        .then((res) => {
            const { success, data } = res.data;
            setToken(res?.headers?.authorization)
             return { success: success, data: data };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const getProjectRevenueAnalysis = (queryParam) => {
    let {start, end} = getFiscalYear('dates')
    return axios
      .get(
        `${url}/project-revenue-analysis?fiscalYearStart=${start.format(
          'YYYY-MM-DD'
        )}&fiscalYearEnd=${end.format('YYYY-MM-DD')}${
          queryParam ? '&' + queryParam : ''
        }`,
        { headers: headers() }
      )
      .then((res) => {
        const { success, data } = res.data;
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

export const getClientRevenueAnalysis = (queryParam) => {
    let {start, end} = getFiscalYear('dates')
    return axios
      .get(
        `${url}/client-revenue-analysis?fiscalYearStart=${start.format(
          'YYYY-MM-DD'
        )}&fiscalYearEnd=${end.format('YYYY-MM-DD')}${
          queryParam ? '&' + queryParam : ''
        }`,
        { headers: headers() }
      )
      .then((res) => {
        const { success, data } = res.data;
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
        const { success, data } = res.data;
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
