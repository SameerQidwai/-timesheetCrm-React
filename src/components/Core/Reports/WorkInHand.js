import { Col, InputNumber, Row, Table, Typography } from 'antd'
import React, { useState, useEffect } from 'react'
import { formatCurrency, getFiscalYear, parseDate } from '../../../service/constant';
import { getWorkInHandForecast } from '../../../service/reports-Apis';
import "../../Styles/table.css"
import { comunication_expenses, contribution_margin, cost_of_sale, direct_overhead_expense, income_revenue, occupancy_expenses, other_general_expenses, outside_expenses, supplies_expenses, travel_entertainment_expenses } from './WIHData';
import moment from 'moment'
const {Title} = Typography



function WorkInHand() {
    const fiscal = getFiscalYear('dates').end.format('[FY]YY')
    const forecastMonth = moment().subtract(1, 'month').endOf("month")

    const [dataSource, setDataSource] = useState([])
    const [columns, setColumns] = useState([
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
            title: `${fiscal} Forecast`,
            children: [
                {
                    title: 'Revenue AU$',
                    children: []
                }
            ]
        }
    ] )

    
    useEffect(() => {
        creatingCol()
        getWorkInHandForecast().then(res=>{
            if(res.success){
                structureData(res.data)
            }
        })
        // dummyStructureData()
    }, [])

    const creatingCol = () =>{
        let {start, end} = getFiscalYear('dates')
        let newColumns = [...columns]
        let monthColumns = []
        // let endDate = '06/30/2021'
        for (var iDate = parseDate(start); iDate.isSameOrBefore(end); iDate.add(1, 'months')) {
            let el = {
              year: parseDate(iDate, 'MMM YY'),
              era: iDate.isSameOrBefore(moment(), 'month') ? 'Actual': 'Forecast',
            };
            monthColumns.push(monthCol(el))
        }
        monthColumns.push(monthCol({year: fiscal, era: 'Forcaste'}))
        newColumns[1]['children'][0]['children'] = monthColumns
        setColumns(newColumns)
    }
    const structureData = ({
        MILESTONE_BASE,
        TIME_BASE,
        PERMANENT_SALARIES,
        PERMANENT_SUPER,
        CASUAL_SALARIES,
        CASUAL_SUPER,
        DOH_SALARIES,
        DOH_SUPER,
        TOTAL_REVENUE,
        TOTAL_COST,
        TOTAL_DOH
    }) => {
        // let totalIncome =  { className: 'total-row', name: 'TOTAL REVENUE', 'Jul 20': 0, 'Aug 20': 0, 'Sep 20': 0, 'Oct 20': 0, 'Nov 20': 0, 'Dec 20': 0, 'Jan 21': 0, 'Feb 21': 0, 'Mar 21': 0, 'Apr 21': 0, 'May 21': 0, 'Jun 21': 0, }
        // let totalCos =  { className: 'total-row', name: 'TOTAL COST OF SALES - COS', 'Jul 20': 0, 'Aug 20': 0, 'Sep 20': 0, 'Oct 20': 0, 'Nov 20': 0, 'Dec 20': 0, 'Jan 21': 0, 'Feb 21': 0, 'Mar 21': 0, 'Apr 21': 0, 'May 21': 0, 'Jun 21': 0, }
        // let cosMargin =  { className: 'total-row', name: 'CONTRIBUTION MARGIN', 'Jul 20': 0, 'Aug 20': 0, 'Sep 20': 0, 'Oct 20': 0, 'Nov 20': 0, 'Dec 20': 0, 'Jan 21': 0, 'Feb 21': 0, 'Mar 21': 0, 'Apr 21': 0, 'May 21': 0, 'Jun 21': 0, }
        // let totalDOHExpense =  { className: 'total-row', name: 'TOTAL PERSONNEL EXPENSES', 'Jul 20': 0, 'Aug 20': 0, 'Sep 20': 0, 'Oct 20': 0, 'Nov 20': 0, 'Dec 20': 0, 'Jan 21': 0, 'Feb 21': 0, 'Mar 21': 0, 'Apr 21': 0, 'May 21': 0, 'Jun 21': 0, }
        income_revenue[1] = { ...income_revenue[1], ...TIME_BASE };
        income_revenue[2] = { ...income_revenue[2], ...MILESTONE_BASE };
        income_revenue[8] = { ...income_revenue[8], ...TOTAL_REVENUE };

        cost_of_sale[2] = { ...cost_of_sale[2], ...PERMANENT_SALARIES };
        cost_of_sale[3] = { ...cost_of_sale[3], ...CASUAL_SALARIES };
        cost_of_sale[4] = { ...cost_of_sale[4], ...PERMANENT_SUPER };
        cost_of_sale[5] = { ...cost_of_sale[5], ...CASUAL_SUPER };
        cost_of_sale[5] = { ...cost_of_sale[5], ...CASUAL_SUPER };
        cost_of_sale[21] = { ...cost_of_sale[21], ...TOTAL_COST };
        contribution_margin[1] = {...contribution_margin[1], TOTAL_COST, TOTAL_REVENUE}
        contribution_margin[3] = {...contribution_margin[3], TOTAL_COST, TOTAL_REVENUE}


        direct_overhead_expense[3] = { ...direct_overhead_expense[3], ...DOH_SALARIES };
        direct_overhead_expense[4] = { ...direct_overhead_expense[4], ...DOH_SUPER };
        direct_overhead_expense[18] = { ...direct_overhead_expense[18], ...TOTAL_DOH };

        // income_revenue.push(totalIncome)
        // cost_of_sale.push(totalCos)
        // direct_overhead_expense.push(totalDOHExpense)

        setDataSource([
            ...income_revenue,
            ...cost_of_sale,
            ...contribution_margin,
            ...direct_overhead_expense,
            // ...occupancy_expenses,
            // ...supplies_expenses,
            // ...comunication_expenses,
            // ...outside_expenses,
            // ...travel_entertainment_expenses,
            // ...other_general_expenses,
        ]);

    };
    const dummyStructureData = () => {
        let totalIncome =  { className: 'total-row', name: 'TOTAL REVENUE', 'Jul-20': 0, 'Aug-20': 0, 'Sep-20': 0, 'Oct-20': 0, 'Nov-20': 0, 'Dec-20': 0, 'Jan-21': 0, 'Feb-21': 0, 'Mar-21': 0, 'Apr-21': 0, 'May-21': 0, 'Jun-21': 0, }
        let totalCos =  { className: 'total-row', name: 'TOTAL COST OF SALES - COS', 'Jul-20': 0, 'Aug-20': 0, 'Sep-20': 0, 'Oct-20': 0, 'Nov-20': 0, 'Dec-20': 0, 'Jan-21': 0, 'Feb-21': 0, 'Mar-21': 0, 'Apr-21': 0, 'May-21': 0, 'Jun-21': 0, }
        let totalDOHExpense =  { className: 'total-row', name: 'TOTAL PERSONNEL EXPENSES', 'Jul-20': 0, 'Aug-20': 0, 'Sep-20': 0, 'Oct-20': 0, 'Nov-20': 0, 'Dec-20': 0, 'Jan-21': 0, 'Feb-21': 0, 'Mar-21': 0, 'Apr-21': 0, 'May-21': 0, 'Jun-21': 0, }
        let cosMargin =  { className: 'total-row', name: 'CONTRIBUTION MARGIN', 'Jul-20': 0, 'Aug-20': 0, 'Sep-20': 0, 'Oct-20': 0, 'Nov-20': 0, 'Dec-20': 0, 'Jan-21': 0, 'Feb-21': 0, 'Mar-21': 0, 'Apr-21': 0, 'May-21': 0, 'Jun-21': 0, }
        let totalOccupancy =  { className: 'total-row', name: 'TOTAL OCCUPANCY EXPENSES', 'Jul-20': 0, 'Aug-20': 0, 'Sep-20': 0, 'Oct-20': 0, 'Nov-20': 0, 'Dec-20': 0, 'Jan-21': 0, 'Feb-21': 0, 'Mar-21': 0, 'Apr-21': 0, 'May-21': 0, 'Jun-21': 0, }
        let totalSupplies =  { className: 'total-row', name: 'TOTAL EQUIPMENT EXPENSES', 'Jul-20': 0, 'Aug-20': 0, 'Sep-20': 0, 'Oct-20': 0, 'Nov-20': 0, 'Dec-20': 0, 'Jan-21': 0, 'Feb-21': 0, 'Mar-21': 0, 'Apr-21': 0, 'May-21': 0, 'Jun-21': 0, }
        let totalCommunication =  { className: 'total-row', name: 'TOTAL COMMUNICATION EXPENSES', 'Jul-20': 0, 'Aug-20': 0, 'Sep-20': 0, 'Oct-20': 0, 'Nov-20': 0, 'Dec-20': 0, 'Jan-21': 0, 'Feb-21': 0, 'Mar-21': 0, 'Apr-21': 0, 'May-21': 0, 'Jun-21': 0, }
        let totalOutside =  { className: 'total-row', name: 'TOTAL OUTSIDE SERVICES EXPENSES', 'Jul-20': 0, 'Aug-20': 0, 'Sep-20': 0, 'Oct-20': 0, 'Nov-20': 0, 'Dec-20': 0, 'Jan-21': 0, 'Feb-21': 0, 'Mar-21': 0, 'Apr-21': 0, 'May-21': 0, 'Jun-21': 0, }
        let totalEntertainment =  { className: 'total-row', name: 'TOTAL TRAVEL & ENTERTAINMENT EXPENSES', 'Jul-20': 0, 'Aug-20': 0, 'Sep-20': 0, 'Oct-20': 0, 'Nov-20': 0, 'Dec-20': 0, 'Jan-21': 0, 'Feb-21': 0, 'Mar-21': 0, 'Apr-21': 0, 'May-21': 0, 'Jun-21': 0, }
        let totalGeneral =  { className: 'total-row', name: 'TOTAL OTHER GENERAL EXPENSES', 'Jul-20': 0, 'Aug-20': 0, 'Sep-20': 0, 'Oct-20': 0, 'Nov-20': 0, 'Dec-20': 0, 'Jan-21': 0, 'Feb-21': 0, 'Mar-21': 0, 'Apr-21': 0, 'May-21': 0, 'Jun-21': 0, }
        
        let max_length = Math.max(
            income_revenue.length,
            cost_of_sale.length,
            direct_overhead_expense.length,
            // occupancy_expenses.length,
            // supplies_expenses.length,
            // comunication_expenses.length,
            // outside_expenses.length,
            // travel_entertainment_expenses.length,
            // other_general_expenses.length
        );
       
        // for (let i = 0; i< max_length; i++){
        //     for (var iDate = parseDate('07/01/2020'); iDate.isSameOrBefore('06/30/2021'); iDate.add(1, 'months')) {
        //         let key = parseDate(iDate, 'MMM YY')
        //         totalIncome[key] += (income_revenue?.[i]?.[key] ?? 0)
        //         totalCos[key] += (cost_of_sale?.[i]?.[key] ?? 0)
        //         cosMargin[key] += ((income_revenue?.[i]?.[key]?? 0) - (cost_of_sale?.[i]?.[key] ?? 0))
        //         totalDOHExpense[key] += (direct_overhead_expense?.[i]?.[key] ?? 0)
        //         totalOccupancy[key] += (occupancy_expenses?.[i]?.[key] ?? 0)
        //         totalSupplies[key] += (supplies_expenses?.[i]?.[key] ?? 0)
        //         totalCommunication[key] += (comunication_expenses?.[i]?.[key] ?? 0)
        //         outside_expenses[key] += (outside_expenses?.[i]?.[key] ?? 0)
        //         totalEntertainment[key] += (travel_entertainment_expenses?.[i]?.[key] ?? 0)
        //         totalGeneral[key] += (other_general_expenses?.[i]?.[key] ?? 0)
        //     }
        // }

        income_revenue.push(totalIncome)
        cost_of_sale.push(totalCos)
        direct_overhead_expense.push(totalDOHExpense)
        // occupancy_expenses.push(totalOccupancy)
        // supplies_expenses.push(totalSupplies)
        // comunication_expenses.push(totalCommunication)
        // outside_expenses.push(totalOutside)
        // travel_entertainment_expenses.push(totalEntertainment)
        // other_general_expenses.push(totalGeneral)
        setDataSource([
            ...income_revenue,
            ...cost_of_sale,
            ...direct_overhead_expense,
            // ...occupancy_expenses,
            // ...supplies_expenses,
            // ...comunication_expenses,
            // ...outside_expenses,
            // ...travel_entertainment_expenses,
            // ...other_general_expenses,
        ]);
    }
    
  return (
    <>
        <Row style={{backgroundColor: '#0463AC'}}>
            <Col span={24}>
                <Title level={5} style={{color: '#fff', marginBottom: 0, paddingLeft: 5 }}> 1LM Forecast {fiscal} - {forecastMonth.format('MMMM')} Month End</Title>
            </Col>
            <Col span={24}>
                <Title level={5} style={{color: '#fff', marginBottom: 0, paddingLeft: 5 }}>Profit & Loss Statement - {forecastMonth.format('DD MMMM YYYY')}</Title>
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
                        y: '65vh',
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
                if(record.render){
                    return record.render(year, record)
                }
                if(year.startsWith('FY')){
                    // let totalYear = 0
                    // for (var iDate = parseDate('07/01/2020'); iDate.isSameOrBefore('06/30/2021'); iDate.add(1, 'months')) {
                    //     totalYear += record[parseDate(iDate, 'MMM YY')] ?? 0
                    // }
                    return record.total ? formatCurrency(record.total) : '-'
                }
                if (record.openField){
                    return <InputNumber size="small" placeholder='0.000'/>
                }
                return text ? formatCurrency(text) : record.className === 'total-row'? '-' : ''
            }
        }
    ],
})