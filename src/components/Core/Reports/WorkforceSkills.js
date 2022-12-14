import React, { useState, useEffect } from 'react'
import { Button, Col, Row, Typography, Table as Atable } from 'antd'
import Table, { FiltertagsNew, tableSorter } from '../Table/TableFilter'
import ReportsFilters, { _createQuery } from './ReportsFilters'
import { getWorkforceSkills } from '../../../service/reports-Apis'
import { formatCurrency, localStore } from '../../../service/constant'

const {Title, Text} = Typography


function WorkforceSkills() {
  const [data, setData] = useState([])
  const [page, setPage] = useState({pNo:1, pSize: localStore().pageSize??25})
  const [visible, setVisible] = useState(false)
  const [tags, setTags] = useState(null)

  const columns = [
      {
        key: 'skill',
        dataIndex: 'skill',
        title: 'Skill',
        width: '25%',
        // render:(text, record, index)=> _nextCellRender(text, index, 'skill'),
        ...tableSorter('skill', 'string', true),
      },
      {
          key: 'skillLevel',
          dataIndex: 'skillLevel',
          title: 'Skill Level',
          render:(text, record, index)=> _nextCellRender(text, index, 'skillLevel'),
          ...tableSorter('skill', 'string', true),
      },
      {
          key: 'name',
          dataIndex: 'name',
          title: 'Resource Name',
          ...tableSorter('skill', 'string', true),
      },
      {
          key: 'type',
          dataIndex: 'type',
          title: 'Resource Type'
      },
      {
          key: 'buyRate',
          dataIndex: 'buyRate',
          title: 'Buy Rate',
          render: (text)=> formatCurrency(text)
      },
  ]
  
  useEffect(() => {
      getData()
  }, [])

  const getData = (queryParam, tagsValues) =>{
    getWorkforceSkills(queryParam).then(res=>{
        if (res.success){
            setData(res.data)
            setVisible(false)
            if(queryParam){
              setTags({...tagsValues})
            }
        }
    })
  }
  
  const tableTitle = () => {
    return (
      <Row justify="space-between">
        <Col>
          <Title level={5}>Workforce Skill </Title>
        </Col>
        <Col>
          <Button size="small" onClick={() => setVisible(true)}>
            Filters
          </Button>
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
                  pagination={{
                      hideOnSinglePage: false,
                      onChange:(pNo, pSize)=> {
                          setPage({pNo, pSize})
                      }
                  }}
                  dataSource={data}
              />
          </Col>
          <ReportsFilters
              compName={'Workforce Skill Filters'}
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