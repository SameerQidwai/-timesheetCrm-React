import React, { Component } from "react";
import { Row, Col, Table, Typography } from "antd";
import moment from "moment";
import "../Styles/table.css"
import { getRecord } from "../../service/opportunities";
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
                // {
                //     title: 'Jul-21',
                //     children: [
                //       {
                //         title: '22',
                //         render: (record) =>{
                //             if (record.key === 'R') {
                //                 return `$ ${record[1]}`
                //             }else if (record.key === 'C'){
                //                 return `$ ${record[1]}`
                //             }else if (record.key === '$'){
                //                 return <b>{`$ ${record[1]}`}</b>
                //             }else if (record.key === '%'){
                //                 return <b>{` ${record[1]} %`}</b>
                //             }
                //         }
                //       },
                //     ]
                // },
                // {
                //     title: 'Aug-21',
                //     children: [
                //         {
                //             title: '22',
                //             render: (record) =>{
                //                 if (record.key === 'R') {
                //                     return `$ ${record[2]}`
                //                 }else if (record.key === 'C'){
                //                     return `$ ${record[2]}`
                //                 }else if (record.key === '$'){
                //                     return <b>{`$ ${record[2]}`}</b>
                //                 }else if (record.key === '%'){
                //                     return <b>{` ${record[2]} %`}</b>
                //                 }
                //             }
                //           },
                //     ]
                // },
                // {
                //     title: 'Sep-21',
                //     children: [
                //         {
                //             title: '22',
                //             render: (record) =>{
                //                 if (record.key === 'R') {
                //                     return `$ ${record[3]}`
                //                 }else if (record.key === 'C'){
                //                     return `$ ${record[3]}`
                //                 }else if (record.key === '$'){
                //                     return <b>{`$ ${record[3]}`}</b>
                //                 }else if (record.key === '%'){
                //                     return <b>{` ${record[3]} %`}</b>
                //                 }
                //             }
                //         }
                //     ]
                // },
                // {
                //     title: 'Oct-21',
                //     children: [
                //         {
                //             title: '20',
                //             render: (record) =>{
                //                 if (record.key === 'R') {
                //                     return `$ ${record[4]}`
                //                 }else if (record.key === 'C'){
                //                     return `$ ${record[4]}`
                //                 }else if (record.key === '$'){
                //                     return <b>{`$ ${record[4]}`}</b>
                //                 }else if (record.key === '%'){
                //                     return <b>{` ${record[4]} %`}</b>
                //                 }
                //             }
                //         }
                //     ]
                // },
                // {
                //     title: 'Nov-21',
                //     children: [
                //         {
                //             title: '22',
                //             render: (record) =>{
                //                 if (record.key === 'R') {
                //                     return `$ ${record[5]}`
                //                 }else if (record.key === 'C'){
                //                     return `$ ${record[5]}`
                //                 }else if (record.key === '$'){
                //                     return <b>{`$ ${record[5]}`}</b>
                //                 }else if (record.key === '%'){
                //                     return <b>{` ${record[5]} %`}</b>
                //                 }
                //             }
                //         }
                //     ]
                // },
                // {
                //     title: 'Dec-21',
                //     children: [
                //         {
                //             title: '21',
                //             render: (record) =>{
                //                 if (record.key === 'R') {
                //                     return `$ ${record[6]}`
                //                 }else if (record.key === 'C'){
                //                     return `$ ${record[6]}`
                //                 }else if (record.key === '$'){
                //                     return <b>{`$ ${record[6]}`}</b>
                //                 }else if (record.key === '%'){
                //                     return <b>{` ${record[6]} %`}</b>
                //                 }
                //             }
                //         }
                //     ]
                // },
                // {
                //     title: 'Jan-22',
                //     children: [
                //         {
                //             title: '19',
                //             render: (record) =>{
                //                 if (record.key === 'R') {
                //                     return `$ ${record[7]}`
                //                 }else if (record.key === 'C'){
                //                     return `$ ${record[7]}`
                //                 }else if (record.key === '$'){
                //                     return <b>{`$ ${record[7]}`}</b>
                //                 }else if (record.key === '%'){
                //                     return <b>{` ${record[7]} %`}</b>
                //                 }
                //             }
                //         }
                //     ]
                // },
                // {
                //     title: 'Feb-22',
                //     children: [
                //         {
                //             title: '20',
                //             render: (record) =>{
                //                 if (record.key === 'R') {
                //                     return `$ ${record[8]}`
                //                 }else if (record.key === 'C'){
                //                     return `$ ${record[8]}`
                //                 }else if (record.key === '$'){
                //                     return <b>{`$ ${record[8]}`}</b>
                //                 }else if (record.key === '%'){
                //                     return <b>{` ${record[8]} %`}</b>
                //                 }
                //             }
                //         }
                //     ]
                // },
                // {
                //     title: 'Mar-22',
                //     children: [
                //         {
                //             title: '22',
                //             render: (record) =>{
                //                 if (record.key === 'R') {
                //                     return `$ ${record[9]}`
                //                 }else if (record.key === 'C'){
                //                     return `$ ${record[9]}`
                //                 }else if (record.key === '$'){
                //                     return <b>{`$ ${record[9]}`}</b>
                //                 }else if (record.key === '%'){
                //                     return <b>{` ${record[9]} %`}</b>
                //                 }
                //             }
                //         }
                //     ]
                // },
                // {
                //     title: 'Apr-22',
                //     children: [
                //         {
                //             title: '18',
                //             render: (record) =>{
                //                 if (record.key === 'R') {
                //                     return `$ ${record[10]}`
                //                 }else if (record.key === 'C'){
                //                     return `$ ${record[10]}`
                //                 }else if (record.key === '$'){
                //                     return <b>{`$ ${record[10]}`}</b>
                //                 }else if (record.key === '%'){
                //                     return <b>{` ${record[10]} %`}</b>
                //                 }
                //             }
                //         }
                //     ]
                // },
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

    Columns = () =>{
        const { columns, data } = this.state
        const { billing } = this.props
        console.log(billing.cm$);
        const len = billing.totalMonths>0 ? billing.totalMonths : 0
        let month = billing.startDate
        let revenue = (billing.discount / len).toFixed(2);
        let cm = ((revenue * billing.cmPercentage ) / 100).toFixed(2);
        let cos = (revenue - cm).toFixed(2);
        console.log(cm);
        let array = []
        for (var i = 1; i <=len; i++){
            array.push(
                {
                    title: moment(month).format('MMM YY'),
                    width:500,
                    children: [
                      {
                        title: '22',
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
            data[0][i] = revenue
            data[1][i] = cos
            data[2][i] = cm
            data[3][i] = billing.cmPercentage
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
                    <Text>$ {billing.discount} / {billing.totalMonths} Months  = $ {(billing.discount / billing.totalMonths).toFixed(2)}</Text>
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
                <Col span={24}>
                    <Title level={3} underline>Exp Vitcom - Opportunity</Title>
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
