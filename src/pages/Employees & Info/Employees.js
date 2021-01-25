import React, { Component } from "react";
import { Popconfirm, Typography, Dropdown, Button, Table, Menu, Row, Col, } from "antd";

import { PlusSquareOutlined, SettingOutlined, FilterOutlined, DownOutlined, } from "@ant-design/icons"; //Icons

import { Link } from "react-router-dom"; 

import InfoModal from "./InfoModal";
import "../styles/table.css";

const { Title } = Typography;

class Employees extends Component {
    constructor() {
        super();
        this.columns = [
            {
                title: "Code",
                dataIndex: "key",
                key: "key",
                render: (record) => `00${record}`,
            },
            {
                title: "Name",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "Email",
                dataIndex: "email",
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
                                <Menu.Item danger>
                                    <Popconfirm
                                        title="Sure to delete?"
                                        onConfirm={() => this.handleDelete(record.key) }
                                    >
                                        Delete
                                    </Popconfirm>
                                </Menu.Item>
                                <Menu.Item
                                    onClick={() => {
                                        this.setState({ infoModal: true, editEmp: record.key, });
                                    }}
                                >
                                    Edit
                                </Menu.Item>
                                <Menu.Item>
                                    <Link
                                        to={{
                                            pathname: `/Employees/info/${record.key}`,
                                        }}
                                        className="nav-link"
                                    >
                                        View
                                    </Link>
                                </Menu.Item>
                                <Menu.Item>
                                    <Link
                                        to={{
                                            pathname: `/Employee/contracts/${record.key}`,
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
            data: [
                { key: 1, name: "Nair", email: "N@olm.com", },
                { key: 2, name: "Hallen", email: "H@olm.com", },
                { key: 3, name: "Gorge", email: "G@olm.com", },
            ],
        };
    }

    handleDelete = (code) => {
        const dataSource = [...this.state.data];
        this.setState({
            data: dataSource.filter((item) => item.code !== code),
        });
    };

    closeModal = () => {
        this.setState({
            infoModal: false,
            editEmp: false,
        });
    };
    callBack = (value, key) => {
        const { data } = this.state;
        if (key === false) {
            this.setState({
                data: [...data, value],
            });
        } else {
            data[key] = value;
            this.setState({
                data,
            });
        }
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
                        rows={data.length + 1} //Just for time Being till we call the Api's to rernder data while add and edit
                    />
                )}
            </>
        );
    }
}

export default Employees;
