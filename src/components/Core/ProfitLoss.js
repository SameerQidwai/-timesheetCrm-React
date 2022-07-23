import React, { Component } from "react";
import { Row, Col, Table, Typography } from "antd";
import { getRecord } from "../../service/opportunities";
import { formatCurrency, formatDate, formatFloat, getFiscalYear } from "../../service/constant";
import moment from 'moment'
import 'moment-weekday-calc';
import { getProfitLoss } from "../../service/projects";
const { Title, Text } = Typography

class ProfitLoss extends Component {
    constructor(props){
        super(props)
        this.state={
            billing: {},
            columns: [],
            fiscalYear: getFiscalYear('dates'),
            data:[
                {key: 'W', label: 'Working Days', total: 0},
                {key: 'R', label: 'Revenue \n (discounted value)', total: 0},
                {key: 'C', label: 'Cost of sale/services', total: 0 },
                {key: '$', label: 'CM $', total: 0 },
                {key: '%', label: 'CM %', total: 0 },
            ]
        }
    }
    componentDidMount = () =>{
        const {parent, id} = this.props
        const {fiscalYear} = this.state
        if (parent === 'P'){
            getProfitLoss(id, fiscalYear).then(res=>{
                if(res.success){
                    const {actualStatement, actualTotal, forecast} = res.data
                    this.calculateProjectData(actualStatement, actualTotal, forecast ?? [])
                }
            })
        }else{
            this.calculateData()
        }
    }

    getWeekdays = (startDate, endDate) =>{
        return formatDate(new Date ()).isoWeekdayCalc({  
            rangeStart: startDate,
            rangeEnd: endDate,
            weekdays: [1,2,3,4,5],  
            // exclusions: holidays,
            //when I get holidays
        }) 
    }

    calculateProjectData = (actualStatement, actualTotal, forecast) =>{
        let { data, fiscalYear } = this.state
        const { billing, type: proType } = this.props
        let startDate = formatDate(billing.startDate)
        let endDate = formatDate(billing.endDate)
        let noOfDays = 0
        let actualDays = 0
        let fiscalDays = 0
        let fiscalActualDays = 0
        let revenuePerDay = 0
        let totalRevenue = 0
        let forecastStatement = {}
        let forecastTotal = {sellTotal: 0, buyTotal: 0}
        let tempEndDate = formatDate(new Date()).add(100, 'years')
        let forecastStartDate = startDate.isBefore(fiscalYear['start'], 'day') ? fiscalYear['start'] : startDate
        let forecastEndDate = endDate.isBefore(fiscalYear['end'], 'day') ? fiscalYear['end'] : endDate
        
        //Testing
       

        for (var iDate = formatDate(startDate); iDate.isSameOrBefore(endDate); iDate.add(1, 'days')) {
            if (iDate.isoWeekday() !== 6 && iDate.isoWeekday() !== 7){
                let key = formatDate(iDate).format('MMM YY')

                if (iDate.isBefore(moment(), 'month')){ //checking if the date belongs to past month
                    actualDays ++ // Number of ACTUAL working days
                }
                
                if ( iDate.isSameOrAfter(forecastStartDate, 'day') && // finding Fiscal Months
                    iDate.isSameOrBefore(forecastEndDate), 'day' ) {
                    if (iDate.isSameOrAfter(moment(), 'month')){ 
                        //FORCASTING Future predictions
                        
                        forecast.forEach((el, index) =>{
                          
                            if ( iDate.isBetween(formatDate(el.con_startDate), formatDate(el.con_endDate) ??  tempEndDate, 'day', '[]') &&
                            iDate.isBetween(formatDate(el.res_startDate), formatDate(el.res_endDate)??  tempEndDate , 'day', '[]') ){
                                if (forecastStatement[key]){
                                    forecastStatement[key].monthTotalBuy += el.forecastBuyRateDaily
                                    forecastStatement[key].monthTotalSell += el.forecastSellRateDaily

                                }else{
                                    forecastStatement[key] = {
                                        month: key, 
                                        monthTotalBuy: el.forecastBuyRateDaily, 
                                        monthTotalSell: el.forecastSellRateDaily, 
                                    }
                                }
                                forecastTotal['buyTotal'] += el.forecastBuyRateDaily
                                forecastTotal['sellTotal'] += el.forecastSellRateDaily
                                
                            }
                        })
                    }

                    fiscalDays ++ // number of working days in fiscal year 

                    // Number of working days in a Fiscal year month
                    if (data[0][key]){
                        data[0][key] ++
                    }else{
                        data[0][key] = 1
                    }
                }
                
                noOfDays ++ //Number of working days in a project
                
            }
        }
        //if project is Time base past Buy will be subtract and will divide same amoung remaining days
        if (proType ===2){
            totalRevenue = (billing.value - (actualTotal['sellTotal']??0))
        }else{ 
            revenuePerDay = (billing.value/noOfDays)
        }

        //for total column
        data[0]['total'] = fiscalDays 
        data[1]['total'] = actualTotal['sellTotal'] + forecastTotal['sellTotal']  //SELL TOTAL WITH IN A FISCAL YEAR
        data[2]['total'] = actualTotal['buyTotal'] + forecastTotal['buyTotal'] //BUY TOTAL WITH IN A FISCAL YEAR
        data[3]['total'] = data[1]['total'] - data[2]['total'] //CM
        data[4]['total'] = (( data[1]['total'] - data[2]['total'] ) / data[1]['total']) * 100 //CM%

        for (var iMonth = formatDate(fiscalYear['start']); iMonth.isSameOrBefore(fiscalYear['end']); iMonth.add(1, 'months')) {
            let key = formatDate(iMonth).format('MMM YY')
            let workDays = data[0][key]
            let value = 0
            let cos = 0

            if (proType === 2){
                let forecastRevenue = (totalRevenue - forecastStatement[key]?.['monthTotalSell']) < 0 ? totalRevenue :  forecastStatement[key]?.['monthTotalSell']
                value = actualStatement[key]?.['monthTotalSell'] ?? forecastRevenue
                totalRevenue -= value // subtract this month revenuePerDay form revmonth

            }else{
                value = (revenuePerDay * workDays)
            }

            if (!actualStatement[key] && forecastStatement[key]?.['monthTotalSell']> value){
                let sellpercent = (value / forecastStatement[key]?.['monthTotalSell']) * 100
                cos = (forecastStatement[key]?.['monthTotalBuy'] /100 )* sellpercent
            }else{
                
                cos = actualStatement[key]?.['monthTotalBuy'] ?? forecastStatement[key]?.['monthTotalBuy']
            }
                
            let cm = value - cos
            
            data[1][key] = value  //revune
            data[2][key] = value ? cos : 0 //cos 
            data[3][key] = value ? cm: 0 //cm
            data[4][key] = value ? ((cm / value )*100): 0//cm percentage
// #a0df7d
        }
        //takeing avg of total cm%
        
        this.setState({data},()=>{
            this.Columns()

        })
    }

    calculateData = () =>{
        let { data, fiscalYear } = this.state
        const { billing } = this.props
        const len = billing.totalMonths>0 ? billing.totalMonths : 0
        let startDate = formatDate(billing.startDate)
        let endDate = formatDate(billing.endDate)
        let noOfDays = 0
        
        for (var i =1; i<=len; i++){

            startDate = i===1 ? billing.startDate : formatDate(startDate).set('date', 1); 
            endDate = i===len ? billing.endDate: formatDate(startDate).endOf('month');
            const workDays = this.getWeekdays(startDate, endDate)
            noOfDays = noOfDays + workDays
            let key = formatDate(startDate).format('MMM YY')
            data[0][key]= workDays
            startDate = formatDate(startDate).add(1, 'months')
        }
        let revenue = (billing.discount / noOfDays)
        let cm = (revenue * billing.cmPercentage /100 )
        let cos = (revenue - cm)

        for (var i =1; i<= len; i++){
            startDate = i===1 ? billing.startDate  : formatDate(startDate).set('date', 1); 
            endDate = i===len ? billing.endDate: formatDate(startDate).endOf('month');
            // let workDays = this.getWeekdays(startDate, endDate)
            let key = formatDate(startDate).format('MMM YY')
            let workDays = data[0][key]
            data[1][key] = revenue * workDays
            data[2][key] = cos * workDays
            data[3][key] = cm * workDays
            data[4][key] = billing.cmPercentage
            
            //Total of every row with in financial year... 
            if (startDate.isBetween(formatDate(fiscalYear['start']), formatDate(fiscalYear['end']), 'month', '[]')){
                data[0]['total'] += data[0][key] // this is wrong I know
                data[1]['total'] += revenue * workDays
                data[2]['total'] += cos * workDays
                data[3]['total'] += cm * workDays
                data[4]['total'] += (billing.cmPercentage ?? 0)
            }
            // Total of every row with in financial year... 

            startDate = formatDate(startDate).add(1, 'months')
        }
        this.setState({data},()=>{
            this.Columns()

        })
    }

    Columns = () =>{
        
        const { billing } = this.props
        const { fiscalYear } = this.state
        // const len = billing.totalMonths>0 ? billing.totalMonths : 0
        const len = 16
        let array = []
        for (
                var month = formatDate(fiscalYear['start']) ; // defination
                month.isSameOrBefore(formatDate(fiscalYear['end']));  //condition
                month.add(1, 'months') //itrerater
            ){
            array.push(
                {
                    title: formatDate(month).format('MMM YY'),
                    // width:100,
                    align: 'center',
                    dataIndex: formatDate(month).format('MMM YY'),
                    key: formatDate(month).format('MMM YY'),
                    render: (record, records) =>{
                        if (record){
                            if (records.key === 'W') {
                                return <b>{record} </b>
                            }else if (records.key === 'R') {
                                return ` ${formatCurrency(formatFloat(record))}`
                            }else if (records.key === 'C'){
                                return ` ${formatCurrency(formatFloat(record))}`
                            }else if (records.key === '$'){
                                return <b>{` ${formatCurrency(formatFloat(record))}`}</b>
                            }else if (records.key === '%'){
                                return <b>{` ${formatFloat(record)} %`}</b>
                            }
                        }
                        return '-'
                    }
                },
            )
            
        }
        this.setState({
            columns: [
            {
                title: 'Month',
                // width: ,
                dataIndex: 'label',
                key: 'label',
                render: (text, record) =>{
                    if (record.key === 'R' || record.key === 'C') {
                        return text
                    }else if (record.key === '$' || record.key === '%' || record.key === 'W'){
                        return <b>{text}</b>
                    }
                }
            },
            {
                title: 'Total',
                dataIndex: 'total',
                key: 'total',
                render:(text, record)=>{
                    if (text){
                        if (record.key === 'W') {
                            return <b>{text} </b>
                        }else if (record.key === 'R') {
                            return ` ${formatCurrency(formatFloat(text))}`
                        }else if (record.key === 'C'){
                            return ` ${formatCurrency(formatFloat(text))}`
                        }else if (record.key === '$'){
                            return <b>{` ${formatCurrency(formatFloat(text))}`}</b>
                        }else if (record.key === '%'){
                            return <b>{` ${formatFloat(text)} %`}</b>
                        }
                    }
                    return '-'
                }
            }, 
                ...array
            ],
        })
    }

    render(){
        const { data, columns } = this.state
        const { billing } = this.props
        return (
            <Row justify="center">
                {/* <Col span={4}>
                    <Title level={5} >Rev - Discount Value</Title>
                </Col>
                <Col span={5}>
                    <Text>{formatCurrency(billing.discount)} / {billing.totalMonths} Months  = {formatCurrency((billing.discount / billing.totalMonths).toFixed(2))}</Text>
                </Col>
                <Col span={24}>
                    <Row >
                        <Col span={10}>
                            <Title level={3}>Projected Profit & Loss </Title>
                        </Col>
                        <Col span={2}>
                            <Title level={5}>CM %</Title>
                        </Col>
                        <Col span={2}>
                            <Text>{billing.cmPercentage} %</Text>
                        </Col>
                    </Row>
                </Col> */}
                <Table
                    bordered
                    rowKey= {(data =>data.label)}
                    columns={columns}
                    dataSource={data}
                    size="small"
                    pagination = {false}
                    className="timeSheet-table fs-small full-width"
                />
            </Row>
        )
    }
}

export default ProfitLoss
