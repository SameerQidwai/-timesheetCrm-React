import React, {Component} from 'react'
import { Table, Button, Row, Col, Typography, Menu, Dropdown, DatePicker, Tag, Select, Modal, Form, Input, Tooltip, Space} from 'antd'
import { DownOutlined, SettingOutlined, ExclamationCircleOutlined, CheckCircleOutlined, AuditOutlined} from '@ant-design/icons';
import { formatDate, formatFloat, localStore, R_STATUS, STATUS_COLOR } from '../../service/constant';
import moment from "moment";
import { getApprovalRequests, manageLeaveRequests } from '../../service/leaveRequest-Apis';
import AddRequestModal from './Modals/AddRequestModal';
import { getMilestones } from '../../service/timesheet';
import { getLineEmployees, getManageProjects } from '../../service/constant-Apis';
import { tableSorter, tableTitleFilter } from '../../components/Core/Table/TableFilter';

const { Title, Text } = Typography
let modal = ''

class ApproveRequest extends Component {
    constructor(props) {
        super(props);
        this.requestColumns = [
            {
                title: 'Resource',
                dataIndex: 'employeeName',
                key: 'employeeName',
                ...tableSorter('employeeName', 'string'),
            },
            {
                title: 'Project',
                dataIndex: 'project',
                key: 'project',
                ...tableSorter('project', 'string'),
            },
            {
                title: 'Leave Type',
                dataIndex: 'leaveRequestName',
                key: 'leaveRequestName',
                ...tableSorter('leaveRequestName', 'string'),
            },
            {
                title: 'Start Date',
                dataIndex: 'startDate',
                key: 'startDate',
                render:(text, records) =>text && formatDate(text),
                ...tableSorter('startDate', 'date'),
            },
            {
                title: 'End Date',
                dataIndex: 'endDate',
                key: 'endDate',
                render:(text, records) =>text && formatDate(text),
                ...tableSorter('endDate', 'date'),
            },
            {
                title: 'Submit Date',
                dataIndex: 'submittedAt',
                key: 'submittedAt',
                render:(text, records) =>text && formatDate(text),
                ...tableSorter('submittedAt', 'date'),
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                ...tableSorter('status', 'string'),
                render:(text, records) =>(
                    <Space  align="end">
                            <Tag color={STATUS_COLOR[text]}> 
                                {R_STATUS[text]}  
                            </Tag>
                        <Tooltip 
                            placement="top" 
                            title={records.note}
                            destroyTooltipOnHide
                        >
                                
                            {records.note && <AuditOutlined style={{fontSize: 'large'}} />}
                        </Tooltip>
                    </Space>
                ),
            },
            {
                title: 'Total Hours',
                dataIndex: 'totalHours',
                key: 'totalHours',
                align: 'center',
                render: (text, record)=> text && <Text strong>{formatFloat(text)}</Text>,
                ...tableSorter('totalHours', 'number'),
            },
            {
                title: '...',
                key: 'action',
                align: 'center',
                width: '1%',
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
                            <SettingOutlined/>
                        </Button>
                    </Dropdown>  
                ),
            },
        ]

        this.state = {
            request : [],
            filterRequest : [],
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
                workId: null, 
                userId: null, 
            }
        }   
    }

    componentDidMount = () =>{
        this.fetchAll();
    }

    fetchAll = () =>{
        const { startDate, endDate, workId, userId } = this.state.queryRequest
        const query = { startDate: formatDate(startDate, 'DD-MM-YYYY'), endDate: formatDate(endDate, 'DD-MM-YYYY'), workId, userId, }
        const { id, permissions } = localStore()
        const loginId = parseInt(id)
        const { LEAVE_REQUESTS } = JSON.parse(permissions)
        const queryParams = `startDate=${query?.startDate}&endDate=${query?.endDate}&userId=${query?.userId}&workId=${query?.workId}`

        Promise.all([ getManageProjects('LEAVE_REQUESTS'), getApprovalRequests(queryParams), getLineEmployees() ])
        .then(res => {
            this.setState({
                WORKS: res[0].success? res[0].data : [],
                loginId,
                permissions: LEAVE_REQUESTS,
                request: res[1].success? res[1].data : [],
                filterRequest: res[1].success? res[1].data : [],
                USERS: res[2].success? res[2].data : [],
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
            startDate: formatDate(startDate, 'DD-MM-YYYY') ?? undefined,
            endDate: formatDate(endDate, 'DD-MM-YYYY') ?? undefined,
            workId,
            userId,
        }
        let queryParams = ''
        if (query.startDate){
            queryParams = `startDate=${query?.startDate}&endDate=${query?.endDate}&userId=${query?.userId}&workId=${query?.workId}`
        }else{
            queryParams = `userId=${query?.userId}&workId=${query?.workId}`
        }
        getApprovalRequests(queryParams).then(res=>{
            if(res.success){
                this.setState({
                    request: res.data,
                    filterRequest: res.data,
                    readRequest: false,
                    sRequest: { // selected request 
                        request: [], //  request Object 
                        keys: [] // request keys
                    },
                })
            }
        })
    }

    requestSelect = (selectedRowKeys, selectedRows)=>{
        let cantApprove = true, cantReject = true, cantUnapprove = true
        selectedRows.forEach(el =>{
            if (el.status === 'SB'){
                cantApprove = false
            }
            if(el.status === 'SB'){
                cantReject = false
            }
            if(el.status === 'AP'){
                cantUnapprove = false
            }
        })
        this.setState({
            sRequest: {
                request: selectedRows,
                keys: selectedRowKeys,
                cantApprove,
                cantReject,
                cantUnapprove
            }
        })
    }

    // manageRequests = (manage, notes) =>{
    //     const { keys } = this.state.sRequest
    //     const data = {leaveRequests: keys, note: notes}
    //     manageLeaveRequests(manage, data).then(res=>{
    //         if(res.success){
    //             this.getData();
    //         }
    //     })
    // }

    onActionFinished = (notes, manage) => {
        const { keys } = this.state.sRequest
        const data = {leaveRequests: keys, note: notes}
        manageLeaveRequests(manage, data).then(res=>{
            if(res.success){
                this.getData();
            }
            modal.destroy();
        })
    }

    multiAction = (manage)=> {
        let content = <Row>
            <Col span="24">
                <Title level={5}>Notes</Title>
            </Col>
            <Col span="24">
                <Form  id={'my-form' } onFinish={(value)=> this.onActionFinished(value.notes, manage)} >
                    <Form.Item noStyle name={'notes'} >
                        <Input.TextArea
                            placeholder="Enter Your Notes...."
                            autoSize={{ minRows: 3, maxRows: 10 }}
                            allowClear
                        />
                        </Form.Item>
                </Form>
            </Col>
        </Row>
        modal = Modal.confirm({
          title: manage=== 'leaveRequestsReject' ? 'Reject Leave Requests' : 'Approve Leave Requests',
          icon: manage=== 'leaveRequestsReject' ? <ExclamationCircleOutlined style={{color: 'red' }} /> : <CheckCircleOutlined style={{color: 'green' }}/>,
          content: content,
          okButtonProps: { htmlType: 'submit', form: 'my-form'  },
          okText: 'Okay',
          cancelText: 'Cancel',
        });
    }

    closeModal = () =>{
        this.setState({
            openModal: false,
            readRequest: false
        })
    }

    generalFilter = (value) =>{
        const { request } = this.state
        if (value){
            this.setState({
                filterRequest: request.filter(el => {
                    return `${el.employeeName??''}`.toLowerCase().includes(value.toLowerCase()) || 
                    `${el.project??''}`.toLowerCase().includes(value.toLowerCase()) || 
                    `${el.leaveRequestName??''}`.toLowerCase().includes(value.toLowerCase()) || 
                    `${formatDate(el.startDate)??''}`.toLowerCase().includes(value.toLowerCase()) ||
                    `${formatDate(el.endDate)??''}`.toLowerCase().includes(value.toLowerCase()) ||
                    `${formatDate(el.submittedAt)??''}`.toLowerCase().includes(value.toLowerCase()) ||
                    `${R_STATUS[el.status]}`.toLowerCase().includes(value.toLowerCase())
                })
            })
        }else{
            this.setState({
                filterData: request
            })
        }
    }

    render(){
        const { request, filterRequest, sRequest, openModal, readRequest, queryRequest, WORKS, USERS, permissions} = this.state;
        const { startDate, endDate, workId, userId } = queryRequest
        return(
            <>
                <Row justify="space-between">
                    <Col >
                        <Title level={3}>Approve Requests</Title>
                    </Col>
                    <Col>
                        <Select
                            placeholder="Select Project"
                            style={{ width: 250 }}
                            options={WORKS}
                            value={workId}     
                            allowClear      
                            showSearch
                            optionFilterProp={["label", "value"]}
                            filterOption={
                                (input, option) =>{
                                    const label = option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    const value = option.value.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        return label || value
                                }
                            }
                            onChange={(value, option)=>{
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
                            allowClear
                            placeholder="Select User"
                            options={USERS}
                            value={userId}           
                            style={{ width: 250 }}
                            showSearch
                            optionFilterProp={["label", "value"]}
                            filterOption={
                                (input, option) =>{
                                    const label = option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    const value = option.value.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        return label || value
                                }
                            }
                            onChange={(value, option)=>{
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
                            mode="month"
                            picker="month"
                            format="MMM-YYYY"
                            value={startDate}
                            onChange={(value)=>{
                                console.log(value);
                                this.setState({
                                    queryRequest : {
                                        ...queryRequest,
                                        startDate: value && moment(value).startOf("month"),
                                        endDate: value && moment(value).endOf("month") 
                                    }
                                },()=>{
                                    this.getData()
                                })
                            }}
                        />
                    </Col>
                    
                    <Col span={24}>
                        <Table
                            title={()=>tableTitleFilter(5, this.generalFilter)}
                            rowSelection={{
                                selectedRowKeys: sRequest.keys,
                                onChange:(selectedRowKeys, selectedRows)=>{this.requestSelect(selectedRowKeys, selectedRows )},
                                getCheckboxProps: (record) => ({
                                    disabled: (record.status === 'SV' || record.status === 'RJ'  ||record.status === 'NC') || (!permissions['UNAPPROVAL'] && record.status === 'AP')
                                }),
                            }}
                            scroll={{
                                // x: "calc(700px + 100%)",
                                x: "'max-content'",
                            }}
                            pagination={{pageSize: localStore().pageSize}}
                            bordered
                            rowKey={(data) => data.id} 
                            columns={this.requestColumns}
                            dataSource={filterRequest}
                            size='small'
                        />
                    </Col>
                </Row>
                <Row justify='end' gutter={[20,200]}>
                    <Col>
                        <Button 
                            type="primary" 
                            danger
                            disabled={ sRequest.keys.length<1 || !permissions['APPROVAL'] || sRequest.cantReject}
                            onClick={()=>this.multiAction('leaveRequestsReject')}
                        > 
                            Reject
                        </Button>
                    </Col>
                    <Col>
                        <Button 
                            className="success"
                            disabled={ sRequest.keys.length<1|| !permissions['APPROVAL'] || sRequest.cantApprove}
                            onClick={()=>this.multiAction('leaveRequestsApprove')}
                        > 
                            Approve
                        </Button>
                    </Col>
                    <Col>
                        <Button 
                            className="not-success"
                            disabled={ sRequest.keys.length<1|| !permissions['UNAPPROVAL'] || sRequest.cantUnapprove}
                            onClick={()=>this.multiAction('leaveRequestsUnapprove')}
                        > 
                            Unapprove
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
                        approval={true}
                    />
                )}
            </>
        )
    }
}

export default ApproveRequest;