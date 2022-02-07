import React, {Component} from 'react'
import { Table, Button, Row, Col, Typography, Menu, Dropdown, DatePicker, Tag} from 'antd'
import { DownOutlined, SettingOutlined, PlusSquareOutlined, FilterOutlined} from '@ant-design/icons';
import { localStore, R_STATUS, STATUS_COLOR } from '../../service/constant';
import moment from "moment";
import { getApprovalRequests } from '../../service/leaveRequest-Apis';
import AddRequestModal from './Modals/AddRequestModal';
// import AddRequestModal from './Modals/AddRequestModal';

const { Title } = Typography

class ApproveRequest extends Component {
    constructor(props) {
        super(props);
        this.requestColumns = [
            {
                title: 'Resource',
                dataIndex: 'employee',
                key: 'employee',
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
                dataIndex: 'submitBy',
                key: 'submitBy',
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
                                        viewRequest: record.id,
                                        // editIndex: index
                                    })
                                }
                            }
                            >View</Menu.Item>
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
            sRequest: { // selected request 
                request: [], //  request Object 
                keys: [] // request keys
            },
        }   
    }

    componentDidMount = () =>{
        this.getData();
    }

    getData = () =>{
        getApprovalRequests().then(res=>{
            if(res.success){
                this.setState({
                    request: res.data
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

    closeModal = () =>{
        this.setState({
            openModal: false,
            viewRequest: false
        })
    }

    render(){
        const { request, sRequest, openModal, viewRequest } = this.state;
        return(
            <>
                <Row justify="space-between">
                    <Col span={20}>
                        <Title level={4}>APPROVE REQUESTS</Title>
                    </Col>
                    <Col>
                    <DatePicker
                            size="large"
                            mode="month"
                            picker="month"
                            format="MMM-YYYY"
                            // onChange={(value)=>{
                            //     this.setState({
                            //         sheetDates : {
                            //             cMonth: value ?? moment(),
                            //             startDate: moment(value ?? moment()).startOf("month"),
                            //             endDate: moment(value ?? moment()).endOf("month")
                            //         }
                            //     },()=>{

                            //         this.getSheet()
                            //     })
                            // }}
                            defaultValue={moment()}
                        />
                    </Col>
                    
                    <Col span={24}>
                        <Table
                            rowSelection={{
                                onChange:(selectedRowKeys, selectedRows)=>{this.requestSelect(selectedRowKeys, selectedRows )},
                                getCheckboxProps: (record) => ({
                                    disabled: record.status !== 'Pending' // Column configuration not to be checked
                                }),
                            }}
                            style={{maxHeight: '40vh', overflowY: 'scroll'}}
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
                            disabled={ sRequest.keys.length<1}
                        > 
                            Reject
                        </Button>
                    </Col>
                    <Col>
                        <Button 
                            type="primary"
                            disabled={ sRequest.keys.length<1}
                        > 
                            Approve
                        </Button>
                    </Col>
                </Row>
                {openModal && (
                    <AddRequestModal
                        visible={openModal}
                        close={this.closeModal}
                        edit={viewRequest}
                        callBack={this.getData}
                    />
                )}
            </>
        )
    }
}

export default ApproveRequest;