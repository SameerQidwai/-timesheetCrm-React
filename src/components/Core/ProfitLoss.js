import React, { Component } from "react";
import { Row, Col, Table, Typography } from "antd";
import moment from "moment";
import { isoWeekdayCalc } from 'moment-weekday-calc';
import "../Styles/table.css"
import { getRecord } from "../../service/opportunities";
import { formatCurrency } from "../../service/constant";
const { Title, Text } = Typography

class ProfitLoss extends Component {
    constructor(props){
        super(props)
        this.state={
            billing: {},
            columns: [
                {
                    title: 'Month',
                    width: 500,
                    children: [
                      {
                        title: 'Working Days',
                        // dataIndex: 'label',
                        // key: 'label',
                        render: (record) =>{
                            if (record.key === 'R') {
                                return record.label
                            }else if (record.key === 'C'){
                                return record.label
                            }else if (record.key === '$'){
                                return <b>{record.label}</b>
                            }else if (record.key === '%'){
                                return <b>{record.label}</b>
                            }
                        }
                      },
                    ]
                },
               
            ],
            data:[
                {key: 'R', label: 'Revenue'},
                {key: 'C', label: '(-) Cos' },
                {key: '$', label: 'CM $' },
                {key: '%', label: 'CM %' },
            ]
        }
    }
    componentDidMount = () =>{
        this.calculateData()
    }

    getWeekdays = (startDate, endDate) =>{
        console.log(startDate.format('DD MM YYYY'), endDate.format('DD MM YYYY'));
        return moment().isoWeekdayCalc(startDate,endDate,[1,2,3,4,5])
    }

    calculateData = () =>{
        const { data } = this.state
        const { billing } = this.props
        const len = billing.totalMonths>0 ? billing.totalMonths : 0
        let startDate = moment(billing.startDate)
        let endDate = moment(billing.endDate)
        let noOfDays = 0
        for (var i =1; i<=len; i++){
            startDate = i===1 ? billing.startDate : moment(startDate).set('date', 1); 
            endDate = i===len ? billing.endDate: moment(startDate).endOf('month');
            noOfDays = noOfDays + this.getWeekdays(startDate, endDate)
            startDate = moment(startDate).add(1, 'months')
        }
        let revenue = (billing.discount / noOfDays)
        let cm = (revenue * billing.cmPercentage /100 )
        let cos = (revenue - cm)
        for (var i =1; i<= len; i++){
            console.log(i, len);
            startDate = i===1 ? billing.startDate  : moment(startDate).set('date', 1); 
            endDate = i===len ? billing.endDate: moment(startDate).endOf('month');
            let workDays = this.getWeekdays(startDate, endDate)
            data[0][i] = formatCurrency((revenue * workDays).toFixed(2))
            data[1][i] = formatCurrency((cos * workDays).toFixed(2))
            data[2][i] = formatCurrency((cm * workDays).toFixed(2))
            data[3][i] = formatCurrency(billing.cmPercentage)
            startDate = moment(startDate).add(1, 'months')
        }
        console.log(data);
        this.setState({data},()=>{
            this.Columns()

        })
    }

    Columns = () =>{
        const { columns } = this.state
        const { billing } = this.props
        const len = billing.totalMonths>0 ? billing.totalMonths : 0
        let month = billing.startDate
        let startDate = ''
        let endDate = ''
        let array = []
        for (var i = 1; i <=len; i++){
            startDate = i===1 ? billing.startDate : moment(startDate).set('date', 1); 
            endDate = i===len ? billing.endDate : moment(startDate).endOf('month');
            array.push(
                {
                    title: moment(month).format('MMM YY'),
                    width:500,
                    children: [
                      {
                        title: this.getWeekdays(startDate, endDate),
                        dataIndex: i,
                        key: i,
                        render: (record, records) =>{
                            // console.log(record,record[i], 'render record');
                            if (records.key === 'R') {
                                return `$ ${record}`
                            }else if (records.key === 'C'){
                                return `$ ${record}`
                            }else if (records.key === '$'){
                                return <b>{`$ ${record}`}</b>
                            }else if (records.key === '%'){
                                return <b>{` ${record} %`}</b>
                            }
                        }
                      },
                    ]
                },
            )
            
            startDate = moment(startDate).add(1, 'months')
            month = moment(month).add(1, 'months')
        }
        this.setState({
            columns: [...columns, ...array],
        })
    }

    // DataSource = () =>{
    //     const { data } = this.state
    //     return data
    // }

    render(){
        const { data, columns } = this.state
        const { billing } = this.props
        return (
            <Row justify="center">
                <Col span={4}>
                    <Title level={5} >Rev - Discount Value</Title>
                </Col>
                <Col span={5}>
                    <Text>$ {formatCurrency(billing.discount)} / {billing.totalMonths} Months  = $ {formatCurrency((billing.discount / billing.totalMonths).toFixed(2))}</Text>
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
                </Col>
                <Table
                    rowKey= {(data =>data.label)}
                    columns={columns}
                    dataSource={data}
                    size="small"
                    pagination = {false}
                    className="timeSheet-table"
                />
            </Row>
        )
    }
}

export default ProfitLoss
