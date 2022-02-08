import React, {Component} from 'react'
import { Table, Button, Row, Col, Typography, Menu, Dropdown, DatePicker, Tag, Select} from 'antd'
import { DownOutlined, SettingOutlined, PlusSquareOutlined, FilterOutlined} from '@ant-design/icons';
import { localStore, R_STATUS, STATUS_COLOR } from '../../service/constant';
import moment from "moment";
import { getApprovalRequests, manageLeaveRequests, manageRequests } from '../../service/leaveRequest-Apis';
import AddRequestModal from './Modals/AddRequestModal';
import { getMilestones } from '../../service/timesheet';
import { getUserProjects } from '../../service/constant-Apis';

const { Title, Text } = Typography

class ApproveRequest extends Component {
    constructor(props) {
        super(props);
        this.requestColumns = [
            {
                title: 'Resource',
                dataIndex: 'employeeName',
                key: 'employeeName',
            },
            {
                title: 'Project',
                dataIndex: 'project',
                key: 'project',
            },
            {
                title: 'Leave Type',
                dataIndex: 'leaveRequestName',
                key: 'leaveRequestName',
            },
            {
                title: 'Start Date',
                dataIndex: 'startDate',
                key: 'startDate',
                render:(text, records) =>text && moment(text).format('ddd DD MMM yyyy')
            },
            {
                title: 'End Date',
                dataIndex: 'endDate',
                key: 'endDate',
                render:(text, records) =>text && moment(text).format('ddd DD MMM yyyy')
            },
            {
                title: 'Submit Date',
                dataIndex: 'submittedAt',
                key: 'submittedAt',
                render:(text, records) =>text && moment(text).format('ddd DD MMM yyyy')
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                render:(text, records) =>(
                    <Tag color={STATUS_COLOR[text]}> {R_STATUS[text]} </Tag>
                ),
            },
            {
                title: 'Total Hours',
                dataIndex: 'totalHours',
                key: 'totalHours',
                align: 'center',
                render: (text, record)=> text && <Text strong>{text}</Text>
            },
            {
                title: 'Action',
                key: 'action',
                align: 'right',
                width: 110,
                render: (record) => (
                    <Dropdown overlay={
                        <Menu>
                            <Menu.Item 
                                onClick={()=> {
                                    this.setState({
                                        openModal: true,
                                        readRequest: record.id,
                                    })
                                }
                            }
                            >View</Menu.Item>
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
            readRequest: false,
            canApprove: false,
            loginId: {},
            permissions: {},
            sRequest: { // selected request 
                request: [], //  request Object 
                keys: [] // request keys
            },
            WORKS: [],
            USERS: [],
            queryRequest : {
                startDate: moment().startOf("month"),
                endDate: moment().endOf("month"), 
                workId: '', 
                userId: '', 
            }
        }   
    }

    componentDidMount = () =>{
        this.fetchAll();
    }

    fetchAll = () =>{
        const { startDate, endDate, workId, userId } = this.state.queryRequest
        const query = { startDate: startDate.format('DD-MM-YYYY'), endDate: endDate.format('DD-MM-YYYY'), workId, userId, }
        const { id, permissions } = localStore()
        const loginId = parseInt(id)
        const { LEAVE_REQUESTS } = JSON.parse(permissions)

        Promise.all([ getUserProjects(loginId, 'M'), getApprovalRequests(query) ])
        .then(res => {
            this.setState({
                WORKS: res[0].success? res[0].data : [],
                loginId,
                permissions: LEAVE_REQUESTS,
                request: res[1].success? res[1].data : [],
                readRequest: false,
            })
            
        })
        .catch(e => {
            console.log(e);
        })
    }


    getData = () =>{
        const { startDate, endDate, workId, userId } = this.state.queryRequest
        const query = {
            startDate: startDate.format('DD-MM-YYYY'),
            endDate: endDate.format('DD-MM-YYYY'),
            workId,
            userId,
        }
        getApprovalRequests(query).then(res=>{
            if(res.success){
                this.setState({
                    request: res.data,
                    readRequest: false,
                })
            }
        })
    }

    requestSelect = (selectedRowKeys, selectedRows)=>{
        this.setState({
            sRequest: {
                request: selectedRows,
                keys: selectedRowKeys
            }
        })
    }

    manageRequests = (manage) =>{
        const { keys } = this.state.sRequest
        const data = {leaveRequests: keys}
        manageLeaveRequests(manage, data).then(res=>{
            if(res.success){
                this.getData();
            }
        })
    }

    closeModal = () =>{
        this.setState({
            openModal: false,
            readRequest: false
        })
    }

    render(){
        const { request, sRequest, openModal, readRequest, queryRequest, WORKS, USERS    } = this.state;
        const { startDate, endDate, workId, userId } = queryRequest
        return(
            <>
                <Row justify="space-between">
                    <Col >
                        <Title level={4}>APPROVE REQUESTS</Title>
                    </Col>
                    <Col>
                        <Select
                            placeholder="Select Project"
                            style={{ width: 200 }}
                            size="small"
                            options={WORKS}
                            value={workId}           
                            optionFilterProp={["label", "value"]}
                            filterOption={
                                (input, option) =>{
                                    const label = option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    const value = option.value.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        return label || value
                                }
                            }
                            onSelect={(value, option)=>{
                                this.setState({
                                    queryRequest : {
                                        ...queryRequest,
                                        workId: value,
                                    }
                                },()=>{
                                    this.getData()
                                })
                            }}
                        />
                    </Col>
                    <Col>
                        <Select
                            size="small"
                            placeholder="Select User"
                            options={USERS}
                            value={userId}           
                            optionFilterProp={["label", "value"]}
                            style={{ width: 200 }}
                            filterOption={
                                (input, option) =>{
                                    const label = option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    const value = option.value.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        return label || value
                                }
                            }
                            onSelect={(value, option)=>{
                                this.setState({
                                    queryRequest : {
                                        ...queryRequest,
                                        userId: value,
                                    }
                                },()=>{
                                    this.getData()
                                })
                            }}
                        />
                    </Col>
                    <Col>
                        <DatePicker
                            size="small"
                            mode="month"
                            picker="month"
                            format="MMM-YYYY"
                            value={startDate}
                            onChange={(value)=>{
                                this.setState({
                                    queryRequest : {
                                        ...queryRequest,
                                        startDate: moment(value ?? moment()).startOf("month"),
                                        endDate: moment(value ?? moment()).endOf("month")
                                    }
                                },()=>{
                                    this.getData()
                                })
                            }}
                        />
                    </Col>
                    
                    <Col span={24}>
                        <Table
                            rowSelection={{
                                onChange:(selectedRowKeys, selectedRows)=>{this.requestSelect(selectedRowKeys, selectedRows )},
                                getCheckboxProps: (record) => ({
                                    disabled: record.status !== 'SB'
                                }),
                            }}
                            scroll={{
                                // x: "calc(700px + 100%)",
                                x: "'max-content'",
                            }}
                            pagination={{pageSize: localStore().pageSize}}
                            rowKey={(data) => data.id} 
                            columns={this.requestColumns}
                            dataSource={request}
                            size='small'
                        />
                    </Col>
                </Row>
                <Row justify='end' gutter={[20,200]}>
                    <Col>
                        <Button 
                            type="primary" 
                            danger
                            disabled={ sRequest.keys.length<1 }
                            onClick={()=>this.manageRequests('leaveRequestsReject')}
                        > 
                            Reject
                        </Button>
                    </Col>
                    <Col>
                        <Button 
                            type="primary"
                            disabled={ sRequest.keys.length<1}
                            onClick={()=>this.manageRequests('leaveRequestsApprove')}
                        > 
                            Approve
                        </Button>
                    </Col>
                </Row>
                {openModal && (
                    <AddRequestModal
                        visible={openModal}
                        close={this.closeModal}
                        edit={readRequest}
                        callBack={this.getData}
                        readOnly={true}
                    />
                )}
            </>
        )
    }
}

export default ApproveRequest;