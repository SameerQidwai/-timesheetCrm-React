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
                {
                    title: 'Jul-21',
                    children: [
                      {
                        title: '22',
                        render: (record) =>{
                            if (record.key === 'R') {
                                return `$ ${record[1]}`
                            }else if (record.key === 'C'){
                                return `$ ${record[1]}`
                            }else if (record.key === '$'){
                                return <b>{`$ ${record[1]}`}</b>
                            }else if (record.key === '%'){
                                return <b>{` ${record[1]} %`}</b>
                            }
                        }
                      },
                    ]
                },
                {
                    title: 'Aug-21',
                    children: [
                        {
                            title: '22',
                            render: (record) =>{
                                if (record.key === 'R') {
                                    return `$ ${record[2]}`
                                }else if (record.key === 'C'){
                                    return `$ ${record[2]}`
                                }else if (record.key === '$'){
                                    return <b>{`$ ${record[2]}`}</b>
                                }else if (record.key === '%'){
                                    return <b>{` ${record[2]} %`}</b>
                                }
                            }
                          },
                    ]
                },
                {
                    title: 'Sep-21',
                    children: [
                        {
                            title: '22',
                            render: (record) =>{
                                if (record.key === 'R') {
                                    return `$ ${record[3]}`
                                }else if (record.key === 'C'){
                                    return `$ ${record[3]}`
                                }else if (record.key === '$'){
                                    return <b>{`$ ${record[3]}`}</b>
                                }else if (record.key === '%'){
                                    return <b>{` ${record[3]} %`}</b>
                                }
                            }
                        }
                    ]
                },
                {
                    title: 'Oct-21',
                    children: [
                        {
                            title: '20',
                            render: (record) =>{
                                if (record.key === 'R') {
                                    return `$ ${record[4]}`
                                }else if (record.key === 'C'){
                                    return `$ ${record[4]}`
                                }else if (record.key === '$'){
                                    return <b>{`$ ${record[4]}`}</b>
                                }else if (record.key === '%'){
                                    return <b>{` ${record[4]} %`}</b>
                                }
                            }
                        }
                    ]
                },
                {
                    title: 'Nov-21',
                    children: [
                        {
                            title: '22',
                            render: (record) =>{
                                if (record.key === 'R') {
                                    return `$ ${record[5]}`
                                }else if (record.key === 'C'){
                                    return `$ ${record[5]}`
                                }else if (record.key === '$'){
                                    return <b>{`$ ${record[5]}`}</b>
                                }else if (record.key === '%'){
                                    return <b>{` ${record[5]} %`}</b>
                                }
                            }
                        }
                    ]
                },
                {
                    title: 'Dec-21',
                    children: [
                        {
                            title: '21',
                            render: (record) =>{
                                if (record.key === 'R') {
                                    return `$ ${record[6]}`
                                }else if (record.key === 'C'){
                                    return `$ ${record[6]}`
                                }else if (record.key === '$'){
                                    return <b>{`$ ${record[6]}`}</b>
                                }else if (record.key === '%'){
                                    return <b>{` ${record[6]} %`}</b>
                                }
                            }
                        }
                    ]
                },
                {
                    title: 'Jan-22',
                    children: [
                        {
                            title: '19',
                            render: (record) =>{
                                if (record.key === 'R') {
                                    return `$ ${record[7]}`
                                }else if (record.key === 'C'){
                                    return `$ ${record[7]}`
                                }else if (record.key === '$'){
                                    return <b>{`$ ${record[7]}`}</b>
                                }else if (record.key === '%'){
                                    return <b>{` ${record[7]} %`}</b>
                                }
                            }
                        }
                    ]
                },
                {
                    title: 'Feb-22',
                    children: [
                        {
                            title: '20',
                            render: (record) =>{
                                if (record.key === 'R') {
                                    return `$ ${record[8]}`
                                }else if (record.key === 'C'){
                                    return `$ ${record[8]}`
                                }else if (record.key === '$'){
                                    return <b>{`$ ${record[8]}`}</b>
                                }else if (record.key === '%'){
                                    return <b>{` ${record[8]} %`}</b>
                                }
                            }
                        }
                    ]
                },
                {
                    title: 'Mar-22',
                    children: [
                        {
                            title: '22',
                            render: (record) =>{
                                if (record.key === 'R') {
                                    return `$ ${record[9]}`
                                }else if (record.key === 'C'){
                                    return `$ ${record[9]}`
                                }else if (record.key === '$'){
                                    return <b>{`$ ${record[9]}`}</b>
                                }else if (record.key === '%'){
                                    return <b>{` ${record[9]} %`}</b>
                                }
                            }
                        }
                    ]
                },
                {
                    title: 'Apr-22',
                    children: [
                        {
                            title: '18',
                            render: (record) =>{
                                if (record.key === 'R') {
                                    return `$ ${record[10]}`
                                }else if (record.key === 'C'){
                                    return `$ ${record[10]}`
                                }else if (record.key === '$'){
                                    return <b>{`$ ${record[10]}`}</b>
                                }else if (record.key === '%'){
                                    return <b>{` ${record[10]} %`}</b>
                                }
                            }
                        }
                    ]
                },
            ],
            data:[
                {key: 'R', label: 'Revenue', 1: 800, 2: 100, 3: 200, 4: 300, 5: 800, 6: 800, 7: 800, 8: 800, 9: 800, 10: 800},
                {key: 'C', label: '(-) Cos', 1: 200, 2: 240, 3: 440, 4: 640, 5: 640, 6: 640, 7: 640, 8: 640, 9: 640, 10: 640},
                {key: '$', label: 'CM $', 1: 160, 2: 170, 3: 160, 4: 160, 5: 160, 6: 160, 7: 160, 8: 160, 9: 160, 10: 160},
                {key: '%', label: 'CM %', 1: 20, 2: 20, 3: 10, 4: 20, 5: 20, 6: 20, 7: 20, 8: 20, 9: 20, 10: 20},
            ]
        }
    }
    componentDidMount = () =>{
    }

    // getRecord = (id) =>{
    //     getRecord(id).then(res=>{
    //         if(res.success){
    //             this.setState({
    //                 billing: res.billing,
    //                 leadId: id,
    //             },()=>{
    //                 this.Columns(res.billing)
    //             })
    //         }
    //     })
    // }

    Columns = () =>{
        const { columns, data } = this.state
        const { billing } = this.props
        console.log(billing.totalMonths);
        const len = billing.totalMonths>0 ? billing.totalMonths : 0
        let month = billing.startDate
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
                            console.log(record, records, 'recordss');
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
            month = moment(month).add(1, 'months')
        }
        this.setState({
            columns: [...columns, ...array],
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
                    <Title level={5}>Rev - Discount Value</Title>
                </Col>
                <Col span={5}>
                    <Text>$ {billing.discount} / {billing.totalMonths} Months  = $ {billing.discount / billing.totalMonths}</Text>
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
                {console.log(columns)}
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
