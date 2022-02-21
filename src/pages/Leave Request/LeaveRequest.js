import React, {Component} from 'react'
import { Table, Button, Row, Col, Typography, Menu, Dropdown, Tag} from 'antd'
import { DownOutlined, SettingOutlined, PlusSquareOutlined, FilterOutlined} from '@ant-design/icons';
import { formatFloat, fomratDate, localStore, R_STATUS, STATUS_COLOR } from '../../service/constant';
import AddRequestModal from './Modals/AddRequestModal';
import { getRequests } from '../../service/leaveRequest-Apis';
import moment from 'moment';
import LeaveBalance from '../../components/Core/LeaveBalance';
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
                render:(text) => formatFloat(text)
            },
            {
                title: 'Earned YTD',
                dataIndex: 'earned',
                key: 'earned',
                render:(text, record)=> formatFloat(record.balanceHours - record.carryForward + record.used)
            },
            {
                title: 'Used YTD',
                dataIndex: 'used',
                key: 'used',
                render:(text) => formatFloat(text)
            },
            {
                title: 'Balance',
                dataIndex: 'balanceHours',
                key: 'balanceHours',
                render:(text) => formatFloat(text)
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
                render:(text) => formatFloat(text)
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
                                disabled={!this?.state?.permissions?.['UPDATE']}
                                onClick={()=> {
                                    this.setState({
                                        openModal: true,
                                        editRequest: record.id,
                                        readOnly: record.status === 'AP'
                                        // editIndex: index
                                    })
                                }
                            }
                            >{record.status === 'AP' ?'View': 'Edit' }</Menu.Item>
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
            readOnly: false,
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
        Promise.all([getRequests()])
        .then((res) => {
            this.setState({ 
                openModal: false,
                readOnly: false,
                editRequest: false,
                request: res[0].success? res[0].data : [],
                permissions: LEAVE_REQUESTS,
            });
        })
        .catch((e) => {
            console.log(e);
        });
    }

    closeModal = () =>{
        this.setState({
            openModal: false,
            editRequest: false,
            readOnly: false,
        })
    }

    callBack = (reqObj) => {
        this.getData()
    }

    render(){
        const { request, openModal, editRequest, permissions, readOnly } = this.state
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
                            sticky
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
                        <Title level={4}>My Leave Balance</Title>
                    </Col>
                    
                    <Col span={24}>
                        <LeaveBalance editable={false} style={{maxHeight: '30vh', overflowY: 'scroll'}}/>
                    </Col>
                </Row>
                {openModal && (
                    <AddRequestModal
                        visible={openModal}
                        close={this.closeModal}
                        edit={editRequest}
                        callBack={this.getData}
                        readOnly={readOnly}
                    />
                )}
            </>
        )
    }
}

export default LeaveRequest;