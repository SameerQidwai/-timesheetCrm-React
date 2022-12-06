import React, { useState, useEffect } from 'react'
import { Button, Col, Row, Typography, Table as Atable } from 'antd'
import Table, { tableTitleFilter } from '../Table/TableFilter'
import { BencheResData } from './WIHData'

const {Title, Text} = Typography
const skillColumn = [
    {
        key: 'skill',
        dataIndex: 'skill',
        title: 'Skill',
    },
    {
        key: 'level',
        dataIndex: 'level',
        title: 'Skill Level',
    },
]

const resourceColumn = [
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
        key: 'buyRate',
        dataIndex: 'buyRate',
        title: 'Buy Rate'
    },
]

function WorkforceSkills() {
    const [data, setData] = useState(BencheResData)

    useEffect(() => {
        let skills = []
        let resIndex = 0
        data.forEach((el, index)=>{
            if (el.skill !== data?.[index - 1]?.['skill'] || el.level !== data?.[index - 1]?.['level']){
                resIndex = index
                skills.push({...el, resources: [{...el}], skill: data?.[index - 1]?.['skill']  !== el.skill? el.skill : ''})
            }else{
                skills[resIndex]['resources'].push({...el})
            }
        })
        setData(skills)
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
                columns={skillColumn}
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
                    rowExpandable: record => record?.resources?.length > 0,
                    expandedRowRender: record => {
                        return (
                            <Table 
                            style={{paddingLeft: 150, paddingRight: 50}}
                            dataSource={record.resources} 
                            // dataSource={()=>{
                                //     let skills = []
                                //     data.forEach((el, index)=>{
                                    //         if (record.name === (data?.[index - 1]?.['name'] ?? record.name)){
                                        //             skills.push(el)
                                        //         }
                                        //     })
                                        //     return skills
                                        // }} 
                                        columns={resourceColumn}
                                        />)
                                    },
                                }}
                                />
            </Col>
        </Row>
    )
}

export default WorkforceSkills