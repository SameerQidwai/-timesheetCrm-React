import React, { Component } from "react";
import { Typography, Dropdown, Button, Table, Menu, Row, Col, Descriptions, Popconfirm, } from "antd";
import { PlusSquareOutlined, SettingOutlined, DownOutlined, } from "@ant-design/icons"; //Icons
import moment from 'moment'
import LeaseModal from "./Modals/LeaseModal";

import { getRecord as empRecord } from "../../service/Employees";
import { getList, delList } from "../../service/employee-leases";

import "../styles/table.css";
import { fomratDate, formatCurrency, localStore } from "../../service/constant";

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
                sorter: (a, b) => a.companyName.localeCompare(b.companyName)
            },
            {
                title: "Financer Name",
                dataIndex: "financerName",
                key: "financerName",
                sorter: (a, b) => a.financerName.localeCompare(b.financerName)
            },
            {
                title: "Finance Amount",
                dataIndex: "financedAmount",
                key: "financedAmount",
                render: record => `${formatCurrency(record)}` ,
                sorter: (a, b) => a.financedAmount - b.financedAmount
            },
            {
                title: "Start Date",
                dataIndex: "startDate",
                key: "startDate",
                render: (record) =>( record && fomratDate(record)),
                sorter: (a, b) => moment(a.startDate).unix() - moment(b.startDate).unix()
            },
            {
                title: "End Date",
                dataIndex: "endDate",
                key: "endDate",
                render: (record) =>( record && fomratDate(record)),
                sorter: (a, b) => moment(a.endDate).unix() - moment(b.endDate).unix()
            },
            {
                title: "Action",
                key: "id",
                dataIndex: "id",
                align: "right",
                width: 115,
                render: (record) => (
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item danger>
                                    <Popconfirm
                                        title="Sure to delete?"
                                        onConfirm={() => this.handleDelete(record) }
                                    >
                                        Delete
                                    </Popconfirm>
                                </Menu.Item>
                                <Menu.Item
                                    onClick={() => {
                                        this.setState({ infoModal: true, editLease: record, });
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
            editLease: false
        };
    }

    componentDidMount = () =>{
        const { id } = this.props.match.params
        this.fetchAll(id)
    }

    fetchAll = (id) =>{
        Promise.all([ getList(id), empRecord(id) ])
        .then(res => {
            console.log(res[0].data);
            this.setState({
                data: res[0].data,
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
                infoModal: false,
                editLease: false
            })
        })
    }

    handleDelete = (id) => {
        console.log(id);
        const { empId } = this.state
        delList(empId, id).then((res) => {
            if (res.success) {
                this.getList();
            }
        });
    };

    closeModal = () => {
        this.setState({ infoModal: false, editLease: false });
    };
    
    callBack = (add) => {
        this.getList()
    };

    render() {
        const { data, infoModal, empId, employee, editLease } = this.state;
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
                            bordered
                            pagination={{pageSize: localStore().pageSize}}
                            rowKey={(data) => data.id}
                            columns={columns}
                            dataSource={data}
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
