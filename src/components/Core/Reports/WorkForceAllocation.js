import React, { useState, useEffect } from 'react'
import { Button, Col, Row, Typography, Table as Atable } from 'antd'
import Table, { FiltertagsNew, tableSorter, tableTitleFilter } from '../Table/TableFilter'
import { BencheResData,  WorkforceData } from './WIHData'
import { formatCurrency, formatDate, localStore } from '../../../service/constant'
import ReportsFilters, { _createQuery } from './ReportsFilters'
import { getAllocations } from '../../../service/reports-Apis'

const {Title, Text} = Typography


function WorkForceAllocation() {
    const [data, setData] = useState()
    const [visible, setVisible] = useState(false)
    const [page, setPage] = useState({pNo:1, pSize: localStore().pageSize})
    const [tags, setTags] = useState(null)	
    const [loading, setLoading] = useState(false)			

    const columns = [
        {
            key: 'name',
            dataIndex: 'name',
            fixed: true,
            title: 'Resource Name',
            width: 200,
            ...tableSorter('name', 'string', true),
        },
        {
            key: 'resourceType',
            dataIndex: 'resourceType',
            title: 'Resource Type',
            // width: 100,
            ...tableSorter('employeeStatus', 'string'),
        },
        {
            key: 'employmentType',
            dataIndex: 'employmentType',
            // fixed: true,
            title: 'Employee Status',
            // width: 100,
            ...tableSorter('type', 'string'),
        },
        
        {
            key: 'title',
            dataIndex: 'title',
            // fixed: true,
            title: 'Title',
            width: 300,
            ...tableSorter('title', 'string'),
        },
        {
            key: 'workType',
            dataIndex: 'workType',
            // fixed: true,
            title: 'Type',
            // width: 100,
            ...tableSorter('workType', 'string'),
        },
        {
            key: 'organization',
            dataIndex: 'organization',
            // fixed: true,
            width: 200,
            title: 'organization Name',
            ...tableSorter('organization', 'string'),
        },
        {
            key: 'milestone',
            dataIndex: 'milestone',
            // fixed: true,
            title: 'Milestone',
            ...tableSorter('milestone', 'string'),
        },
        {
            key: 'position',
            dataIndex: 'position',
            title: 'position',
            ...tableSorter('position', 'string'),
        },
        {
            key: 'bookingType',
            dataIndex: 'bookingType',
            title: 'Booking Type',
            ...tableSorter('booking', 'string'),
        },
        {
            key: 'skill',
            dataIndex: 'skill',
            title: 'skill',
            ...tableSorter('skill', 'string'),
        },
        {
            key: 'skillLevel',
            dataIndex: 'skillLevel',
            title: 'Skill Level',
            ...tableSorter('skillLevel', 'string'),
        },
        {
            key: 'buyRate',
            dataIndex: 'buyRate',
            title: 'Buy Rate (Hourly)',
            render: (text)=> formatCurrency(text),
            ...tableSorter('buyRate', 'string'),

        },
        {
            key: 'sellRate',
            dataIndex: 'sellRate',
            title: 'Sell Rate (Hourly)',
            render: (text)=> formatCurrency(text),
            ...tableSorter('buyRate', 'string'),
        },
        {
            key: 'startDate',
            dataIndex: 'startDate',
            title: 'Position Start Date',
            render: (text) => formatDate(text, true, true),
            ...tableSorter('startDate', 'date'),
        },
        {
            key: 'endDate',
            dataIndex: 'endDate',
            title: 'Position End Date',
            render: (text) => formatDate(text, true, true),
            ...tableSorter('endDate', 'date'),
        },
    ]
    

    useEffect(() => {
        getData()
    }, [])

    const getData = (queryParam, tagsValues) =>{
        setLoading(true)
        getAllocations(queryParam).then(res=>{
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
              <Title level={5}>Workforce Allocations</Title>
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

     //-------------> HELPER <----------
     const _nextCellRender = (text, index, key)=>{
        let { pNo, pSize } = page
        let dataSourceIndex = ((pNo - 1) * pSize + index)
        return (text === data?.[dataSourceIndex-1 ]?.[key] && index) ? '' : text
    }
    
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
                    pagination={{
                        hideOnSinglePage: false,
                        onChange:(pNo, pSize)=> {
                            setPage({pNo, pSize})
                        }
                    }}
                    scroll={{
                        x:  'max-content'
                    }}
                />
            </Col>
            <ReportsFilters
                compName={'Workforce Allocation Filters'}
                compKey={'allocations'}
                tags={tags}
                visible={visible}
                getCompData={getData}
                invisible={()=>setVisible(false)}
            />
        </Row>
    )
}

export default WorkForceAllocation