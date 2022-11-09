import { Col, Row, Table, Typography } from 'antd'
import React, { useState, useEffect } from 'react'
import { parseDate } from '../../../service/constant';
const {Title} = Typography
const column = [
    {
        title: '1LM - Whole A$',
        dataIndex: 'name',
        key: 'name',
        width: 250,
        align: 'center',
        fixed: 'left',
    },
    {
        title: 'FY21 Forecast',
        children: [
            {
                title: 'Revenue AU$',
                children: []
            }
        ]
    }
]

const colData = [
    { year: 'Jul-20', key: 'Jul-20', era: 'Actual' },
    { year: 'Aug-20', key: 'Aug-20', era: 'Actual' },
    { year: 'Sep-20', key: 'Sep-20', era: 'Actual' },
    { year: 'Oct-20', key: 'Oct-20', era: 'Forecast' },
    { year: 'Nov-20', key: 'Nov-20', era: 'Forecast' },
    { year: 'Dec-20', key: 'Dec-20', era: 'Forecast' },
    { year: 'Jan-21', key: 'Jan-21', era: 'Forecast' },
    { year: 'Feb-21', key: 'Feb-21', era: 'Forecast' },
    { year: 'Mar-21', key: 'Mar-21', era: 'Forecast' },
    { year: 'Apr-21', key: 'Apr-21', era: 'Forecast' },
    { year: 'May-21', key: 'May-21', era: 'Forecast' },
    { year: 'Jun-21', key: 'Jun-21', era: 'Forecast' },
    { year: 'FY21', key: 'FY21', era: 'Forecast' },
];
  

function WorkInHand() {
    const [columns, setColumns] = useState(column)
    const [dataSource, setDataSource] = useState([...colData,...colData, ...colData,...colData])
    
    useEffect(() => {
        creatingCol()
    }, [])

    const creatingCol = () =>{
        let newColumns = [...columns]
        let monthColumns = []
        let endDate = '06/30/2022'
        for (var iDate = parseDate('07/01/2021'); iDate.isSameOrBefore(endDate); iDate.add(1, 'months')) {
            let el = {
              year: parseDate(iDate, 'MMM-YY'),
              era: iDate.isBefore(parseDate(new Date()), 'month') ? 'Actual': 'Forecast',
            };
            monthColumns.push(monthCol(el))
        }
        newColumns[1]['children'][0]['children'] = monthColumns
        setColumns(newColumns)
    }

    
  return (
    <>
        <Row style={{backgroundColor: '#0463AC'}}>
            <Col span={24}>
                <Title level={5} style={{color: '#fff', marginBottom: 0, paddingLeft: 5 }}> 1LM Forecast FY21 - September Month End</Title>
            </Col>
            <Col span={24}>
                <Title level={5} style={{color: '#fff', marginBottom: 0, paddingLeft: 5 }}>Profit & Loss Statement - 30 September 2020</Title>
            </Col>
        </Row>
        <Row>
            <Col span={24}>
                <Table
                    bordered
                    size="small"
                    pagination = {false}
                    columns={columns}
                    dataSource={dataSource}
                    className="scroll-table fs-v-small full-width wih-report"
                    scroll={{
                        // x: "calc(700px + 100%)",
                        x: "max-content",
                        y: '60vh',
                    }}
                />
            </Col>
        </Row>
    </>
  )
}

export default WorkInHand

// -------------Helper-------
const monthCol = ({year, era, key})=>({
    title: year,
    align: 'center',
    children: [
        {
            title: era,
            dataIndex: year,
            key: year,
            width: 100,
            align: 'center',
        }
    ],
})