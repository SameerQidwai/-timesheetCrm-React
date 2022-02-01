import React, {Component} from 'react'
import { Table, Button, Row, Col, Typography, Menu, Dropdown, DatePicker} from 'antd'
import { DownOutlined, SettingOutlined, PlusSquareOutlined, FilterOutlined} from '@ant-design/icons';
import { localStore } from '../../service/constant';
import moment from "moment";
// import AddRequestModal from './Modals/AddRequestModal';

const { Title } = Typography

class ApproveRequest extends Component {
    constructor(props) {
        super(props);
        this.requestColumns = [
            {
                title: 'Resource',
                dataIndex: 'resource',
                key: 'resource',
                render:(text, records) =>(
                    <Title level={5}>{records.resource}</Title>
                ),
            },
            {
                title: 'Project',
                dataIndex: 'project',
                key: 'project',
                render:(text, records) =>(
                    <Title level={5}>{records.project}</Title>
                ),
            },
            {
                title: 'Leave Type',
                dataIndex: 'leaveType',
                key: 'leaveType',
                render:(text, records) =>(
                    <Title level={5}>{records.leaveType}</Title>
                ),
            },
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
                title: 'Submit Date',
                dataIndex: 'submitDate',
                key: 'submitDate',
                render:(text, records) =>(
                    <Title level={5}>{records.submitDate}</Title>
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
                title: 'Total Hours',
                dataIndex: 'totalHours',
                key: 'totalHours',
                render:(text, records) =>(
                    <Title level={5}>{records.totalHours}</Title>
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
                                onClick={()=>{}}
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
        this.setState({
        request: [
            {
                id: '0',
                resource: 'Name',
                project: '-',
                leaveType: 'Annual',
                startDate: '01/05/2021', 
                endDate:'02/05/2021',
                submitDate: '01/05/2021',
                status: 'Pending',
                totalHours: '4'
            },
            {
                id: '1',
                resource: 'Name',
                project: 'Project name',
                leaveType: 'Sick',
                startDate: '01/05/2021', 
                endDate:'02/05/2021',
                submitDate: '01/05/2021',
                status: 'Approved',
                totalHours: '4'
            },
            {
                id: '2',
                resource: 'Name',
                project: '-',
                leaveType: 'Annual',
                startDate: '01/05/2021', 
                endDate:'02/05/2021',
                submitDate: '01/05/2021',
                status: 'Pending',
                totalHours: '4'
            },
            {
                id: '3',
                resource: 'Name',
                project: 'Project name',
                leaveType: 'Sick',
                startDate: '01/05/2021', 
                endDate:'02/05/2021',
                submitDate: '01/05/2021',
                status: 'Rejected',
                totalHours: '4'
            },
        ]
    });
    }

    requestSelect = (selectedRowKeys, selectedRows)=>{
        this.setState({
            sRequest: {
                request: selectedRows,
                keys: selectedRowKeys
            }
        })
    }

    render(){
        const { request, sRequest } = this.state;
        return(
            <>
                <Row justify="space-between">
                    <Col span={20}>
                        <Title level={1}>APPROVE REQUESTS</Title>
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
            </>
        )
    }
}

export default ApproveRequest;