import React, { Component } from "react";
import { Typography, Dropdown, Button, Table, Menu, Row, Col, } from "antd";
import { PlusSquareOutlined, SettingOutlined, FilterOutlined, DownOutlined, } from "@ant-design/icons"; //Icons

import { Link } from "react-router-dom";

import InfoModal from "./Modals/InfoModal";

import { getList } from "../../service/contractors";
import { localStore } from "../../service/constant";
import "../styles/table.css";

const { Title } = Typography;

class Contractors extends Component {
    constructor() {
        super();
        this.columns = [
            {
                title: "Code",
                dataIndex: "contactPersonOrganization",
                key: "contactPersonOrganization",
                render: (record) => {
                    return record && record.contactPerson && `Sub-00${ record.contactPerson.id}`
                },
            },
            {
                title: "First Name",
                dataIndex: "contactPersonOrganization",
                key: "contactPersonOrganization",
                render: (record) =>{
                    return record && record.contactPerson && record.contactPerson.firstName
                }
            },
            {
                title: "Last Name",
                dataIndex: "contactPersonOrganization",
                key: "contactPersonOrganization",
                render: (record) =>{
                    return record && record.contactPerson && record.contactPerson.lastName
                }
            },
            {
                title: "Organisation",
                dataIndex: "contactPersonOrganization",
                key: "contactPersonOrganization",
                render: (record) =>{
                    return record && record.organization && record.organization.name
                }
            },
            {
                title: "Phone",
                dataIndex: "contactPersonOrganization",
                key: "contactPersonOrganization",
                render: (record) =>{
                    return record && record.contactPerson && record.contactPerson.phoneNumber
                }
            },
            {
                title: "Email",
                dataIndex: "contactPersonOrganization",
                key: "contactPersonOrganization",
                render: (record) =>{
                    return record && record.contactPerson && record.contactPerson.email
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
                                        this.setState({ infoModal: true, editCont: record.id, });
                                    }}
                                    disabled={this.state&& !this.state.permissions['UPDATE']}
                                >
                                    Edit
                                </Menu.Item>
                                <Menu.Item>
                                    <Link
                                        to={{
                                            pathname: `/sub-contractors/${record.id}/info`,
                                        }}
                                        className="nav-link"
                                    >
                                        View
                                    </Link>
                                </Menu.Item>
                                <Menu.Item>
                                    <Link
                                        to={{
                                            pathname: `/sub-contractors/${record.id}/contracts`,
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
            editCont: false,
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
                    editCont: false,
                    permissions: USERS
                })
            }
        })
    }
    
    callBack = () => {
        this.getList()
    };


    handleDelete = (code) => {
        const dataSource = [...this.state.data];
        this.setState({
            data: dataSource.filter((item) => item.code !== code),
        });
    };

    closeModal = () => {
        this.setState({
            infoModal: false,
            editCont: false,
        });
    };

    render() {
        const { data, infoModal, editCont, permissions } = this.state;
        const columns = this.columns;
        return (
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={4}>Contractors</Title>
                    </Col>
                    <Col style={{ textAlign: "end" }} span={4}>
                        <Row justify="space-between">
                            <Col>
                                <Button type="default" size="small">
                                    <FilterOutlined />
                                    Filter
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    type="primary"
                                    onClick={() => { this.setState({ infoModal: true }); }}
                                    size="small"
                                    disabled={!permissions['ADD']}
                                >
                                    <PlusSquareOutlined />
                                    Contactors
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={24}>
                        <Table
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
                        editCont={editCont}
                        close={this.closeModal}
                        callBack={this.callBack}
                    />
                )}
            </>
        );
    }
}

export default Contractors;
