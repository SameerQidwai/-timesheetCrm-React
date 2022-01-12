import React, {Component} from 'react'
import { Table, Button, Row, Col, Typography, Menu, Dropdown} from 'antd'
import { DownOutlined, SettingOutlined, PlusSquareOutlined, FilterOutlined} from '@ant-design/icons';
import { localStore } from '../../service/constant';
import AddRequestModal from './Modals/AddRequestModal';

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
                    <Title level={5}>{records.startDate}</Title>
                ),
            },
            {
                title: 'End Date',
                dataIndex: 'endDate',
                key: 'endDate',
                render:(text, records) =>(
                    <Title level={5}>{records.endDate}</Title>
                ),
            },
            {
                title: 'Hours',
                dataIndex: 'hours',
                key: 'hours',
                render:(text, records) =>(
                    <Title level={5}>{records.hours}</Title>
                ),
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                render:(text, records) =>(
                    <Title level={5}>{records.status}</Title>
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
                                onClick={()=>this.setState({
                                    openModal: true,
                                })}
                            >Edit</Menu.Item>
                            <Menu.Item 
                                onClick={()=>this.setState({
                                    openModal: true,
                                })}
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
            type: [],
            openModal: false
        }   
    }

    componentDidMount = () =>{
        this.getData();
    }

    closeModal = () =>{
        this.setState({
            openModal: false,
        })
    }

    getData = () =>{
        this.setState({
        request: [
            {
                startDate: '01/07/2021', 
                endDate:'01/07/2021',
                hours:'8.0',
                status:'Approved'
            },
            {
                startDate: '20/07/2021', 
                endDate:'21/07/2021',
                hours:'16',
                status:'Rejected'
            },
            {
                startDate: '01/08/2021', 
                endDate:'01/08/2021',
                hours:'8.0',
                status:'Submitted'
            },
        ],
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
        const { request, openModal, type } = this.state
        // console.log('Data: ', data)
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
                        // callBack={this.callBack}
                    />
                )}
            </>
        )
    }
}

export default LeaveRequest;