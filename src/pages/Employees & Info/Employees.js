import React, { Component } from "react";
import { Popconfirm, Typography, Dropdown, Button, Table, Menu, Row, Col, } from "antd";

import { PlusSquareOutlined, SettingOutlined, FilterOutlined, DownOutlined, } from "@ant-design/icons"; //Icons

import { Link } from "react-router-dom"; 

import InfoModal from "./InfoModal";

import { getList, delList } from "../../service/Employees";

import "../styles/table.css";

const { Title } = Typography;

class Employees extends Component {
    constructor() {
        super();
        this.columns = [
            {
                title: "Code",
                dataIndex: "contactPersonOrganization",
                key: "contactPersonOrganization",
                render: (record) => {
                    return `Emp-00${ record && record.contactPersonId}`
                },
            },
            {
                title: "First Name",
                dataIndex: "contactPersonOrganization",
                key: "contactPersonOrganization",
                render: (record) =>{
                    return record && record.contactPerson.firstName
                }
            },
            {
                title: "Last Name",
                dataIndex: "contactPersonOrganization",
                key: "contactPersonOrganization",
                render: (record) =>{
                    return record && record.contactPerson.lastName
                }
            },
            {
                title: "Phone",
                dataIndex: "contactPersonOrganization",
                key: "contactPersonOrganization",
                render: (record) =>{
                    return record && record.contactPerson.phoneNumber
                }
            },
            {
                title: "Email",
                dataIndex: "contactPersonOrganization",
                key: "contactPersonOrganization",
                render: (record) =>{
                    return record && record.contactPerson.email
                }
            },
            {
                title: "Action",
                key: "action",
                align: "right",
                render: (record) => (
                    <Dropdown
                        overlay={
                            <Menu>
                                {/* <Menu.Item danger>
                                    <Popconfirm
                                        title="Sure to delete?"
                                        onConfirm={() => this.handleDelete(record.id) }
                                    >
                                        Delete
                                    </Popconfirm>
                                </Menu.Item> */}
                                <Menu.Item
                                    onClick={() => {
                                        console.log(record.id);
                                        this.setState({ infoModal: true, editEmp: record.id, });
                                    }}
                                >
                                    Edit
                                </Menu.Item>
                                <Menu.Item>
                                    <Link
                                        to={{
                                            pathname: `/Employees/info/${record.id}`,
                                        }}
                                        className="nav-link"
                                    >
                                        View
                                    </Link>
                                </Menu.Item>
                                <Menu.Item>
                                    <Link
                                        to={{
                                            pathname: `/Employee/contracts/${record.id}`,
                                        }}
                                        className="nav-link"
                                    >
                                        Contracts
                                    </Link>
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
            editEmp: false,
            data: [],
        };
    }

    componentDidMount = () =>{
        this.getList()
    }

    getList = () =>{
        getList().then(res=>{
            if (res.success){
                console.log(res.data);
                this.setState({
                    data: res.data,
                    infoModal: false,
                    editEmp: false,
                })
            }
        })
    }

    handleDelete = (id) => {
        delList(id).then((res) => {
            if (res.success) {
                this.getList();
            }
        });
    };

    closeModal = () => {
        this.setState({ infoModal: false, editEmp: false, });
    };
    
    callBack = (value) => {
        // const { data, editEmp } = this.state;
        this.getList()
    };

    render() {
        const { data, infoModal, editEmp } = this.state;
        const columns = this.columns;
        return (
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={4}>Employees</Title>
                    </Col>
                    <Col style={{ textAlign: "end" }} span={4}>
                        <Row justify="space-between">
                            <Col>
                                <Button type="default" size="small"> <FilterOutlined /> Filter </Button>
                            </Col>
                            <Col>
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        this.setState({ infoModal: true });
                                    }}
                                    size="small"
                                >
                                    <PlusSquareOutlined />
                                    Employees
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={24}>
                        <Table
                            rowKey={(data) => data.id}
                            columns={columns}
                            dataSource={data}
                            size="small"
                        />
                    </Col>
                </Row>
                {infoModal && (
                    <InfoModal
                        visible={infoModal}
                        editEmp={editEmp}
                        close={this.closeModal}
                        callBack={this.callBack}
                    />
                )}
            </>
        );
    }
}

export default Employees;
