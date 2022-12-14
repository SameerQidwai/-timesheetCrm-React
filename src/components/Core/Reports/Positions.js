import React, { useState, useEffect } from 'react'
import { Button, Col, Row, Typography, Table as Atable } from 'antd'
import Table, { FiltertagsNew } from '../Table/TableFilter'
import { formatCurrency, formatDate, formatFloat, localStore } from '../../../service/constant'
import ReportsFilters, { _createQuery } from './ReportsFilters'
import { getPositions } from '../../../service/reports-Apis'

const {Title, Text} = Typography


function Positions() {
    const [data, setData] = useState([])
    const [visible, setVisible] = useState(false)
    const [page, setPage] = useState({pNo:1, pSize: localStore().pageSize})
    const [tags, setTags] = useState(null)

    const columns = [
      {
        key: 'workType',
        dataIndex: 'workType',
        fixed: true,
        title: 'Opportunity/Project',
        width: 100,
        render: (text, record, index) =>
          _nextCellRender(text, index, 'title', record),
      },
      {
        key: 'title',
        dataIndex: 'title',
        fixed: true,
        title: 'Title',
        width: 200,
        render: (text, record, index) => _nextCellRender(text, index, 'title'),
      },
      {
        key: 'organization',
        dataIndex: 'organization',
        fixed: true,
        title: 'Organisation Name',
        width: 200,
        render: (text, record, index) =>
          _nextCellRender(text, index, 'title', record),
      },
      {
        key: 'milestone',
        dataIndex: 'milestone',
        fixed: true,
        title: 'Milestone',
        width: 100,
        render: (text, record, index) =>
          _nextCellRender(text, index, 'title', record),
      },
      {
        key: 'position',
        dataIndex: 'position',
        title: 'Position Title',
      },
      {
        key: 'skill',
        dataIndex: 'skill',
        title: 'Skill',
      },
      {
        key: 'skillLevel',
        dataIndex: 'skillLevel',
        title: 'Skill Level',
      },
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
      {
        key: 'booking',
        dataIndex: 'booking',
        title: 'Booking Type',
      },
      {
        key: 'buyRate',
        dataIndex: 'buyRate',
        title: 'Buy Rate',
        render: (text) => formatCurrency(text),
      },
      {
        key: 'sellRate',
        dataIndex: 'sellRate',
        title: 'Sell Rate',
        render: (text) => formatCurrency(text),
      },
      {
        key: 'CMPercent',
        dataIndex: 'CMPercent',
        title: 'CM%',
        render: (_, record) =>
          `${formatFloat(
            record.sellRate
              ? ((record.sellRate - record.buyRate) / record.sellRate) * 100
              : 0
          )} %`,
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
    ];

    useEffect(() => {
        getData()
    }, [])

    const getData = (queryParam, tagsValues) =>{
        getPositions(queryParam).then(res=>{
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
    const _nextCellRender = (text, index, key, record)=>{
        let { pNo, pSize } = page
        let dataSourceIndex = ((pNo - 1) * pSize + index)
        return ((record?.[key] ?? text) === data?.[dataSourceIndex-1 ]?.[key] && index) ? '' : text
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
                compName={'Position Allocations Resources Filters'}
                compKey={'positions'}
                tags={tags}
                visible={visible}
                getCompData={getData}
                invisible={()=>setVisible(false)}
            />
        </Row>
    )
}

export default Positions

