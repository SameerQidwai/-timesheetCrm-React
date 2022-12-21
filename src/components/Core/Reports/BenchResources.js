import React, { useState, useEffect } from 'react'
import { Button, Col, Row, Typography, Table as Atable } from 'antd'
import Table, { FiltertagsNew } from '../Table/TableFilter'
import { getBenchResources } from '../../../service/reports-Apis'
import ReportsFilters, { _createQuery } from './ReportsFilters'
import { formatCurrency } from '../../../service/constant'

const {Title, Text} = Typography
const resourceColumn = [
    {
        key: 'name',
        dataIndex: 'name',
        title: 'Resource Name',
    },
    {
      key: 'resourceType',
      dataIndex: 'resourceType',
      title: 'Resource Type',
      width: '23.79%'
    },
    Atable.EXPAND_COLUMN,
    {
        key: 'employmentType',
        dataIndex: 'employmentType',
        title: 'Employee Status',
        width: '30.22%'
    },
    {
        key: 'buyRate',
        dataIndex: 'buyRate',
        title: 'Buy Rate (Hourly)',
        width: '23.79%',
        render: (text)=> formatCurrency(text)
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
  const [loading, setLoading] = useState(false)


  useEffect(() => {
      getData()
  }, [])

  const getData = (queryParam, tagsValues) =>{
    setLoading(true)
    getBenchResources(queryParam).then(res=>{
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

  const tableTitle = () =>{
    return(
      <Row justify="space-between">
        <Col >
          <Title level={5}>Resources On The Bench</Title>
        </Col>
        <Col >
          <Button size="small" onClick={()=>setVisible(true)}>Filters</Button>
        </Col>
        <Col span={24}>
          <FiltertagsNew
            filters={tags}
            filterFunction={(updatedValue, el)=>{
              let TAGS = {...tags}
              TAGS[el]['value'] = updatedValue; 
              let query = _createQuery(TAGS)
              getData(query, tags)
            }}
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
          loading={loading}
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