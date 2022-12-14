import React, { useState, useEffect } from 'react'
import { Button, Col, Row, Typography, Table as Atable } from 'antd'
import Table, { FiltertagsNew } from '../Table/TableFilter'
import { getBenchResources } from '../../../service/reports-Apis'
import ReportsFilters from './ReportsFilters'

const {Title, Text} = Typography
const resourceColumn = [
    {
        key: 'name',
        dataIndex: 'name',
        title: 'Resource Name',
    },
    Atable.EXPAND_COLUMN,
    {
        key: 'type',
        dataIndex: 'type',
        title: 'Resource Type',
        width: '30.22%'
    },
    {
        key: 'buyRate',
        dataIndex: 'buyRate',
        title: 'Buy Rate',
        width: '23.79%'
    },
]

const skillColumn = [
    {
        key: 'skill',
        dataIndex: 'skill',
        title: 'Skill',
        width: '30.22%'
    },
    {
        key: 'level',
        dataIndex: 'level',
        title: 'skill Level',
        width: '23.79%'
    },
]

function BenchResources() {
  const [data, setData] = useState([])
  const [visible, setVisible] = useState(false)
  const [tags, setTags] = useState(null)


  useEffect(() => {
      getData()
  }, [])

  const getData = (queryParam, tagsValues) =>{
      getBenchResources(queryParam).then(res=>{
          if (res.success){
              setData(res.data)
              if(queryParam){
                setVisible(false)
                setTags(tagsValues)
              }
          }
      })
  }

  const tableTitle = () =>{
    return(
      <Row justify="space-between">
        <Col >
          <Title level={5}>Resources on the bench </Title>
        </Col>
        <Col >
          <Button size="small" onClick={()=>setVisible(true)}>Filters</Button>
        </Col>
        <Col span={24}>
          <FiltertagsNew
            filters={tags}
            filterFunction={()=>{setTags(null);getData()}}
          />
        </Col>
    </Row>
  )
}

  
  return (
    <Row>
      <Col span={24}>
        <Table
          title={() => tableTitle()}
          columns={resourceColumn}
          rowKey={'index'}
          dataSource={data}
          expandable={{
            rowExpandable: (record) => record?.skills?.length > 0,
            expandedRowRender: (record) => {
              return (
                <Row justify='end' >
                  <Col span={13}>
                    <Table
                      dataSource={record.skills}
                      rowKey={'skill'}
                      columns={skillColumn}
                      className="expandtable-margin"
                    />
                  </Col>
                </Row>
              );
            },
          }}
        />
      </Col>
      <ReportsFilters
          compName={'Bench Resources Filters'}
          compKey={'bench'}
          tags={tags}
          visible={visible}
          getCompData={getData}
          invisible={()=>setVisible(false)}
      />
    </Row>
  );
}

export default BenchResources