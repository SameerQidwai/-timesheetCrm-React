import React, { useState, useEffect } from 'react'
import { Button, Col, Row, Typography, Table as Atable } from 'antd'
import Table, { FiltertagsNew, tableSorter } from '../../components/Core/Table/TableFilter'
import { Api, formatCurrency, formatDate, formatFloat, localStore } from '../../service/constant'


import { downloadReportFile, getPositions } from '../../service/reports-Apis'
// import { ReportsFilters, _createQuery } from './ReportFilters'
import { ReportsFilters, _createQuery } from '../../components/Core/ReportFilters';

const {Title, Text} = Typography


function Positions() {
    const [data, setData] = useState([])
    const [visible, setVisible] = useState(false)
    const [tags, setTags] = useState(null)
    const [loading, setLoading] = useState(false)

    const columns = [
        {
            key: 'title',
            dataIndex: 'title',
            fixed: true,
            title: 'Title',
            width: 260,
            ...tableSorter('title', 'string', true),
        },
        {
            key: 'workType',
            dataIndex: 'workType',
            // fixed: true,
            title: 'Type',
            width: 100,
            ...tableSorter('workType', 'string')
        },
        {
            key: 'workStatus',
            dataIndex: 'workStatus',
            // fixed: true,
            title: 'Status',
            width: 100,
            ...tableSorter('workStatus', 'string'),
        },
        {
            key: 'organization',
            dataIndex: 'organization',
            // fixed: true,
            title: 'Organisation Name',
            width: 200,
            ...tableSorter('organization', 'string')
        },
        {
            key: 'milestone',
            dataIndex: 'milestone',
            // fixed: true,
            title: 'Milestone',
            width: 100,
            ...tableSorter('milestone', 'string')
        },
        {
            key: 'position',
            dataIndex: 'position',
            title: 'Position Title',
            width: 100,
            ...tableSorter('position', 'string')
        },
        {
            key: 'skill',
            dataIndex: 'skill',
            title: 'Standard Skill',
            width: 250,
            ...tableSorter('skill', 'string')
        },
        {
            key: 'skillLevel',
            dataIndex: 'skillLevel',
            title: 'Standard Level',
            width: 80,
            ...tableSorter('skillLevel', 'string')
        },
        {
            key: 'name',
            dataIndex: 'name',
            title: 'Resource Name',
            width: 180,
            ...tableSorter('name', 'string')
        },
        {
            key: 'resourceType',
            dataIndex: 'resourceType',
            title: 'Resource Type',
            width: 80,
            ...tableSorter('resourceType', 'string'),
        },
        {
            key: 'employmentType',
            dataIndex: 'employmentType',
            title: 'Employee Status',
            width: 80,
            ...tableSorter('employmentType', 'string')
        },
        {
            key: 'bookingType',
            dataIndex: 'bookingType',
            title: 'Booking Type',
            width: 80,
            ...tableSorter('bookingType', 'string')
        },
        {
            key: 'buyRate',
            dataIndex: 'buyRate',
            title: 'Buy Rate (Hourly)',
            width: 80,
            render: (text)=> formatCurrency(text),
            ...tableSorter('buyRate', 'number')
        },
        {
            key: 'sellRate',
            dataIndex: 'sellRate',
            title: 'Sell Rate (Hourly)',
            width: 80,
            render: (text)=> formatCurrency(text),
            ...tableSorter('sellRate', 'number')
        },
        {
            key: 'CMPercent',
            dataIndex: 'CMPercent',
            title: 'CM%',
            width: 80,
            render: (text)=> formatFloat(text) + ' %',
            ...tableSorter('CMPercent', 'number')
        },
        {
            key: 'startDate',
            dataIndex: 'startDate',
            title: 'Position Start Date',
            width: 130,
            render: (text) => formatDate(text, true, true),
            ...tableSorter('startDate', 'date')
        },
        {
            key: 'endDate',
            dataIndex: 'endDate',
            title: 'Position End Date',
            width: 130,
            render: (text) => formatDate(text, true, true),
            ...tableSorter('endDate', 'date')
        },
    ]

    useEffect(() => {
        getData()
    }, [])

    const getData = (queryParam, tagsValues) =>{
        setLoading(true)
        getPositions(queryParam).then(res=>{
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

    const exportData = () =>{
        setLoading(true)
        let query = _createQuery(tags??{})
        getPositions(query, '/export').then(res=>{
          if (res.success){
            downloadReportFile(res.data, 'Position Allocations')
          }
          setLoading(false)
        })
      }

    const tableTitle = () => {
      return (
        <Row justify="space-between">
          <Col>
            <Title level={5}>Opportunity & Project Position Allocations </Title>
          </Col>
            <Col>
                <Row justify="end" gutter={5}>
                    <Col >
                    <Button size="small" onClick={exportData}>Download CSV</Button>
                    </Col>
                    <Col>
                    <Button size="small" onClick={() => setVisible(true)}>
                    Filters
                    </Button>
                    </Col>
                </Row>
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
                    rowKey={'index'}
                    loading={loading}
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    scroll={{
                        x:  'max-content'
                    }}
                />
            </Col>
            <ReportsFilters
                compName={'Filters'}
                compKey={'positions'}
                tags={tags}
                visible={visible}
                getCompData={getData}
                invisible={()=>setVisible(false)}
            />
        </Row>
    )
}

export default Positions
