import React, { useState, useEffect } from 'react'
import { Button, Col, Row, Typography, Table as Atable } from 'antd'
import Table, { FiltertagsNew, tableTitleFilter } from '../Table/TableFilter'
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

    const columns = [
        {
            key: 'name',
            dataIndex: 'name',
            fixed: true,
            title: 'Resource Name',
            width: 200,
            render:(text, record, index)=> _nextCellRender(text, index, 'name')
        },
        {
            key: 'type',
            dataIndex: 'type',
            fixed: true,
            title: 'Resource Type',
            width: 100,
            render:(text, record, index)=> _nextCellRender(text, index, 'type')
        },
        {
            key: 'workType',
            dataIndex: 'workType',
            fixed: true,
            title: 'Opportunity/Project',
            width: 100,
            render:(text, record, index)=> _nextCellRender(text, index, 'work')
        },
        {
            key: 'title',
            dataIndex: 'title',
            fixed: true,
            title: 'Project Title',
            width: 200,
            render:(text, record, index)=> _nextCellRender(text, index, 'title')
        },
        {
            key: 'organization',
            dataIndex: 'organization',
            // fixed: true,
            title: 'organization Title',
            render:(text, record, index)=> _nextCellRender(text, index, 'organization')
        },
        {
            key: 'milestone',
            dataIndex: 'milestone',
            // fixed: true,
            title: 'Title',
            render:(text, record, index)=> _nextCellRender(text, index, 'milestone')
        },
        {
            key: 'position',
            dataIndex: 'position',
            title: 'position',
        },
        {
            key: 'booking',
            dataIndex: 'booking',
            title: 'Booking Type',
        },
        {
            key: 'skill',
            dataIndex: 'skill',
            title: 'skill',
        },
        {
            key: 'skillLevel',
            dataIndex: 'skillLevel',
            title: 'Skill Level',
        },
        {
            key: 'buyRate',
            dataIndex: 'buyRate',
            title: 'Buy Rate',
            render: (text)=> formatCurrency(text)
        },
        {
            key: 'sellRate',
            dataIndex: 'sellRate',
            title: 'Sell Rate',
            render: (text)=> formatCurrency(text)
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
                    title={()=>tableTitle()}
                    rowKey={'index'}
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