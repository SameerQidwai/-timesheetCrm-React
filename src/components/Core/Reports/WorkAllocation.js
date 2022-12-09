import React, { useState, useEffect } from 'react'
import { Button, Col, Row, Typography, Table as Atable } from 'antd'
import Table, { FiltertagsNew } from '../Table/TableFilter'
import {  workAllocationData } from './WIHData'
import { formatDate, localStore } from '../../../service/constant'
import ReportsFilters from './ReportsFilters'
import { getAllocations } from '../../../service/reports-Apis'

const {Title, Text} = Typography


function WorkAllocation() {
    const [data, setData] = useState([])
    const [visible, setVisible] = useState(false)
    const [page, setPage] = useState({pNo:1, pSize: localStore().pageSize})
    const [tags, setTags] = useState({})

    const columns = [
        {
            key: 'workType',
            dataIndex: 'workType',
            fixed: true,
            title: 'Opportunity/Project',
            width: 100,
            render:(text, record, index)=> {
                let { pNo, pSize } = page
                let dataSourceIndex = ((pNo - 1) * pSize + index)
                return (text === data?.[dataSourceIndex-1 ]?.['workType'] && index) ? '' : text
            }
        },
        {
            key: 'title',
            dataIndex: 'title',
            fixed: true,
            title: 'Title',
            width: 200,
            render:(text, record, index)=> {
                let { pNo, pSize } = page
                let dataSourceIndex = ((pNo - 1) * pSize + index)
                return (text === data?.[dataSourceIndex-1 ]?.['title'] && index) ? '' : text
            }
        },
        {
            key: 'organization',
            dataIndex: 'organization',
            fixed: true,
            title: 'Organisation Name',
            width: 200,
            render:(text, record, index)=> {
                let { pNo, pSize } = page
                let dataSourceIndex = ((pNo - 1) * pSize + index)
                return (text === data?.[dataSourceIndex-1 ]?.['organization'] && index) ? '' : text
            }
        },
        {
            key: 'milestone',
            dataIndex: 'milestone',
            fixed: true,
            title: 'Milestone',
            width: 100,
            render:(text, record, index)=> {
                let { pNo, pSize } = page
                let dataSourceIndex = ((pNo - 1) * pSize + index)
                return (text === data?.[dataSourceIndex-1 ]?.['milestone'] && index) ? '' : text
            }
        },
        {
            key: 'position',
            dataIndex: 'position',
            title: 'Position Title'
        },
        {
            key: 'skill',
            dataIndex: 'skill',
            title: 'Skill'
        },
        {
            key: 'skillLevel',
            dataIndex: 'skillLevel',
            title: 'Skill Level'
        },
        {
            key: 'name',
            dataIndex: 'name',
            title: 'Resource Name'
        },
        {
            key: 'type',
            dataIndex: 'type',
            title: 'Resource Type'
        },
        {
            key: 'booking',
            dataIndex: 'booking',
            title: 'Booking Type'
        },
        {
            key: 'buyRate',
            dataIndex: 'buyRate',
            title: 'Buy Rate'
        },
        {
            key: 'sellRate',
            dataIndex: 'sellRate',
            title: 'Sell Rate'
        },
        {
            key: 'CMPercent',
            dataIndex: 'CMPercent',
            title: 'CM%'
        },
        {
            key: 'startDate',
            dataIndex: 'startDate',
            title: 'Start Date',
            render: (text) => formatDate(text, true, true),
        },
        {
            key: 'endDate',
            dataIndex: 'endDate',
            title: 'End Date',
            render: (text) => formatDate(text, true, true),
        },
    ]

    useEffect(() => {
        getData()
    }, [])

    const getData = (queryParam, tagsValues) =>{
        getAllocations(queryParam).then(res=>{
            if (res.success){
                setData(res.data)
                if(queryParam){
                  setVisible(false)
                  setTags(tagsValues)
                }
            }
        })
    }
    

    const tableTitle = () => {
      return (
        <Row justify="space-between">
          <Col>
            <Title level={5}>Opportunity & Project Position Allocations </Title>
          </Col>
          <Col>
            <Button size="small" onClick={() => setVisible(true)}> Filters </Button>
          </Col>
          <Col span={24}>
            <FiltertagsNew
              filters={tags}
              filterFunction={() => {
                setTags({});
                getData();
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
                    title={()=>tableTitle()}
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
            {/* <ReportsFilters
                compName={'Position Allocations Resources Filter'}
                compKey={'allocated'}
                tags={tags}
                visible={visible}
                getCompData={getData}
                invisible={()=>setVisible(false)}
            /> */}
        </Row>
    )
}

export default WorkAllocation