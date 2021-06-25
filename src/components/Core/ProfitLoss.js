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
        this.Columns()
    }

    getWeekdays = (startDate, endDate) =>{
        console.log(startDate.format('DD MM YYYY'), endDate.format('DD MM YYYY'));
        return moment().isoWeekdayCalc(startDate,endDate,[1,2,3,4,5])
    }

    Columns = () =>{
        const { columns, data } = this.state
        const { billing } = this.props
        const len = billing.totalMonths>0 ? billing.totalMonths : 0
        let month = billing.startDate
        let revenue = (billing.discount / len).toFixed(2);
        let cm = ((revenue * billing.cmPercentage ) / 100).toFixed(2);
        let cos = (revenue - cm).toFixed(2);
        let startDate = ''
        let endDate = ''
        console.log(cm);
        let array = []
        for (var i = 1; i <=len; i++){
            startDate = i===1 ? month : moment(month).set('date', 1); 
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
            data[0][i] = formatCurrency(revenue)
            data[1][i] = formatCurrency(cos)
            data[2][i] = formatCurrency(cm)
            data[3][i] = formatCurrency(billing.cmPercentage)
            month = moment(month).add(1, 'months')
        }
        this.setState({
            columns: [...columns, ...array],
            data
            // billing,
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
