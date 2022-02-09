import React, {Component} from 'react'
import { Table, Button, Row, Col, Typography, Menu, Dropdown, Tag} from 'antd'
import { DownOutlined, SettingOutlined, PlusSquareOutlined, FilterOutlined} from '@ant-design/icons';
import { fomratDate, localStore, R_STATUS, STATUS_COLOR } from '../../service/constant';
import AddRequestModal from './Modals/AddRequestModal';
import { getLeaveBalance, getRequests } from '../../service/leaveRequest-Apis';
import moment from 'moment';
const { Title } = Typography

class LeaveRequest extends Component {
    constructor(props) {
        super(props);
        this.typeColumns = [
            {
                title: 'Type',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'Accured',
                dataIndex: 'carryForward',
                key: 'carryForward',
            },
            {
                title: 'Earned',
                dataIndex: 'earned',
                key: 'earned',
                render:(text, record)=> record.balanceHours - record.carryForward
            },
            {
                title: 'Used',
                dataIndex: 'used',
                key: 'used',
            },
            {
                title: 'Balance',
                dataIndex: 'balanceHours',
                key: 'balanceHours',
            },
        ]

        this.requestColumns = [
            
            {
                title: 'Start Date',
                dataIndex: 'startDate',
                key: 'startDate',
                render:(text, records) => text && fomratDate(text)
            },
            {
                title: 'End Date',
                dataIndex: 'endDate',
                key: 'endDate',
                render:(text, records) => text && fomratDate(text)
            },
            {
                title: 'Project',
                dataIndex: 'project',
                key: 'project',
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
                render:(text, records) => {
                    return  <Tag color={STATUS_COLOR[text]}> {R_STATUS[text]} </Tag>
                }
            },
            {
                title: 'Action',
                key: 'action',
                align: 'right',
                render: (record, index) => (
                    <Dropdown overlay={
                        <Menu>
                            <Menu.Item 
                                disabled={!this?.state?.permissions?.['UPDATE'] || record.status === 'AP'}
                                onClick={()=> {
                                    this.setState({
                                        openModal: true,
                                        editRequest: record.id,
                                        // editIndex: index
                                    })
                                }
                            }
                            >Edit</Menu.Item>
                            {/* <Menu.Item 
                                onClick={()=>{}}
                            >Delete</Menu.Item> */}
                            
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
            permissions: {},
            type: [],
            openModal: false
        }   
    }

    componentDidMount = () =>{
        this.getData();
    }

    getData = () =>{ 
        const { permissions } = localStore()
        const { LEAVE_REQUESTS } = JSON.parse(permissions)
        Promise.all([getRequests(), getLeaveBalance()])
        .then((res) => {
            this.setState({ 
                openModal: false,
                editRequest: false,
                request: res[0].success? res[0].data : [],
                permissions: LEAVE_REQUESTS,
                type: res[1].success? res[1].data : []
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

    callBack = (reqObj) => {
        this.getData()
    }

    render(){
        const { request, openModal, type, editRequest, permissions } = this.state
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
                            disabled={!permissions['ADD']}
                            onClick={()=>{
                                this.setState({
                                    openModal: true,
                                })
                            }}
                            ><PlusSquareOutlined />Add Request</Button>
                    </Col>
                    <Col span={24}>
                        <Table
                            bordered
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
                            bordered
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
                        callBack={this.getData}
                    />
                )}
            </>
        )
    }
}

export default LeaveRequest;