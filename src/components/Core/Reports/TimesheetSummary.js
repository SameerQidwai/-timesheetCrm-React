import React, { useState, useEffect } from 'react'
import { Button, Col, DatePicker, Descriptions, Row, Select, Typography, Table as ATable } from 'antd'
import Table, { FiltertagsNew, tableSorter } from '../Table/TableFilter'
import { getTimesheetSummary } from '../../../service/reports-Apis'


import { Api, formatCurrency, formatFloat, getFiscalYear, localStore } from '../../../service/constant'
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
    key: 'purchaseOrder',
    dataIndex: 'purchaseOrder',
    title: 'PO No',
    align: 'center',
    width: '4%',
    ...tableSorter('purchaseOrder', 'number'),
  },
  {
    key: 'organizationName',
    dataIndex: 'organizationName',
    title: 'Organisation',
    width: '8%',
    ...tableSorter('organizationName', 'number'),
  },
  {
    key: 'currentMonth',
    dataIndex: 'currentMonth',
    title: 'Sheet Hours Submit This Month',
    width: '4%',
    render: (value)=> (formatFloat(value??0)),
    ...tableSorter('currentMonth', 'number'),
  },
  {
    key: 'currentYear',
    dataIndex: 'currentYear',
    title: 'YTD Completed Work',
    width: '4%',
    render: (value)=> (formatFloat(value??0)),
    ...tableSorter('currentYear', 'number'),
  },
  {
    key: 'empty',
    dataIndex: 'empty',
    width: '1%'
  },
  
]

function TimesheetSummary() {
  const [data, setData] = useState({})
  const [columns, setColumn] = useState([])
  const [visible, setVisible] = useState(false)
  const [tags, setTags] = useState(null)
  const [loading, setLoading] = useState(false)
  let fiscalYear = getFiscalYear() 

  useEffect(() => {
    let {dates: {start, end}} = fiscalYear
    
    let query = `startDate=${start.format(
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
      colRender: 'filteredHours',
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

  const exportData = () =>{
    setLoading(true)
    let query = _createQuery(tags??{})
    getTimesheetSummary(query, '/export').then(res=>{
      if (res.success){
        window.open(`${Api}${res.data}`, '_blank', 'noreferrer');
      }
      setLoading(false)
    })
  }

  const summaryFooter = (data) =>{
    let excludeColumns = ['employeeName', 'employeeCode', 'projectName', 'projectCode', 'purchaseOrder', 'organizationName', 'empty',]
    if(data.length>0)
    return (
      <ATable.Summary fixed="bottom">
        <ATable.Summary.Row>
          {columns.map(({ dataIndex }, kIndex) => {
            let value = 0;
            let columnFound = false;
            if (!excludeColumns.includes(dataIndex)) {
              columnFound = true;
              data.forEach((rowData, index) => {
                if (dataIndex.length === 2){
                  value += (rowData[dataIndex[0]][dataIndex[1]]?.['filteredHours']??0);
                }else{
                  value += (rowData[dataIndex]??0);
                  //calculation for total hours and actual hours for footer to show
                }
              });
            }
            //Title of the projct show column for title
            return dataIndex === 'organizationName' ? (
              <ATable.Summary.Cell
                index={dataIndex + kIndex}
                key={dataIndex + kIndex}
                style={{ fontWeight: 600 }}
              >
                <Typography.Text strong>Total</Typography.Text> 
              </ATable.Summary.Cell>
            ) : columnFound ? ( // show total and normal background if the column month is same as selected month or the key is totalHours of the month
              <ATable.Summary.Cell
                index={dataIndex + kIndex}
                key={dataIndex + kIndex}
                align="center"
                style={{ fontWeight: 600 }}
              >
                <Typography.Text strong>{formatFloat(value)}</Typography.Text>
              </ATable.Summary.Cell>
            ) : (
              <ATable.Summary.Cell index={dataIndex + kIndex} key={dataIndex + kIndex}></ATable.Summary.Cell>
            );
          })}
        </ATable.Summary.Row>
      </ATable.Summary>
    );
  }

  return (
    <div>
      <Row justify='space-between'>
        <Col>
        <Typography.Title level={4}>Timesheets Summary</Typography.Title>
        </Col>
        <Col>
          {/* need changes on action */}
        <Button size="small" onClick={exportData} gutter={5}>Download CSV</Button>
        </Col>
      </Row>
      <Row gutter={[0, 100]}>
        <Col span={24}>
          <Descriptions
            title="YTD Completed Hours"
            bordered
            column={1}
            size="small"
            style={{ width: '35%' }}
            className="describe"
          >
            <Descriptions.Item label="">
              {/* {moment().format('MMM YYYY')} */}
              <DatePicker
                defaultValue={moment()}
                picker="month"
                style={{ width: 200 }}
                // disabledDate={(date)=> }
                size="small"
                format="MMM YYYY"
                onChange={(value, valu1, value2) => {
                  value = value ?? moment();
                  let { start, end } = getFiscalYear('dates', value);
                  let query = `startDate=${start.format(
                    'YYYY-MM-DD'
                  )}&endDate=${end.format(
                    'YYYY-MM-DD'
                  )}&currentDate=${value.format('YYYY-MM-DD')}`;
                  getData(query);
                }}
              />
            </Descriptions.Item>
            <Descriptions.Item label="T&M">
              {formatFloat(data?.timeProjectTotalHours)}
            </Descriptions.Item>
            <Descriptions.Item label="Milestone">
              {formatFloat(data?.milestoneProjectTotalHours)}
            </Descriptions.Item>
            <Descriptions.Item label="Total Completed Hours">
              {formatFloat(
                (data?.timeProjectTotalHours ?? 0) +
                  (data?.milestoneProjectTotalHours ?? 0)
              )}
            </Descriptions.Item>
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
            rowKey={'index'}
            dataSource={data?.timeProjectSummary ?? []}
            pagination={false}
            scroll={{ x: '170vw' }}
            summary={(columnData) => summaryFooter(columnData)}
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
            rowKey={'index'}
            dataSource={data?.milestoneProjectSummary ?? []}
            pagination={false}
            scroll={{ x: '170vw' }}
            summary={(columnData) => summaryFooter(columnData)}
          />
        </Col>
      </Row>
    </div>
  );
}

export default TimesheetSummary