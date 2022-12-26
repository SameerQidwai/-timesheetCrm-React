import React, { useState, useEffect } from 'react'
import { Button, Col, DatePicker, Descriptions, Row, Select, Typography, Table as ATable } from 'antd'
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
    width: '6%',
    ...tableSorter('employeeName', 'string'),
  },
  {
    key: 'employeeCode',
    dataIndex: 'employeeCode',
    title: 'Employee Code',
    width: '3%',
    render: (text)=> (`00${text}`),
    ...tableSorter('employeeCode', 'string'),
  },
  {
    key: 'projectName',
    dataIndex: 'projectName',
    title: 'Project Name',
    width: '8%',
    ...tableSorter('projectName', 'string'),
  },
  {
    key: 'projectCode',
    dataIndex: 'projectCode',
    title: 'Project Code',
    width: '3%',
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
    width: '8%',
    ...tableSorter('organizationName', 'number'),
  },
  {
    key: 'entry',
    dataIndex: ['currentMonth', 'approvedHours'],
    title: 'Sheet Hours Submit This Month',
    width: '4%',
    render: (value)=> (formatFloat(value??0)),
    ...tableSorter('entry', 'number'),
  },
  {
    key: 'YTDHours',
    dataIndex: 'YTDHours',
    title: 'YTD Completed Work',
    width: '4%',
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
      width: '3%',
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

  const summaryFooter = (data) =>{
    let excludeColumns = ['employeeName', 'employeeCode', 'projectName', 'projectCode', 'poNo', 'organizationName', 'empty',]
    if(data.length>0)
    return (
      <ATable.Summary fixed="bottom">
        <ATable.Summary.Row>
          {columns.map(({ key }, kIndex) => {
            let value = 0;
            let columnFound = false;
            if (!excludeColumns.includes(key)) {
              columnFound = true;
              data.forEach((rowData, index) => {
                if (key[0].length === 2){
                  value += (rowData[key[0]][key[1]]??0);
                }else{
                  value += (rowData[key]??0);
                  //calculation for total hours and actual hours for footer to show
                }
              });
            }
            //Title of the projct show column for title
            return key === 'organizationName' ? (
              <ATable.Summary.Cell
                index={key + 1}
                key={key + 1}
                style={{ fontWeight: 600 }}
              >
                <Typography.Text strong>Total</Typography.Text> 
              </ATable.Summary.Cell>
            ) : columnFound ? ( // show total and normal background if the column month is same as selected month or the key is totalHours of the month
              <ATable.Summary.Cell
                index={key + 1}
                key={key + 1}
                align="center"
                style={{ fontWeight: 600 }}
              >
                <Typography.Text strong>{formatFloat(value)}</Typography.Text>
              </ATable.Summary.Cell>
            ) : (
              <ATable.Summary.Cell index={key + 1} key={key + 1}></ATable.Summary.Cell>
            );
          })}
        </ATable.Summary.Row>
      </ATable.Summary>
    );
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
            scroll={{ x: '170vw' }}
            summary={ columnData => summaryFooter(columnData)}
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
            scroll={{ x: '170vw', }}
            summary={ columnData => summaryFooter(columnData)}

          />
        </Col>
      </Row>
    </div>
  );
}

export default TimesheetSummary