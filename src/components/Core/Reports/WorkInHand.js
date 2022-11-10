import { Col, Row, Table, Typography } from 'antd'
import React, { useState, useEffect } from 'react'
import { formatCurrency, parseDate } from '../../../service/constant';
import "../../Styles/table.css"
import { income_revenue } from './WIHData';
const {Title} = Typography

const column = [
    {
        title: '1LM - Whole A$',
        dataIndex: 'name',
        key: 'name',
        width: 250,
        onHeaderCell: ()=> {
            return {
                className: 'whole'
            }
        },
        onCell: ({className})=>{
            return {
                className: className
            }
        },
        // align: 'center',
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


  

function WorkInHand() {
    const [columns, setColumns] = useState(column)
    const [dataSource, setDataSource] = useState([])
    
    useEffect(() => {
        creatingCol()
        dummyStructureData()
    }, [])

    const creatingCol = () =>{
        let newColumns = [...columns]
        let monthColumns = []
        let endDate = '06/30/2021'
        for (var iDate = parseDate('07/01/2020'); iDate.isSameOrBefore(endDate); iDate.add(1, 'months')) {
            let el = {
              year: parseDate(iDate, 'MMM-YY'),
              era: iDate.isSameOrBefore(parseDate('09/01/2020'), 'month') ? 'Actual': 'Forecast',
            };
            monthColumns.push(monthCol(el))
        }
        monthColumns.push(monthCol({year: 'FY21', era: 'Forcaste'}))
        newColumns[1]['children'][0]['children'] = monthColumns
        setColumns(newColumns)
        console.log(monthColumns)
    }

    const dummyStructureData = () => {
        let totalIncome =  { className: 'total-row', name: 'TOTAL REVENUE', 'Jul-20': 0, 'Aug-20': 0, 'Sep-20': 0, 'Oct-20': 0, 'Nov-20': 0, 'Dec-20': 0, 'Jan-21': 0, 'Feb-21': 0, 'Mar-21': 0, 'Apr-21': 0, 'May-21': 0, 'Jun-21': 0, }
        income_revenue.forEach(el=>{
            for (var iDate = parseDate('07/01/2020'); iDate.isSameOrBefore('06/30/2021'); iDate.add(1, 'months')) {
                let key = parseDate(iDate, 'MMM-YY')
                totalIncome[key] += (el[key] ?? 0)
            }
        })
        income_revenue.push(totalIncome)
        setDataSource(income_revenue)
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
                    rowKey={(row)=> row.name}
                    columns={columns}
                    rowClassName={(row)=> row.className}
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
            onCell: ()=> {
                return {className: year.startsWith('FY') ? 'fin-total': ''} 
            },
            render: (text,record) =>{
                if(year.startsWith('FY')){
                    let totalYear = 0
                    for (var iDate = parseDate('07/01/2020'); iDate.isSameOrBefore('06/30/2021'); iDate.add(1, 'months')) {
                        totalYear += record[parseDate(iDate, 'MMM-YY')] ?? 0
                    }
                    return totalYear ? formatCurrency(totalYear) : '-'
                }
                return text ? formatCurrency(text) : ''
            }
        }
    ],
})