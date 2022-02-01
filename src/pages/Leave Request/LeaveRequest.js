import React, {Component} from 'react'
import { Table, Button, Row, Col, Typography, Menu, Dropdown} from 'antd'
import { DownOutlined, SettingOutlined, PlusSquareOutlined, FilterOutlined} from '@ant-design/icons';
import { localStore, R_STATUS } from '../../service/constant';
import AddRequestModal from './Modals/AddRequestModal';
import { getLeaveTypes, getRequests } from '../../service/leaveRequest-Apis';
import moment from 'moment';
const { Title } = Typography

class LeaveRequest extends Component {
    constructor(props) {
        super(props);
        this.typeColumns = [
            {
                title: 'Type',
                dataIndex: 'type',
                key: 'type',
            },
            {
                title: 'Accured',
                dataIndex: 'accured',
                key: 'accured',
            },
            {
                title: 'Earned',
                dataIndex: 'earned',
                key: 'earned',
            },
            {
                title: 'Used',
                dataIndex: 'used',
                key: 'used',
            },
            {
                title: 'Balance',
                dataIndex: 'balance',
                key: 'balance',
            },
        ]

        this.requestColumns = [
            {
                title: 'Start Date',
                dataIndex: 'startDate',
                key: 'startDate',
                render:(text, records) => text && moment(text).format('ddd DD MM yyyy')
            },
            {
                title: 'End Date',
                dataIndex: 'endDate',
                key: 'endDate',
                render:(text, records) => text && moment(text).format('ddd DD MM yyyy')
            },
            {
                title: 'Hours',
                dataIndex: 'totalHours',
                key: 'totalHours',
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                render:(text, records) => R_STATUS[text]
            },
            {
                title: 'Action',
                key: 'action',
                align: 'right',
                render: (record) => (
                    <Dropdown overlay={
                        <Menu>
                            <Menu.Item 
                                onClick={()=> {
                                    this.setState({
                                        openModal: true,
                                        editRequest: record
                                    })
                                }
                            }
                            >Edit</Menu.Item>
                            <Menu.Item 
                                onClick={()=>{}}
                            >Delete</Menu.Item>
                            
                        </Menu>
                    }> 
                        <Button size='small'>
                            <SettingOutlined/> Option <DownOutlined/>
                        </Button>
                    </Dropdown>  
                ),
            },
        ]

        this.state = {
            request : [],
            editRequest: {},
            leaveTypes: [],
            type: [],
            openModal: false
        }   
    }

    componentDidMount = () =>{
        getLeaveTypes().then(res => {
            this.setState({leaveTypes: res.data}) 
        });
        getRequests().then(res =>{
            this.setState({request: res.data})
        });
        this.getData();
    }

    closeModal = () =>{
        getRequests().then(res =>{
            this.setState({request: res.data})
            // console.log('My Data: ', res.data)
        });
        this.setState({
            openModal: false,
            editRequest: {}
        })
    }

    addRequest = (reqObj) => {
        this.setState({ request: [...this.state.request, reqObj] })
    }

    getData = () =>{
        this.setState({
        // request: [
        //     {
        //         key: 0,
        //         description: 'This is 1st Request',
        //         typeId: 1,
        //         workId: 2,
        //         entries: [
        //             {
        //                 date: '01/07/2021',
        //                 hours: '8.0'
        //             }
        //         ],
        //         hours: '8.0',
        //         status: 'Approved'
        //     },
        //     {
        //         key: 1,
        //         description: 'This is 2nd Request',
        //         typeId: 2,
        //         workId: 4,
        //         entries: [
        //             {
        //                 date: '11/07/2021',
        //                 hours: '4.0'
        //             },
        //             {
        //                 date: '11/08/2021',
        //                 hours: '4.0'
        //             },
        //             {
        //                 date: '11/09/2021',
        //                 hours: '4.0'
        //             },
        //             {
        //                 date: '11/10/2021',
        //                 hours: '4.0'
        //             },
        //         ],
        //         hours: '16.0',
        //         status: 'Rejected'
        //     },
        //     {
        //         key: 2,
        //         description: 'This is 3rd Request',
        //         typeId: 3,
        //         workId: 3,
        //         entries: [
        //             {
        //                 date: '01/08/2021',
        //                 hours: '8.0'
        //             },
        //         ],
        //         hours: '8.0',
        //         status: 'Submitted'
        //     },
        // ],
        type: [
            {
                type: 'Sick Leave',
                accured: '20',
                earned: '30',
                used: '10',
                balance: '40'
            },
            {
                type: 'Annual Leave',
                accured: '20',
                earned: '20',
                used: '20',
                balance: '20'
            },
        ]
    });
    }

    render(){
        const { request, openModal, type, editRequest } = this.state
        return(
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={1}>LEAVE REQUESTS</Title>
                    </Col>
                    <Col style={{textAlign:'end'}} span={4} >
                        
                            
                                <Button 
                                    type="primary" 
                                    size='small'
                                    onClick={()=>{
                                        this.setState({
                                            openModal: true,
                                        })
                                    }}
                                    // disabled={!permissions['ADD']}
                                    ><PlusSquareOutlined />Add Request</Button>
                        
                    </Col>
                    <Col span={24}>
                        <Table
                            style={{maxHeight: '40vh', overflowY: 'scroll'}}
                            pagination={{pageSize: localStore().pageSize}}
                            rowKey={(data) => data.id} 
                            columns={this.requestColumns}
                            dataSource={request}
                            size='small'
                        />
                    </Col>
                </Row>

                <Row style={{marginTop: '20px'}} justify="space-between">
                    <Col>
                        <Title level={1}>TIME OFF BALANCE</Title>
                    </Col>
                    
                    <Col span={24}>
                        <Table
                            style={{maxHeight: '30vh', overflowY: 'scroll'}}
                            pagination={{pageSize: localStore().pageSize}}
                            rowKey={(data) => data.id} 
                            columns={this.typeColumns}
                            dataSource={type}
                            size='small'
                        />
                    </Col>
                </Row>
                {openModal && (
                    <AddRequestModal
                        visible={openModal}
                        close={this.closeModal}
                        dataReceived={editRequest}
                        addRequest={this.addRequest}
                    />
                )}
            </>
        )
    }
}

export default LeaveRequest;