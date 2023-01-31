import axios from "axios";
import { message as messageAlert } from "antd";

import { Api, getFiscalYear, headers, jwtExpired, setToken } from "./constant";

const url = `${Api}/reports`;

export const getBenchResources = (queryParam, exporting) => {
  exporting = exporting? exporting: ''
    return axios
        .get(`${url}${exporting??''}/bench-resources${queryParam? '?'+ queryParam: ''}`, {headers:headers()})
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

export const getWorkforceSkills = (queryParam, exporting) => {
    return axios
        .get(`${url}${exporting??''}/workforce-skills${queryParam? '?'+ queryParam: ''}`, {headers:headers()})
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

export const getPositions = (queryParam, exporting) => {
    return axios
        .get(`${url}${exporting??''}/allocations${queryParam? '?'+ queryParam: ''}`, {headers:headers()})
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

export const getAllocations = (queryParam, exporting) => {
    return axios
        .get(`${url}${exporting??''}/allocations-all${queryParam? '?'+ queryParam: ''}`, {headers:headers()})
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

export const getTimesheetSummary = (queryParam, exporting) => {
    return axios
        .get(`${url}${exporting??''}/timesheet-summary${queryParam? '?'+ queryParam: ''}`, {headers:headers()})
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

export const getLeaveSummary = (queryParam, exporting) => {
    return axios
        .get(`${url}${exporting??''}/leave-request-summary-view${queryParam? '?'+ queryParam: ''}`, {headers:headers()})
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

export const getProjectRevenueAnalysis = (queryParam, exporting) => {
    let {start, end} = getFiscalYear('dates')
    return axios
      .get(
        `${url}${exporting??''}/project-revenue-analysis?fiscalYearStart=${start.format(
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

export const getClientRevenueAnalysis = (queryParam, exporting) => {
    let {start, end} = getFiscalYear('dates')
    return axios
      .get(
        `${url}${exporting??''}/client-revenue-analysis?fiscalYearStart=${start.format(
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
