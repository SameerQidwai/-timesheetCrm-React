import React, { useState, useEffect } from 'react'
import { Button, Col, Row, Typography, Table as Atable } from 'antd'
import Table, { tableTitleFilter } from '../Table/TableFilter'
import { BencheResData, workAllocationData, WorkforceData } from './WIHData'
import { formatDate } from '../../../service/constant'

const {Title, Text} = Typography


function WorkForceAllocation() {
    const [data, setData] = useState(workAllocationData||[])
    			 									

    const columns = [
        {
            key: 'work',
            dataIndex: 'work',
            fixed: true,
            title: 'Resource Name',
            render:(text, record, index)=> text === data?.[index-1 ]?.['work'] ? '' : text
        },
        {
            key: 'title',
            dataIndex: 'title',
            fixed: true,
            title: 'Resource Type',
            render:(text, record, index)=> text === data?.[index-1 ]?.['title'] ? '' : text
        },
        {
            key: 'organisation',
            dataIndex: 'organisation',
            fixed: true,
            title: 'Opportunity/Project',
            render:(text, record, index)=> text === data?.[index-1 ]?.['organisation'] ? '' : text
        },
        {
            key: 'milestone',
            dataIndex: 'milestone',
            fixed: true,
            title: 'Title',
            render:(text, record, index)=> text === data?.[index-1 ]?.['milestone'] ? '' : text
        },
        {
            key: 'position',
            dataIndex: 'position',
            title: 'Organisation Name',
        },
        {
            key: 'skill',
            dataIndex: 'skill',
            title: 'Milestone',
        },
        {
            key: 'level',
            dataIndex: 'level',
            title: 'Position Title',
        },
        {
            key: 'resource',
            dataIndex: 'resource',
            title: 'Booking Type',
        },
        {
            key: 'type',
            dataIndex: 'type',
            title: 'Skill',
        },
        {
            key: 'booking',
            dataIndex: 'booking',
            title: 'Skill Level',
        },
        {
            key: 'buyRate',
            dataIndex: 'buyRate',
            title: 'Buy Rate',
        },
        {
            key: 'sellRate',
            dataIndex: 'sellRate',
            title: 'Sell Rate',
        },
        {
            key: 'startDate',
            dataIndex: 'startDate',
            title: 'Start Date',
            render: (text) => formatDate(text, true, true),
        },
        {
            key: 'finishDate',
            dataIndex: 'finishDate',
            title: 'Finish Date',
            render: (text) => formatDate(text, true, true),
        },
    ]
    

    const generalFilter = () =>{
        return
    }

    const tableTitle = () =>{
        return(
        <Row justify='space-between'>
            <Col flex={5}>
                <Title level={5}>Opportunity & Project Position Allocations </Title>
            </Col>
            <Col flex={1}><Button size='small'>Filter</Button></Col>
            <Col span={5}>
                {tableTitleFilter(24, generalFilter)}
            </Col>
        </Row>
        )
    }
    
    return (
        <Row>
            <Col span={24}>
                <Table
                    title={()=>tableTitle()}
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    scroll={{
                        x:  'max-content'
                    }}
                />
            </Col>
        </Row>
    )
}

export default WorkForceAllocation