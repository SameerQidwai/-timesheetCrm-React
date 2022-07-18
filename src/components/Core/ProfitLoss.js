import React, { Component } from "react";
import { Row, Col, Table, Typography } from "antd";
import { getRecord } from "../../service/opportunities";
import { formatCurrency, formatDate, formatFloat, getFiscalYear } from "../../service/constant";
// import moment from 'moment'
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
                    const {statement, statementTotal} = res.data
                    this.calculateProjectData(statement, statementTotal)
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

    calculateProjectData = (statement, statementTotal) =>{
        let { data, fiscalYear } = this.state
        const { billing, type: proType } = this.props
        const len = billing.totalMonths ?? 0
        let startDate = formatDate(billing.startDate)
        let endDate = formatDate(billing.endDate)
        let noOfDays = 0
        let pastMonthsDays = 0
        let revenue = 0

        for (var i =1; i<=len; i++){
            startDate = i===1 ? billing.startDate : formatDate(startDate).set('date', 1); 
            endDate = i===len ? billing.endDate: formatDate(startDate).endOf('month');
            const workDays = this.getWeekdays(startDate, endDate)
            let key = formatDate(startDate).format('MMM YY')
            
            if (startDate.isBefore(moment().set('date', 1))){ //checking if the date belongs to past month
                pastMonthsDays += workDays // adding past month to subtract equally divided
            }

            noOfDays = noOfDays + workDays
            data[0][key]= workDays
            startDate = formatDate(startDate).add(1, 'months')
        }   

        //if project is Time base past Buy will be subtract and will divide same amoung remaining days
        if (proType ===2){
            revenue = ((billing.value - (statementTotal['sellTotal']??0)) / (noOfDays-pastMonthsDays))
        }else{
            revenue = (billing.value/noOfDays)
        }

        //for total column
        data[0]['total'] = noOfDays 
        data[1]['total'] = statementTotal['sellTotal']
        data[3]['total'] = statementTotal['buyTotal']
        data[2]['total'] = statementTotal['sellTotal'] - statementTotal['buyTotal']

        for (var i =1; i<= len; i++){
            startDate = i===1 ? billing.startDate  : formatDate(startDate).set('date', 1); 
            endDate = i===len ? billing.endDate: formatDate(startDate).endOf('month');
            // let workDays = this.getWeekdays(startDate, endDate)
            let key = formatDate(startDate).format('MMM YY')
            let workDays = data[0][key]
            let value = 0
            let cm = 0
            let cos = 0
            // if (statement[key]){
                if (proType === 2){
                    value = statement[key]?.['monthTotalSell']
                }else{
                    value = (revenue * workDays)
                }
                
            cos = statement[key]?.['monthTotalBuy']
            cm = value - cos
            
            data[1][key] = value  //revune
            data[3][key] = cm //cm
            data[2][key] = cos //cos 
            data[4][key] = ((cm / value )*100)//cm percentage
            // }else{
            //     value =  (revenue * workDays)
            //     cm = statement[key]?.['monthTotalSell']  - statement[key]?.['monthTotalBuy']  ?? (value * billing.cmPercentage / 100 )
            //     data[1][key] = value  //revune
            //     data[3][key] = cm //cm
            //     data[2][key] = statement[key]?.['monthTotalBuy'] ?? (value - cm) //cos 
            //     data[4][key] = billing.cmPercentage //cm percentage
            // }
            
            //calculating total of cm percentage...
            data[4]['total'] += data[4][key]

            startDate = formatDate(startDate).add(1, 'months')
        }

        //takeing avg of total cm%
        data[4]['total'] = (data[4]['total'] / len ) * 100
        
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
                                return <b>{` ${record} %`}</b>
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
                            return <b>{` ${text} %`}</b>
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
