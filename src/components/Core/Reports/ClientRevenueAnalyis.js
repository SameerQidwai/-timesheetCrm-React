import React, { useState, useEffect } from 'react'
import { Button, Col, Row, Typography } from 'antd'
import Table, { FiltertagsNew, tableSorter } from '../Table/TableFilter'
import { getClientRevenueAnalysis } from '../../../service/reports-Apis'


import { formatCurrency, formatFloat, getFiscalYear, localStore, parseDate } from '../../../service/constant'
import { ReportsFilters, _createQuery } from './Filters'

const contantColmuns = [
  {
    key: 'organizationName',
    dataIndex: 'organizationName',
    title: 'Organisation',
    width: '10%',
    ...tableSorter('organizationName', 'string'),
  },
  {
    key: 'organizationId',
    dataIndex: 'organizationId',
    title: 'Organisation Code',
    align: 'center',
    width: '4%',
    render: (text)=> (`00${text}`), 
    ...tableSorter('organizationId', 'number'),
  },
  {
    key: 'totalSell',
    dataIndex: 'totalSell',
    title: 'Total Completed Revenue',
    width: '5%',
    render: (value)=> (formatCurrency(value??0)),
    ...tableSorter('yieldedRevenue', 'number'),
  },
  {
    key: 'YTDTotalSell',
    dataIndex: 'YTDTotalSell',
    title: 'YTD Completed Work',
    width: '5%',
    render: (value)=> (formatCurrency(value??0)),
    ...tableSorter('YTDTotalSell', 'number'),
  },
  {
    key: 'empty',
    dataIndex: 'empty',
    width: '1%'
  },
  {
    key: 'projectsValue',
    dataIndex: 'projectsValue',
    title: 'Total Contract Value',
    width: '4%',
    render: (value)=> (formatCurrency(value??0)),
    ...tableSorter('projectsValue', 'number'),
  },
  {
    key: 'residualedRevenue',
    dataIndex: 'residualedRevenue',
    title: 'Residual Contract Value',
    width: '4%',
    render: (_, record)=> formatCurrency(parseFloat(record.projectsValue??0) - parseFloat(record.totalSell??0)),
    ...tableSorter('residualedRevenue', 'number'),
  },
]

function ClientRevenueAnalyis() {
  const [data, setData] = useState([])
  const [columns, setColumn] = useState([])
  const [visible, setVisible] = useState(false)
  const [page, setPage] = useState({pNo:1, pSize: localStore().pageSize})
  const [tags, setTags] = useState(null)
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    generateColumns()
    getData()
  }, [])

  const generateColumns = (date)=>{
    let {start, end} = getFiscalYear('dates',date)
    let monthlyColumn = []
    for (
      var iMonth = parseDate(start) ; // defination
      iMonth.isSameOrBefore(parseDate(end));  //condition
      iMonth.add(1, 'months') //itrerater
      ){
        let key = parseDate(iMonth, 'MMM YY')
        monthlyColumn.push({
          key: key,
          dataIndex: key,
          title: key,
          align: 'center',
          width: '4%',
          render: (value)=> (formatCurrency(value?.monthTotalSell??0))
          // ...tableSorter('projectValue', 'number'),
        })
      }
      let creatingColumn = contantColmuns
      creatingColumn.splice(4, 0 , ...monthlyColumn);
      setColumn([...creatingColumn])
  }

  const getData = (queryParam, tagsValues) =>{
    setLoading(true)
    getClientRevenueAnalysis(queryParam).then(res=>{
      if (res.success){
        // console.log(res.data)
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
          <Typography.Title level={5}>Client Revenue Analysis</Typography.Title>
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
          sticky
          title={() => tableTitle()}
          columns={columns}
          loading={loading}
          rowKey={'organizationId'}
          dataSource={data}
          pagination={{
            hideOnSinglePage: false,
            showPageSizeChanger: true,
            onChange:(pNo, pSize)=> {
                setPage({pNo, pSize})
            }
          }}
          scroll={{
            // x:  'max-content'
            x:  '170vw'
          }}
        />
      </Col>
      <ReportsFilters
          compName={'Client Revenue Analysis Filters'}
          compKey={'clientRevenue'}
          tags={tags}
          visible={visible}
          getCompData={getData}
          invisible={()=>setVisible(false)}
      />
    </Row>
  );
}

export default ClientRevenueAnalyis