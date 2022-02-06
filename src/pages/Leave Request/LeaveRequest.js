import React, {Component} from 'react'
import { Table, Button, Row, Col, Typography, Menu, Dropdown} from 'antd'
import { DownOutlined, SettingOutlined, PlusSquareOutlined, FilterOutlined} from '@ant-design/icons';
import { localStore, R_STATUS } from '../../service/constant';
import AddRequestModal from './Modals/AddRequestModal';
import { getRequests } from '../../service/leaveRequest-Apis';
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
                                        editRequest: record.id
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
            editRequest: false,
            type: [],
            openModal: false
        }   
    }

    componentDidMount = () =>{
        this.getData();
    }

    getData = () =>{ 
        Promise.all([getRequests() /*, here comes the type ApiFunction*/])
        .then((res) => {
            this.setState({ 
                request: res[0].success? res[0].data : [],
                type: [
                    {
                        id:0,
                        type: 'Sick Leave',
                        accured: '20',
                        earned: '30',
                        used: '10',
                        balance: '40'
                    },
                    {
                        id:1,
                        type: 'Annual Leave',
                        accured: '20',
                        earned: '20',
                        used: '20',
                        balance: '20'
                    },
                ]
            });
        })
        .catch((e) => {
            console.log(e);
        });
    }

    closeModal = () =>{
        this.setState({
            openModal: false,
            editRequest: false
        })
    }

    addRequest = (reqObj) => {
        this.setState({ request: [...this.state.request, reqObj] })
    }

    render(){
        const { request, openModal, type, editRequest } = this.state
        return(
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={4}>LEAVE REQUESTS</Title>
                    </Col>
                    <Col style={{marginLeft: 'auto'}} >
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
                        <Title level={4}>TIME OFF BALANCE</Title>
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
                        edit={editRequest}
                        addRequest={this.addRequest}
                    />
                )}
            </>
        )
    }
}

export default LeaveRequest;