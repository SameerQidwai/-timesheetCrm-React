import React, { Component } from "react";
import { Typography, Dropdown, Button, Table, Menu, Row, Col, Descriptions, Popconfirm, } from "antd";
import { PlusSquareOutlined, SettingOutlined, DownOutlined, } from "@ant-design/icons"; //Icons
import moment from 'moment'
import LeaseModal from "./Modals/LeaseModal";

import { getRecord as empRecord } from "../../service/Employees";
import { getList, delList } from "../../service/employee-leases";

import "../styles/table.css";
import { formatDate, formatCurrency, localStore } from "../../service/constant";
import { tableSorter, tableTitleFilter } from "../../components/Core/Table/TableFilter";
import { generalDelete } from "../../service/delete-Api's";

const { Title } = Typography;
const { Item } = Descriptions;

class NovatedLease extends Component {
    constructor() {
        super();
        this.columns = [
            {
                title: "Company Name",
                dataIndex: "companyName",
                key: "companyName",
                ...tableSorter('companyName', 'string')
            },
            {
                title: "Financer Name",
                dataIndex: "financerName",
                key: "financerName",
                ...tableSorter('financerName', 'string')
            },
            {
                title: "Finance Amount",
                dataIndex: "financedAmount",
                key: "financedAmount",
                render: record => `${formatCurrency(record)}` ,
                ...tableSorter('financedAmount', 'number'),
            },
            {
                title: "Start Date",
                dataIndex: "startDate",
                key: "startDate",
                render: (record) =>( record && formatDate(record)),
                ...tableSorter('startDate', 'date'),
            },
            {
                title: "End Date",
                dataIndex: "endDate",
                key: "endDate",
                render: (record) =>( record && formatDate(record)),
                ...tableSorter('endDate', 'date'),
            },
            {
                title: "Action",
                key: "id",
                dataIndex: "id",
                align: "right",
                width: 115,
                render: (value, record, index) => (
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item danger>
                                    <Popconfirm
                                        title="Are you sure, you want to delete?"
                                        onConfirm={() => this.handleDelete(value, index) }
                                    >
                                        Delete
                                    </Popconfirm>
                                </Menu.Item>
                                <Menu.Item
                                    onClick={() => {
                                        this.setState({ infoModal: true, editLease: value, });
                                    }}
                                >
                                    Edit
                                </Menu.Item>
                            </Menu>
                        }
                    >
                        <Button size="small">
                            <SettingOutlined /> Option <DownOutlined />
                        </Button>
                    </Dropdown>
                ),
            },
        ];

        this.state = {
            infoModal: false,
            empId: false,
            data: [],
            employee: {},
            editLease: false,
            openSearch: false,
            filterData: [],
        };
    }

    componentDidMount = () =>{
        const { id } = this.props.match.params
        this.fetchAll(id)
    }

    fetchAll = (id) =>{
        Promise.all([ getList(id), empRecord(id) ])
        .then(res => {
            this.setState({
                data: res[0].data,
                filterData: res[0].data,
                employee: res[1].basic? res[1].basic: {},
                infoModal: false,
                empId: id,
                editLease: false
            })
        })
        .catch(e => {
            console.log(e);
        })
    }

    getList = () =>{
        const { empId } = this.state
        getList(empId).then(res =>{
            this.setState({
                data: res.data,
                filterData: res.data,
                infoModal: false,
                editLease: false
            })
        })
    }

    handleDelete = (id, index) => {
        console.log({id, index});
        const { empId } = this.state
        const url = `/employees/${empId}/leases`
        const { data, filterData } = this.state
        const { history } = this.props
        generalDelete(history, url, id, index, filterData, data).then(res =>{
            console.log(res);
            if (res.success){
                this.setState({
                    data: [...res.data],
                    filterData: [...res.filterData]
                })
            }
        })
    };

    closeModal = () => {
        this.setState({ infoModal: false, editLease: false });
    };
    
    callBack = (add) => {
        this.getList()
    };

    generalFilter = (value) =>{
        const { data } = this.state
        if (value){
            this.setState({
                filterData: data.filter(el => {
                    return `${el.companyName ?? ''}`.toLowerCase().includes(value.toLowerCase()) ||
                    `${el.financerName ?? ''}`.toLowerCase().includes(value.toLowerCase()) ||
                    el.startDate && `${formatDate(el.startDate)}`.toLowerCase().includes(value.toLowerCase()) ||
                    el.endDate && `${formatDate(el.endDate)}`.toLowerCase().includes(value.toLowerCase()) ||
                    `${el.financedAmount ?? ''}`.toLowerCase().includes(value.toLowerCase()) 
                })
            })
        }else{
            this.setState({
                filterData: data
            })
        }
    }

    render() {
        const { data, infoModal, empId, employee, editLease, filterData } = this.state;
        const columns = this.columns;
        return (
            <>
            <Descriptions
                title="Employee Information"
                size="small"
                bordered
                layout="horizontal"
            >
                    <Item label="First Name">{employee.firstName}</Item>
                    <Item label="Last Name">{employee.lastName}</Item>
                    <Item label="Phone">{employee.phoneNumber} </Item>
                    <Item label="Email">{employee.email}</Item>
                    <Item label="Address">{employee.address}</Item>
                    <Item label="Date Of Birth">{employee.dateOfBirth ? moment(employee.dateOfBirth).format('DD MM YYYY'): null}</Item>
                    <Item label="Gender">{employee.gender}</Item>
                </Descriptions>
                <Row justify="space-between" style={{paddingTop: 30}}>
                    <Col>
                        <Title level={4}>Novated Lease</Title>
                    </Col>
                    <Col >
                        <Button
                            type="primary"
                            onClick={() => { this.setState({ infoModal: true, editLease: false }); }}
                            size="small"
                        >
                            <PlusSquareOutlined />
                             Novated Lease
                        </Button>
                    </Col>
                    <Col span={24}>
                        <Table
                            title={()=>tableTitleFilter(5, this.generalFilter)}
                            bordered
                            pagination={{pageSize: localStore().pageSize}}
                            rowKey={(data) => data.id}
                            columns={columns}
                            dataSource={filterData}
                            size="small"
                        />
                    </Col>
                </Row>
                {infoModal && (
                    <LeaseModal
                        visible={infoModal}
                        empId={empId}
                        editLease={editLease}
                        close={this.closeModal}
                        callBack={this.callBack}
                    />
                )}
            </>
        );
    }
}

export default NovatedLease;
