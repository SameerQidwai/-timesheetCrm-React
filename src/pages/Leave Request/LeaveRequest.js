import React, {Component} from 'react'
import { Table, Button, Row, Col, Typography, Menu, Dropdown} from 'antd'
import { DownOutlined, SettingOutlined, PlusSquareOutlined, FilterOutlined} from '@ant-design/icons';
import { localStore } from '../../service/constant';
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
                render:(text, records) =>(
                    <Title level={5}>{records.type}</Title>
                ),
            },
            {
                title: 'Accured',
                dataIndex: 'accured',
                key: 'accured',
                render:(text, records) =>(
                    <Title level={5}>{records.accured}</Title>
                ),
            },
            {
                title: 'Earned',
                dataIndex: 'earned',
                key: 'earned',
                render:(text, records) =>(
                    <Title level={5}>{records.earned}</Title>
                ),
            },
            {
                title: 'Used',
                dataIndex: 'used',
                key: 'used',
                render:(text, records) =>(
                    <Title level={5}>{records.used}</Title>
                ),
            },
            {
                title: 'Balance',
                dataIndex: 'balance',
                key: 'balance',
                render:(text, records) =>(
                    <Title level={5}>{records.balance}</Title>
                ),
            },
        ]

        this.requestColumns = [
            {
                title: 'Start Date',
                dataIndex: 'startDate',
                key: 'startDate',
                render:(text, records) =>(
                    <Title level={5}>{moment(records.startDate).format('ddd DD MM yyyy')}</Title>
                ),
            },
            {
                title: 'End Date',
                dataIndex: 'endDate',
                key: 'endDate',
                render:(text, records) =>(
                    <Title level={5}>{moment(records.endDate).format('ddd DD MM yyyy')}</Title>
                ),
            },
            {
                title: 'Hours',
                dataIndex: 'hours',
                key: 'hours',
                render:(text, records) =>(
                    <Title level={5}>{records.totalHours}</Title>
                ),
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                render:(text, records) =>(
                    <Title level={5}>{
                        records.status === 'AP' ? 'Approved' :
                        records.status === 'SB' ? 'Submitted' :
                        records.status === 'R' ? 'Rejected' : 'Invalid'
                    }</Title>
                ),
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
            editRequest: '',
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
        type: [
            {
                id: '1',
                type: 'Sick Leave',
                accured: '20',
                earned: '30',
                used: '10',
                balance: '40'
            },
            {
                id: '2',
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