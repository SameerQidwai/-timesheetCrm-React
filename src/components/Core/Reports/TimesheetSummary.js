import React, { useState, useEffect } from 'react'
import { Button, Col, DatePicker, Descriptions, Row, Select, Typography } from 'antd'
import Table, { FiltertagsNew, tableSorter } from '../Table/TableFilter'
import { getTimesheetSummary } from '../../../service/reports-Apis'


import { formatCurrency, formatFloat, getFiscalYear, localStore } from '../../../service/constant'
import moment from 'moment'
import { ReportsFilters, _createQuery } from './Filters'
import { _generateMonthlyColumns } from '.'

const contantColmuns = [
  {
    key: 'employeeName',
    dataIndex: 'employeeName',
    title: 'Employee Name',
    width: '10%',
    ...tableSorter('employeeName', 'string'),
  },
  {
    key: 'employeeCode',
    dataIndex: 'employeeCode',
    title: 'Employee Code',
    width: '4%',
    render: (text)=> (`00${text}`),
    ...tableSorter('employeeCode', 'string'),
  },
  {
    key: 'projectName',
    dataIndex: 'projectName',
    title: 'Project Name',
    width: '10%',
    ...tableSorter('projectName', 'string'),
  },
  {
    key: 'projectCode',
    dataIndex: 'projectCode',
    title: 'Project Code',
    width: '4%',
    render: (text)=> (`00${text}`), 
    ...tableSorter('projectCode', 'string'),
  },
  {
    key: 'poNo',
    dataIndex: 'poNo',
    title: 'PO No',
    align: 'center',
    width: '4%',
    ...tableSorter('poNo', 'number'),
  },
  {
    key: 'organizationName',
    dataIndex: 'organizationName',
    title: 'Organisation',
    width: '5%',
    ...tableSorter('organizationName', 'number'),
  },
  {
    key: 'entry',
    dataIndex: ['currentMonth', 'approvedHours'],
    title: 'Sheet Hours Submit This Month',
    width: '5%',
    render: (value)=> (formatFloat(value??0)),
    ...tableSorter('entry', 'number'),
  },
  {
    key: 'YTDHours',
    dataIndex: 'YTDHours',
    title: 'YTD Completed Work',
    width: '5%',
    render: (value)=> (formatCurrency(value??0)),
    ...tableSorter('YTDHours', 'number'),
  },
  {
    key: 'empty',
    dataIndex: 'empty',
    width: '1%'
  },
  
]

function TimesheetSummary() {
  const [data, setData] = useState([])
  const [columns, setColumn] = useState([])
  const [visible, setVisible] = useState(false)
  const [page, setPage] = useState({pNo:1, pSize: localStore().pageSize})
  const [tags, setTags] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let {start, end} = getFiscalYear('dates')
    let query = `timesheet-summary?startDate=${start.format(
      'YYYY-MM-DD'
    )}&endDate=${end.format(
      'YYYY-MM-DD'
    )}`;
    _generateMonthlyColumns({
      contantColmuns,
      setColumn,
      spliceBtw: 9,
      format: 'float',
      colRender: 'approvedHours',
      dataIndex: ['months']
    });
    getData(query)
  }, [])

  const getData = (queryParam, tagsValues) =>{
    setLoading(true)
    getTimesheetSummary(queryParam).then(res=>{
      if (res.success){
        // console.log(res.data)
        setData(res.data)
        if(queryParam){
          setVisible(false)
          // setTags(tagsValues)
        }
      }
      setLoading(false)
    })
  }

  return (
    <div>
      <Typography.Title level={4}>Timesheets Summary</Typography.Title>
      <Row gutter={[0, 100]}>
        <Col span={24}>
          <Descriptions
            title="YTD Completed Hours"
            bordered
            column={1}
            size="small"
            style={{ width: '40%' }}
            className="describe"
          >
            <Descriptions.Item label="">
              <DatePicker
                defaultValue={moment()}
                picker="month"
                style={{ width: 200 }}
                size="small"
                format="MMM YYYY"
                onChange={(value, valu1, value2) => {
                  value = value ?? moment()
                  let {start, end} = getFiscalYear('dates',value)
                  let query = `timesheet-summary?startDate=${start.format(
                    'YYYY-MM-DD'
                  )}&endDate=${end.format(
                    'YYYY-MM-DD'
                  )}&currentDate=${value.format('YYYY-MM-DD')}`;
                  getData(query)
                }}
              />
            </Descriptions.Item>
            <Descriptions.Item label="T&M"></Descriptions.Item>
            <Descriptions.Item label="Milestone"></Descriptions.Item>
            <Descriptions.Item label="Total Completed Hours"></Descriptions.Item>
          </Descriptions>
        </Col>
        <Col span={24}>
          <Table
            sticky
            title={() => (
              <Typography.Title level={5}>
                Timesheet Data - T&M
              </Typography.Title>
            )}
            columns={columns}
            loading={loading}
            rowKey={'projectId'}
            dataSource={data}
            pagination={{
              hideOnSinglePage: false,
              showPageSizeChanger: true,
              onChange: (pNo, pSize) => {
                setPage({ pNo, pSize });
              },
            }}
            scroll={{
              // x:  'max-content'
              x: '210vw',
            }}
          />
        </Col>
        <Col span={24}>
          <Table
            sticky
            title={() => (
              <Typography.Title level={5}>
                Timesheet Data - Milestone
              </Typography.Title>
            )}
            columns={columns}
            loading={loading}
            rowKey={'projectId'}
            dataSource={data}
            pagination={{
              hideOnSinglePage: false,
              showPageSizeChanger: true,
              onChange: (pNo, pSize) => {
                setPage({ pNo, pSize });
              },
            }}
            scroll={{
              // x:  'max-content'
              x: '210vw',
            }}
          />
        </Col>
      </Row>
    </div>
  );
}

export default TimesheetSummary