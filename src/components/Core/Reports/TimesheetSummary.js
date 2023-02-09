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
    title: 'Sheet Hours This Month',
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
  const [selectedMonth, setSelectedMonth] = useState(moment())
  const [columns, setColumn] = useState([])
  const [visible, setVisible] = useState(false)
  const [tags, setTags] = useState(null)
  const [loading, setLoading] = useState(false)
  let { start: fiscalYearStart, end: fiscalYearEnd } = getFiscalYear('dates');

  useEffect(() => {
    
    
    _generateMonthlyColumns({
      compName: 'timesheetSummary',
      contantColmuns,
      setColumn,
      spliceBtw: 9,
      width: '3%',
      format: 'status',
      // colRender: 'filteredHours',
      dataIndex: ['months']
    });
    mergeFilter({})
  }, [])

  const getData = (queryParam, tagsValues) =>{
    setLoading(true)
    getTimesheetSummary(queryParam).then(res=>{
      if (res.success){
        // console.log(res.data)
        setData(res.data)
        if(queryParam){
          setVisible(false)
          setTags(tagsValues)
        }
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

  const mergeFilter = ({month, queryParam='', tagsValues}) =>{

    queryParam = !queryParam? _createQuery(tags??{}): queryParam
    month = month ?? selectedMonth
    // let { start, end } = getFiscalYear('dates', month);

    let query = `startDate=${fiscalYearStart.format('YYYY-MM-DD')}&endDate=${fiscalYearEnd.format(
      'YYYY-MM-DD'
    )}&currentDate=${month.format('YYYY-MM-DD')}${
      queryParam ? `&${queryParam}` : ''
    }`;

    getData(query, tagsValues)
  }

  return (
    <div>
      <Row justify="space-between">
        <Col>
          <Typography.Title level={4}>Timesheets Summary</Typography.Title>
        </Col>
        <Col>
          <Button size="small" onClick={()=>setVisible(true)}>Filters</Button>
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
              <DatePicker
                picker="month"
                value={selectedMonth}
                style={{ width: 200 }}
                disabledDate={(current)=>{
                  return current && 
                    current <= fiscalYearStart ||
                      current >= fiscalYearEnd;
                }}
                size="small"
                format="MMM YYYY"
                onChange={(month) => {
                  month = month ?? moment();
                  setSelectedMonth(month)
                  mergeFilter({month});
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
        <ReportsFilters
          compName={'Filters'}
          compKey={'timesheet_summary'}
          tags={tags}
          visible={visible}
          getCompData={mergeFilter}
          invisible={()=>setVisible(false)}
      />
    </div>
  );
}

export default TimesheetSummary