import React, { useState, useEffect } from 'react'
import { Button, Col, Row, Typography, Table as Atable } from 'antd'
import Table, { FiltertagsNew, tableSorter } from '../Table/TableFilter'
import { formatCurrency, formatDate, formatFloat, localStore } from '../../../service/constant'
import { getLeaveSummary } from '../../../service/reports-Apis'
import { ReportsFilters, _createQuery } from './Filters'

const {Title, Text} = Typography

const employeeColumns = [
    {
        key: 'employeeName',
        dataIndex: 'employeeName',
        title: 'Employee Name',
        width: '33.33%',
        ...tableSorter('employeeName', 'string', true),
    },
    {
        key: 'employeeCode',
        dataIndex: 'employeeCode',
        title: 'Employee Code',
        width: '33.33%',
        render: (text)=> (`00${text}`), 
        ...tableSorter('employeeCode', 'number'),
    },
    {
        key: 'totalHours',
        dataIndex: 'totalHours',
        title: 'Total Hours',
        width: '33.33%',
        render: (value)=> (formatFloat(value??0)),
        ...tableSorter('totalHours', 'number'),
    },
]
const requestsColumn = [
    {
        key: 'leaveType',
        dataIndex: 'leaveType',
        title: 'Leave Type',
        ...tableSorter('leaveType', 'string', true),
    },
    {
        key: 'projectTitle',
        dataIndex: 'projectTitle',
        title: 'Project Title',
        ...tableSorter('projectTitle', 'string'),
    },
    {
        key: 'projectCode',
        dataIndex: 'projectCode',
        title: 'Project Code',
        render: (text)=> text && (`00${text}`),
        ...tableSorter('projectCode', 'number'),
    },
    {
        key: 'startDate',
        dataIndex: 'startDate',
        title: 'Start Date',
        render: (text) => formatDate(text, true, true),
        ...tableSorter('startDate', 'string'),
    },
    {
        key: 'endDate',
        dataIndex: 'endDate',
        title: 'End Date',
        render: (text) => formatDate(text, true, true),
        ...tableSorter('endDate', 'string'),
    },
    {
        key: 'hours',
        dataIndex: 'hours',
        title: 'Hours',
        render: (value)=> (formatFloat(value??0)),
        ...tableSorter('hours', 'string'),
    },
    {
        key: 'leaveStatus',
        dataIndex: 'leaveStatus',
        title: 'Status',
        ...tableSorter('leaveStatus', 'string'),
    },
]


function LeaveSummary() {
    const [data, setData] = useState([])
    const [visible, setVisible] = useState(false)
    const [tags, setTags] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getData()
    }, [])

    const getData = (queryParam, tagsValues) =>{
        setLoading(true)
        getLeaveSummary(queryParam).then(res=>{
            if (res.success){
                setData(res.data)
                if(queryParam){
                  setVisible(false)
                  setTags(tagsValues)
                }
            }
            setLoading(false)
        })
    }

    const tableTitle = () => {
      return (
        <Row justify="space-between">
          <Col>
            <Title level={5}>Leave Request Summary</Title>
          </Col>
          <Col>
            <Button size="small" onClick={() => setVisible(true)}> Filters </Button>
          </Col>
          <Col span={24}>
            <FiltertagsNew
              filters={tags}
              filterFunction={(updatedValue, el) => {
                let TAGS = {...tags}
                TAGS[el]['value'] = updatedValue; 
                let query = _createQuery(TAGS)
                getData(query, tags)
              }}
            />
          </Col>
        </Row>
      );
    };
    
    return (
        <Row>
            <Col span={24}>
                <Table
                    sticky
                    title={()=>tableTitle()}
                    rowKey={'employeeCode'}
                    loading={loading}
                    columns={employeeColumns}
                    dataSource={data}
                    expandable={{
                        rowExpandable: (record) => record?.leaveRequests?.length > 0,
                        expandedRowRender: (record) => {
                          return (
                            <Row justify='center'>
                              <Col span={23}>
                                <Table
                                  dataSource={record.leaveRequests}
                                  rowKey={'leaveRequestId'}
                                  columns={requestsColumn}
                                  className="expandtable-margin"
                                />
                              </Col>
                            </Row>
                          );
                        },
                      }}
                    pagination={false}
                />
            </Col>
            <ReportsFilters
                compName={'Filters'}
                compKey={'leave_summary'}
                tags={tags}
                visible={visible}
                getCompData={getData}
                invisible={()=>setVisible(false)}
            />
        </Row>
    )
}

export default LeaveSummary

