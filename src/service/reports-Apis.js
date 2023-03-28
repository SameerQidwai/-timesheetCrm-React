import axios from "axios";
import { message as messageAlert } from "antd";

import { Api, apiErrorRes, getFiscalYear, headers, jwtExpired, setToken } from "./constant";
import moment from "moment"
const url = `${Api}/reports`;

export const getBenchResources = (queryParam, exporting) => {
  exporting = exporting? exporting: ''
    return axios
        .get(`${url}${exporting??''}/bench-resources${queryParam? '?'+ queryParam: ''}`, {headers:headers()})
        .then((res) => {
            const { success, data, message } = res.data;
            jwtExpired(message);
            if (exporting){
              messageAlert.success({ content: 'Creating Report', key: 'report' });
            }

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
            const { success, data, message } = res.data;
            jwtExpired(message);
            if (exporting){
              messageAlert.success({ content: 'Creating Report', key: 'report' });
            }

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
            const { success, data, message } = res.data;
            jwtExpired(message);
            if (exporting){
              messageAlert.success({ content: 'Creating Report', key: 'report' });
            }
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
            const { success, data, message } = res.data;
            jwtExpired(message);
            if (exporting){
              messageAlert.success({ content: 'Creating Report', key: 'report' });
            }
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
            const { success, data, message } = res.data;
            jwtExpired(message);
            if (exporting){
              messageAlert.success({ content: 'Creating Report', key: 'report' });
            } 
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
            const { success, data, message } = res.data;
            jwtExpired(message);
            if (exporting){
              messageAlert.success({ content: 'Creating Report', key: 'report' });
            }
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
        const { success, data, message } = res.data;
        jwtExpired(message);
        if (exporting){
          messageAlert.success({ content: 'Creating Report', key: 'report' });
        }
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
        const { success, data, message } = res.data;
        jwtExpired(message);
        if (exporting){
          messageAlert.success({ content: 'Creating Report', key: 'report' });
        }
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

export const downloadReportFile = (url, fileName)=>{
  axios({
    method: 'get',
    url: `${Api}/${url}`,
    responseType: 'blob',
    headers:headers()
    }).then(response => {
        let url = window.URL.createObjectURL(response.data);
        let a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}_${moment().format('YYYY-MM-DDTHH:mm:ss')}`;
        a.click();
        messageAlert.success({ content: 'Downloading!', key: 'report' });
    }).catch(error => {
        console.log(error);
    });
}