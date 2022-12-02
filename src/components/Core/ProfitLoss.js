import React, { Component } from "react";
import { Col, Row, Table, Tag, Typography } from "antd";
import { formatCurrency, formatDate, formatFloat, getFiscalYear } from "../../service/constant";
import 'moment-weekday-calc';
import { getProfitLoss } from "../../service/projects";
import { getHolidays } from "../../service/opportunities";

import moment from 'moment';


const parseDate = (date, string, format)=>{
    if (date){
        if (string){
            return moment.parseZone(date).format(format === true ? 'ddd DD MMM yyyy' : format)
        }
        return moment.parseZone(date)
    }
  }


class ProfitLoss extends Component {
    constructor(props){
        super(props)
        this.state={
            billing: {},
            columns: [],
            fiscalYear: getFiscalYear('dates'),
            data:[
                {key: 'W', label: 'Working Days', total: 0},
                {key: 'R', label: `Revenue \n ${props['parent'] === 'O'? '(discounted value)' : ''}`, total: 0},
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
                    const {actualStatement, actualTotal, forecast, holidays, segmentsRevenue} = res.data
                    this.calculateProjectData(actualStatement, actualTotal, forecast ?? [], segmentsRevenue,  holidays)
                }
            })
        }else{
            getHolidays().then(res=>{
                if(res.success){
                    const { holidays } = res.data
                    this.calculateLeadData(holidays)
                }
            })
        }
    }

    getWeekdays = (startDate, endDate, holidays) =>{
        return formatDate(new Date ()).isoWeekdayCalc({  
            rangeStart: startDate,
            rangeEnd: endDate,
            weekdays: [1,2,3,4,5],  
            exclusions: holidays,
            //when I get holidays
        }) 
    }

    calculateProjectData = (actualStatement, actualTotal, forecast, segmentsRevenue, holidays) =>{
        let { data, fiscalYear } = this.state
        const { billing, type: proType } = this.props
        let startDate = parseDate(billing.startDate)
        let endDate = parseDate(billing.endDate)
        let noOfDays = 0
        let revenuePerDay = 0
        let totalRevenue = 0
        let forecastStatement = {}
        let forecastTotal = {sellTotal: 0, buyTotal: 0}
        let tempEndDate = parseDate(new Date()).add(100, 'years')
        let forecastStartDate = startDate.isBefore(fiscalYear['start'], 'day') ? fiscalYear['start'] : startDate
        let forecastEndDate = endDate.isAfter(fiscalYear['end'], 'day') ? fiscalYear['end'] : endDate
        //Testing

       
        for (var iDate = parseDate(startDate); iDate.isSameOrBefore(endDate); iDate.add(1, 'days')) {
            if (iDate.isoWeekday() !== 6 && iDate.isoWeekday() !== 7 && !holidays[parseDate(iDate, true, 'M/D/YYYY')]){
                if (holidays[parseDate(iDate, true, 'M/D/YYYY')]){
                    console.log (parseDate(iDate, true, 'M/D/YYYY'))
                }
                let key = parseDate(iDate, true, 'MMM YY')
                if ( iDate.isSameOrAfter(forecastStartDate, 'day') && // finding Fiscal Months
                iDate.isSameOrBefore(forecastEndDate), 'day' ) {
                    if (iDate.isSameOrAfter(parseDate(new Date()), 'month')){ 
                        //FORCASTING Future predictions
                        
                        forecast.forEach((el, index) =>{
                            if ( iDate.isBetween(parseDate(el.con_startDate), parseDate(el.con_endDate ?? tempEndDate) , 'day', '[]') &&
                            iDate.isBetween(parseDate(el.res_startDate), parseDate(el.con_endDate ?? tempEndDate) , 'day', '[]') ){
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
        if (proType === 2){
            totalRevenue = (billing.value - (actualTotal['sellTotal']??0))
        }else if (proType === 1){ 

            revenuePerDay = (billing.value/noOfDays)
        }
        for (var iMonth = parseDate(fiscalYear['start']); iMonth.isSameOrBefore(fiscalYear['end']); iMonth.add(1, 'months')) {
            let key = parseDate(iMonth, true, 'MMM YY')
            let workDays = data[0][key]
            let revenueValue = 0
            let cos = 0
            
            if (proType === 2){ //For timebase Project
                if (actualStatement[key]){ //If actual is present 
                    revenueValue = actualStatement[key]?.['monthTotalSell'] ?? 0
                    //Not subtratcing actual month because it is already gets subtracted in totalRevnenue
                        //we are not doing it becuase all actual are being delete on assigning totalRevenue
                        cos = actualStatement[key]?.['monthTotalBuy'] ?? 0

                }else if (forecastStatement[key]){ //If forcast is found
                    revenueValue = (totalRevenue - forecastStatement[key]?.['monthTotalSell']) < 0 ? totalRevenue ?? 0 :  forecastStatement[key]?.['monthTotalSell'] ?? 0
                    totalRevenue -= revenueValue // subtract this month revenuePerDay form revmonth
                    
                    if (forecastStatement[key]?.['monthTotalSell'] > revenueValue){
                        // checking total Revenue to get cos %
                        let sellpercent = (revenueValue / forecastStatement[key]?.['monthTotalSell']) * 100
                        cos = (forecastStatement[key]?.['monthTotalBuy'] /100 )* sellpercent //to get percentage how much cos is needed to less amount sale
                    }else{
                        cos = forecastStatement[key]?.['monthTotalBuy'] ?? 0 // assigning forcasting Cost
                    }
                }

            }else if (proType === 1){ //For Project Base Project
                // revenueValue = isNaN(revenuePerDay * workDays) ? 0 : (revenuePerDay * workDays)
                revenueValue = parseFloat(segmentsRevenue[key]??0) 
                cos = actualStatement[key]?.['monthTotalBuy'] ?? forecastStatement[key]?.['monthTotalBuy'] ?? 0
            }
                //if revenue amount finish before project and fiscal year endDate

                
            let cm = revenueValue - cos
            data[1][key] = revenueValue   //revune
            data[2][key] = (revenueValue && cos) ? cos : 0 //cos 
            data[3][key] = (revenueValue && cos) ? cm: 0 //cm
            data[4][key] = (revenueValue && cos) ? ((cm / revenueValue )*100): 0//cm percentage
            
            //For Total Column 
            data[0]['total'] += data[0][key] ?? 0 //days
            data[1]['total'] += data[1][key] //SELL TOTAL WITH IN A FISCAL YEAR
            data[2]['total'] += data[2][key] //BUY TOTAL WITH IN A FISCAL YEAR
            data[3]['total'] += data[3][key] //CM

            // #a0df7d
        }
        //average Total cm %
        data[4]['total'] = (data[3]['total']  / data[1]['total']) * 100 //CM%
        //takeing avg of total cm%
        this.setState({data},()=>{
            this.Columns()

        })
    }

    calculateLeadData = (holidays) =>{
        let { data, fiscalYear } = this.state
        const { billing } = this.props
        const len = billing.totalMonths>0 ? billing.totalMonths : 0
        let startDate = parseDate(billing.startDate)
        let endDate = parseDate(billing.endDate)
        let noOfDays = 0
        
        for (var i =1; i<=len; i++){

            startDate = i===1 ? billing.startDate : parseDate(startDate).set('date', 1); 
            endDate = i===len ? billing.endDate: parseDate(startDate).endOf('month');
            const workDays = this.getWeekdays(startDate, endDate, holidays)
            noOfDays = noOfDays + workDays
            let key = parseDate(startDate, true, 'MMM YY')
            data[0][key]= workDays
            startDate = parseDate(startDate).add(1, 'months')
        }
        let revenue = (billing.discount / noOfDays)
        let cm = (revenue * billing.cmPercentage /100 )
        let cos = (revenue - cm)

        for (var i =1; i<= len; i++){
            startDate = i===1 ? billing.startDate  : parseDate(startDate).set('date', 1); 
            endDate = i===len ? billing.endDate: parseDate(startDate).endOf('month');
            // let workDays = this.getWeekdays(startDate, endDate)
            let key = parseDate(startDate, true, 'MMM YY')
            let workDays = data[0][key]
            data[1][key] = revenue * workDays
            data[2][key] = cos * workDays
            data[3][key] = cm * workDays
            data[4][key] = billing.cmPercentage
            
            //Total of every row with in financial year... 
            if (startDate.isBetween(parseDate(fiscalYear['start']), parseDate(fiscalYear['end']), 'month', '[]')){
                data[0]['total'] += workDays
                data[1]['total'] += revenue * workDays
                data[2]['total'] += cos * workDays
                data[3]['total'] += cm * workDays
                // data[4]['total'] += (billing.cmPercentage ?? 0)
            }
            // Total of every row with in financial year... 

            startDate = parseDate(startDate).add(1, 'months')
        }
        data[4]['total'] = (data[3]['total']  / data[1]['total']) * 100 //CM%
        this.setState({data},()=>{
            this.Columns()

        })
    }

    Columns = () =>{
        
        const { billing, parent } = this.props
        const { fiscalYear, data } = this.state
        // const len = billing.totalMonths>0 ? billing.totalMonths : 0
        const len = 16
        let array = []
        console.log(data)
        for (
            var iMonth = parseDate(fiscalYear['start']) ; // defination
            iMonth.isSameOrBefore(parseDate(fiscalYear['end']));  //condition
            iMonth.add(1, 'months') //itrerater
        ){
            let key = parseDate(iMonth, true, 'MMM YY')
                        //project can have green column if we are checking opportunity P&L there won't be actual
            let color = parent === 'P' ? iMonth.isSameOrAfter(parseDate(new Date()), 'month') ? '#ff7875' : '#a0df7d' : '#ff7875'
            color = data[0][key]? color: ''
            array.push(
                {
                    title: key,
                    align: 'center',
                    dataIndex: key,
                    key: key,
                    onCell: () => ({
                        style: {
                        backgroundColor: color
                        }
                    }),
                    onHeaderCell: () => ({
                        style: {
                        backgroundColor: color
                        }
                    }),
                    render: (record, records) =>{
                        if (record && !isNaN(data[0][key])){
                            if (records.key === 'W') {
                                return <b>{record} </b>
                            }else if (records.key === 'R') {
                                return ` ${formatCurrency(record)}`
                            }else if (records.key === 'C'){
                                return ` ${formatCurrency(record)}`
                            }else if (records.key === '$'){
                                return <b>{` ${formatCurrency(record)}`}</b>
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
                width: 200,
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
                width: 130,
                render:(text, record)=>{
                    if (text){
                        if (record.key === 'W') {
                            return <b>{text} </b>
                        }else if (record.key === 'R') {
                            return ` ${formatCurrency(text)}`
                        }else if (record.key === 'C'){
                            return ` ${formatCurrency(text)}`
                        }else if (record.key === '$'){
                            return <b>{` ${formatCurrency(text)}`}</b>
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
            <Row justify="start" gutter={[20, 5]}>
                <Col><Tag color="#a0df7d" className="legends"></Tag><span> Actual</span></Col>
                <Col><Tag color="#ff7875" className="legends"></Tag><span> Forecast</span></Col>
                <Col span="24">
                    <Table
                        bordered
                        rowKey= {(data =>data.label)}
                        columns={columns}
                        dataSource={data}
                        size="small"
                        pagination = {false}
                        className="scroll-table fs-v-small full-width"
                        scroll={{
                            // x: "calc(700px + 100%)",
                            x: "max-content",
                        }}
                    />
                </Col>
               
            </Row>
        )
    }
}

export default ProfitLoss

const legends = {
        padding: '6px 14px',
        border: '1px black solid',
        marginRight: '2px'
}