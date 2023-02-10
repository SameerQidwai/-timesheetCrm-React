import React, { useState, useEffect } from 'react'
import { Button, Col, Row, Typography, Table as Atable } from 'antd'
import Table, { FiltertagsNew, tableSorter } from '../Table/TableFilter'
import { downloadReportFile, getBenchResources } from '../../../service/reports-Apis'
import { Api, formatCurrency } from '../../../service/constant'
import { ReportsFilters, _createQuery } from './Filters'

const {Title, Text} = Typography
const resourceColumn = [
    {
      key: 'name',
      dataIndex: 'name',
      title: 'Resource Name',
      ...tableSorter('name', 'string')
    },
    {
      key: 'resourceType',
      dataIndex: 'resourceType',
      title: 'Resource Type',
      width: '23.79%',
      ...tableSorter('resourceType', 'string')
    },
    Atable.EXPAND_COLUMN,
    {
      key: 'employmentType',
      dataIndex: 'employmentType',
      title: 'Employee Status',
      width: '30.22%',
      ...tableSorter('employmentType', 'string')
    },
    {
        key: 'buyRate',
        dataIndex: 'buyRate',
        title: 'Buy Rate (Hourly)',
        width: '23.79%',
        ...tableSorter('buyRate', 'number'),
        render: (text)=> formatCurrency(text)
    },
]

const skillColumn = [
    {
      key: 'skill',
      dataIndex: 'skill',
      title: 'Skill',
      width: '30.22%',
      ...tableSorter('skill', 'string'),
    },
    {
      key: 'level',
      dataIndex: 'level',
      title: 'skill Level',
      width: '23.79%',
      ...tableSorter('level', 'string'),
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

  const exportData = () =>{
    setLoading(true)
    let query = _createQuery(tags??{})
    getBenchResources(query, '/export').then(res=>{
      if (res.success){
        downloadReportFile(res.data, 'Unallocated Resources')
      }
      setLoading(false)
    })
  }

  const tableTitle = () =>{
    return(
      <Row justify="space-between">
        <Col >
          <Title level={5}>Unallocated Resources</Title>
        </Col>
        <Col span={6}>
          <Row justify="end" gutter={5}>
            <Col >
            <Button size="small" onClick={()=>{
              exportData()}}>Download CSV</Button>
            </Col>
            <Col>
          <Button size="small" onClick={()=>setVisible(true)}>Filters</Button>
            </Col>
          </Row>
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
          compName={'Filters'}
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