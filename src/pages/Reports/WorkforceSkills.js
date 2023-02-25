import React, { useState, useEffect } from 'react'
import { Button, Col, Row, Typography, Table as Atable } from 'antd'
import Table, { FiltertagsNew, tableSorter } from '../../components/Core/Table/TableFilter'
import { downloadReportFile, getWorkforceSkills } from '../../service/reports-Apis'
import { Api, formatCurrency, localStore } from '../../service/constant'
// import { ReportsFilters, _createQuery } from './ReportFilters'
import { ReportsFilters, _createQuery } from '../../components/Core/ReportFilters';

const {Title, Text} = Typography


function WorkforceSkills() {
  const [data, setData] = useState([])
  const [visible, setVisible] = useState(false)
  const [tags, setTags] = useState(null)
  const [loading, setLoading] = useState(false)

  const columns = [
    {
      key: 'skill',
      dataIndex: 'skill',
      title: 'Standard Skill',
      width: '25%',
      ...tableSorter('skill', 'string', true),
    },
    {
        key: 'skillLevel',
        dataIndex: 'skillLevel',
        title: 'Standard Level',
        ...tableSorter('skillLevel', 'string'),
    },
    {
        key: 'name',
        dataIndex: 'name',
        title: 'Resource Name',
        ...tableSorter('name', 'string'),
    },
    {
      key: 'resourceType',
      dataIndex: 'resourceType',
      title: 'Resource Type',
      ...tableSorter('resourceType', 'string'),
    },
    {
        key: 'employmentType',
        dataIndex: 'employmentType',
        title: 'Employee Status',
        ...tableSorter('employmentType', 'string'),
    },
    {
        key: 'buyRate',
        dataIndex: 'buyRate',
        title: 'Buy Rate (Hourly)',
        render: (text)=> formatCurrency(text),
        ...tableSorter('buyRate', 'number'),
    },
  ]
  
  useEffect(() => {
      getData()
  }, [])

  const getData = (queryParam, tagsValues) =>{
    setLoading(true)
    getWorkforceSkills(queryParam).then(res=>{
        if (res.success){
            setData(res.data)
            setVisible(false)
            if(queryParam){
              setTags({...tagsValues})
            }
        }
        setLoading(false)
    })
  }

  const exportData = () =>{
    setLoading(true)
    let query = _createQuery(tags??{})
    getWorkforceSkills(query, '/export').then(res=>{
      if (res.success){
        downloadReportFile(res.data, 'Workforce Skill ')
      }
      setLoading(false)
    })
  }
  
  const tableTitle = () => {
    return (
      <Row justify="space-between">
        <Col>
          <Title level={5}>Workforce Skill </Title>
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
                  title={()=>tableTitle()}
                  sticky
                  rowKey={'index'}
                  loading={loading}
                  columns={columns}
                  pagination={false}
                  //for pagination
                //   {
                //     hideOnSinglePage: false,
                //     showPageSizeChanger: true,
                //     onChange:(pNo, pSize)=> {
                //         setPage({pNo, pSize})
                //     }
                // }
                  dataSource={data}
              />
          </Col>
          <ReportsFilters
              compName={'Filters'}
              compKey={'skillResources'}
              tags={tags}
              visible={visible}
              getCompData={getData}
              invisible={()=>setVisible(false)} 
          />
      </Row>
  )
}

export default WorkforceSkills