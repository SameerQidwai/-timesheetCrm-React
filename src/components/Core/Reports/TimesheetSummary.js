import React, { useState, useEffect } from 'react'
import { Button, Col, Descriptions, Row, Select, Typography } from 'antd'
import Table, { FiltertagsNew, tableSorter } from '../Table/TableFilter'
import { getProjectRevenueAnalysis } from '../../../service/reports-Apis'


import { formatCurrency, formatFloat, getFiscalYear, localStore, parseDate } from '../../../service/constant'
import moment from 'moment'
import { ReportsFilters, _createQuery } from './Filters'

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
    width: '10%',
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
    key: 'projectId',
    dataIndex: 'projectId',
    title: 'Project Code',
    width: '6%',
    render: (text)=> (`00${text}`), 
    ...tableSorter('projectId', 'string'),
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
    key: 'organizationId',
    dataIndex: 'organizationId',
    title: 'Organisation',
    width: '5%',
    render: (value)=> (formatCurrency(value??0)),
    ...tableSorter('yieldedRevenue', 'number'),
  },
  {
    key: 'YTDTotalSell',
    dataIndex: 'YTDTotalSell',
    title: 'YTD Completed Work',
    width: '5%',
    render: (value)=> (formatCurrency(value??0)),
    ...tableSorter('YTDTotalSell', 'number'),
  },
  {
    key: 'empty',
    dataIndex: 'empty',
    width: '1%'
  },
  {
    key: 'projectValue',
    dataIndex: 'projectValue',
    title: 'Total Contract Value',
    width: '4%',
    render: (value)=> (formatCurrency(value??0)),
    ...tableSorter('projectValue', 'number'),
  },
  {
    key: 'residualedRevenue',
    dataIndex: 'residualedRevenue',
    title: 'Residual Contract Value',
    width: '4%',
    render: (_, record)=> formatCurrency(parseFloat(record.projectValue??0) - parseFloat(record.totalSell??0)),
    ...tableSorter('residualedRevenue', 'number'),
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
    generateColumns()
    getData()
  }, [])
  return (
    <Row gutter={[0,24]}>
        <Col span={24}>
            <Typography.Title level={4}>Timesheets Summary</Typography.Title>
        </Col>
        <Col span={24}>
            <Descriptions title="YTD Completed Hours" bordered column={1}>
                <Descriptions.Item label=""><Select/></Descriptions.Item>
                <Descriptions.Item label="T&M"></Descriptions.Item>
                <Descriptions.Item label="Milestone"></Descriptions.Item>
                <Descriptions.Item label="Total Completed Hours"></Descriptions.Item>
            </Descriptions>
        </Col>
        <Col span={24}>
            <Table
                sticky
                title={() => 'Timesheet Data - T&M'}
                columns={columns}
                loading={loading}
                rowKey={'projectId'}
                dataSource={data}
                pagination={{
                    hideOnSinglePage: false,
                    showPageSizeChanger: true,
                    onChange:(pNo, pSize)=> {
                        setPage({pNo, pSize})
                    }
                }}
                scroll={{
                    // x:  'max-content'
                    x:  '300vw'
                }}
            />
        </Col>
        <Col span={24}>
            <Table
                sticky
                title={() => 'Timesheet Data - Milestone'}
                columns={columns}
                loading={loading}
                rowKey={'projectId'}
                dataSource={data}
                pagination={{
                    hideOnSinglePage: false,
                    showPageSizeChanger: true,
                    onChange:(pNo, pSize)=> {
                        setPage({pNo, pSize})
                    }
                }}
                scroll={{
                    // x:  'max-content'
                    x:  '300vw'
                }}
            />
        </Col>
    </Row>
  )
}

export default TimesheetSummary