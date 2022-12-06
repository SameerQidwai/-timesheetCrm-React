import React, { useState, useEffect } from 'react'
import { Button, Col, Row, Typography } from 'antd'
import Table, { tableTitleFilter } from '../Table/TableFilter'
import { BencheResData } from './WIHData'

const {Title, Text} = Typography
const resourceColumn = [
    {
        key: 'name',
        dataIndex: 'name',
        title: 'Resource Name',
    },
    {
        key: 'type',
        dataIndex: 'type',
        title: 'Resource Type',
    },
    // Atable.EXPAND_COLUMN
]

const skillColumn = [
    {
        key: 'skill',
        dataIndex: 'skill',
        title: 'Skill'
    },
    {
        key: 'level',
        dataIndex: 'level',
        title: 'skill Level'
    },
    {
        key: 'buyRate',
        dataIndex: 'buyRate',
        title: 'Buy Rate'
    },
]

function BenchResources() {
    const [data, setData] = useState(BencheResData)

    useEffect(() => {
        let resource = []
        let resIndex = 0
        data.forEach(async(el, index)=>{
            if (el.name !== data?.[index - 1]?.['name']){
                resIndex++
                resource.push({...el, skill: [{...el}]})
            }else{
                resource[resIndex]['skill'].push({...el})
            }
        })
        setData(resource)
    }, [])

    const generalFilter = () =>{
        return
    }
    
    return (
        <Row>
            <Col span={24}>
            <Table
                title={()=> <Row justify='space-between'>
                    <Col flex={5}>
                        <Title level={3}>Resources on the bench </Title>
                    </Col>
                    <Col flex={1}><Button size='small'>Filter</Button></Col>
                    <Col span={5}>
                        {tableTitleFilter(24, generalFilter)}
                    </Col>
                </Row> 
                }
                columns={resourceColumn}
                // dataSource={()=>{
                    //     let resource = []
                //     data.forEach((el, index)=>{
                    //         if (el.name !== data?.[index - 1]?.['name']){
                //             resource.push(el)
                //         }
                //     })
                //     return resource
                // }}
                dataSource={data}
                expandable={{
                    rowExpandable: record => record?.skill?.length > 0,
                    expandedRowRender: record => {
                        return (
                            <Table 
                            style={{paddingLeft: 150, paddingRight: 50}}
                            dataSource={record.skill} 
                            // dataSource={()=>{
                                //     let skills = []
                                //     data.forEach((el, index)=>{
                                    //         if (record.name === (data?.[index - 1]?.['name'] ?? record.name)){
                                        //             skills.push(el)
                                        //         }
                                        //     })
                                        //     return skills
                                        // }} 
                                        columns={skillColumn}
                                        />)
                                    },
                                }}
                                />
            </Col>
        </Row>
    )
}

export default BenchResources