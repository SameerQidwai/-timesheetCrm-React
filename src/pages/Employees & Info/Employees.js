import React, { Component } from "react";
import { Popconfirm, Typography, Dropdown, Button, Table, Menu, Row, Col, } from "antd";

import { PlusSquareOutlined, SettingOutlined, FilterOutlined, DownOutlined, } from "@ant-design/icons"; //Icons

import { Link } from "react-router-dom"; 

import InfoModal from "./Modals/InfoModal";

import { getList, delList } from "../../service/Employees";
import { localStore } from "../../service/constant";
import "../styles/table.css";
import { tableSorter } from "../../components/Core/Table/TableFilter";

const { Title } = Typography;

class Employees extends Component {
    constructor() {
        super();
        this.columns = [
            {
                title: "Code",
                dataIndex: ["contactPersonOrganization", "contactPersonId"],
                key: "contactPersonId",
                render: (record) => {
                    return `Emp-00${ record }`
                },
                ...tableSorter('contactPersonOrganization.contactPersonId', 'number', true)
            },
            {
                title: "First Name",
                dataIndex: ["contactPersonOrganization", "contactPerson", "firstName"],
                key: "firstName",
                ...tableSorter('contactPersonOrganization.contactPerson.firstName', 'string')
            },
            {
                title: "Last Name",
                dataIndex: ["contactPersonOrganization", "contactPerson", "lastName"],
                key: "lastName",
                ...tableSorter('contactPersonOrganization.contactPerson.lastName', 'string')
            },
            {
                title: "Phone",
                dataIndex: ["contactPersonOrganization", "contactPerson", "phoneNumber"],
                key: "phoneNumber",
            },
            {
                title: "Email",
                dataIndex: ["contactPersonOrganization", "contactPerson", "email"],
                key: "email",
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
                                        this.setState({ infoModal: true, editEmp: record.id, });
                                    }}
                                    disabled={this.state&& !this.state.permissions['UPDATE']}
                                >
                                    Edit
                                </Menu.Item>
                                <Menu.Item>
                                    <Link
                                        to={{
                                            pathname: `/Employees/${record.id}/info`,
                                        }}
                                        className="nav-link"
                                    >
                                        View
                                    </Link>
                                </Menu.Item>
                                <Menu.Item>
                                    <Link
                                        to={{
                                            pathname: `/Employee/${record.id}/contracts`,
                                        }}
                                        className="nav-link"
                                    >
                                        Contracts
                                    </Link>
                                </Menu.Item>
                                <Menu.Item>
                                    <Link
                                        to={{
                                            pathname: `/Employee/${record.id}/novated-lease`,
                                        }}
                                        className="nav-link"
                                    >
                                        Novated Lease
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
            permissions: {}
        };
    }

    componentDidMount = () =>{
        this.getList()
    }

    getList = () =>{
        const { USERS }= JSON.parse(localStore().permissions)
        getList().then(res=>{
            if (res.success){
                this.setState({
                    data: res.data,
                    infoModal: false,
                    editEmp: false,
                    permissions: USERS
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
        const { data, infoModal, editEmp, permissions } = this.state;
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
                                    onClick={() => { this.setState({ infoModal: true }); }}
                                    size="small"
                                    disabled={!permissions['ADD']}
                                >
                                    <PlusSquareOutlined />
                                    Employees
                                </Button>
                            </Col>
                        </Row>
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
