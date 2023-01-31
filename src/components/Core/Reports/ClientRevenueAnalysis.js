import React, { useState, useEffect } from 'react'
import { Button, Col, Row, Typography, Table as ATable } from 'antd'
import Table, { FiltertagsNew, tableSorter } from '../Table/TableFilter'
import { formatCurrency, formatFloat, localStore } from '../../../service/constant'
import { ReportsFilters, _createQuery } from './Filters'

import { getClientRevenueAnalysis } from '../../../service/reports-Apis'
import { _generateMonthlyColumns } from '.'

const contantColmuns = [
  {
    key: 'organizationName',
    dataIndex: 'organizationName',
    fixed: true,
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
  // { // will need when doing financial year iplementation
  //   key: 'totalSell',
  //   dataIndex: 'totalSell',
  //   title: 'Total Completed Revenue',
  //   width: '5%',
  //   render: (value)=> (formatCurrency(value??0)),
  //   ...tableSorter('totalSell', 'number'),
  // },
  {
    key: 'YTDTotalSell',
    dataIndex: 'YTDTotalSell',
    title: 'YTD Actual Revenue',
    width: '5%',
    render: (value)=> (formatCurrency(value??0)),
    ...tableSorter('YTDTotalSell', 'number'),
  },
  {
    key: 'empty',
    dataIndex: 'empty',
    width: '1%'
  },
  // // will need when doing financial year iplementation{
  //   key: 'projectsValue',
  //   dataIndex: 'projectsValue',
  //   title: 'Total Contract Value',
  //   width: '5%',
  //   render: (value)=> (formatCurrency(value??0)),
  //   ...tableSorter('projectsValue', 'number'),
  // },
  // { // will need when doing financial year iplementation
  //   key: 'residualedRevenue',
  //   dataIndex: 'residualedRevenue',
  //   title: 'Residual Contract Value',
  //   width: '5%',
  //   render: (_, record)=> formatCurrency(parseFloat(record.projectsValue??0) - parseFloat(record.totalSell??0)),
  //   // ...tableSorter('residualedRevenue', 'number'),
  // },
]

function ClientRevenueAnalysis() {
  const [data, setData] = useState([])
  const [columns, setColumn] = useState([])
  const [visible, setVisible] = useState(false)
  const [tags, setTags] = useState(null)
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    _generateMonthlyColumns({
      contantColmuns,
      setColumn,
      spliceBtw: 4,
      // colRender: 'monthTotalSell',
      format: 'currency'
    });
    getData()
  }, [])

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
          <Typography.Title level={5}>FY Client Revenue Analysis</Typography.Title>
        </Col>
        <Col>
            <Row justify="end">
                <Col >
                    <Button size="small" onClick={()=>console.log('press')}>Download CSV</Button>
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
  
  const summaryFooter = (data) =>{
    let excludeColumns = ['organizationName', 'organizationId', 'empty']
    if(data.length>0)
    return (
      <ATable.Summary fixed="bottom">
        <ATable.Summary.Row>
          {columns.map(({ key }, kIndex) => {
            let value = 0;
            let columnFound = false;
            if (!excludeColumns.includes(key)) {
              columnFound = true;
              data.forEach((rowData, index) => {
                //calculation for total hours and actual hours for footer to show
                if(key === 'residualedRevenue'){
                  value += ((rowData['projectsValue'] - rowData['totalSell'])??0);
                }else{
                  value += (rowData[key]??0);
                }
              });
            }
            //Title of the projct show column for title
            return key === 'organizationId' ? (
              <ATable.Summary.Cell
                index={key + 1}
                key={key + 1}
                style={{ fontWeight: 600 }}
              >
                <Typography.Text strong>Total</Typography.Text> 
              </ATable.Summary.Cell>
            ) : columnFound ? ( // show total and normal background if the column month is same as selected month or the key is totalHours of the month
              <ATable.Summary.Cell
                index={key + 1}
                key={key + 1}
                align="center"
                style={{ fontWeight: 600 }}
              >
                <Typography.Text strong>{formatFloat(value)}</Typography.Text>
              </ATable.Summary.Cell>
            ) : (
              <ATable.Summary.Cell index={key + 1} key={key + 1}></ATable.Summary.Cell>
            );
          })}
        </ATable.Summary.Row>
      </ATable.Summary>
    );
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
          pagination={false}
          scroll={{ x:  '170vw' }}
          summary={ columnData => summaryFooter(columnData)}
        />
      </Col>
      <ReportsFilters
          compName={'Filters'}
          compKey={'clientRevenue'}
          tags={tags}
          visible={visible}
          getCompData={getData}
          invisible={()=>setVisible(false)}
      />
    </Row>
  );
}

export default ClientRevenueAnalysis