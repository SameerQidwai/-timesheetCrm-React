import React, { Component } from "react";
import {
    Popconfirm,
    Typography,
    Dropdown,
    Button,
    Table,
    Menu,
    Row,
    Col,
} from "antd";

import {
    PlusSquareOutlined,
    SettingOutlined,
    FilterOutlined,
    DownOutlined,
} from "@ant-design/icons"; //Icons

import { Link } from "react-router-dom";

import InfoModal from "./InfoModal";
import "../styles/table.css";

const { Title } = Typography;

class Travels extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: "Code",
                dataIndex: "key",
                key: "key",
                render: (record) => `00${record}`,
            },
            {
                title: "Employee/Contractor",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "Client Name",
                dataIndex: "client",
                key: "client",
            },
            {
                title: "Project",
                dataIndex: "project",
                key: "project",
            },
            {
                title: "Departure Date",
                dataIndex: "d_date",
                key: "d_date",
            },
            {
                title: "Arrival Date",
                dataIndex: "a_date",
                key: "a_date",
            },
            {
                title: "Destination",
                dataIndex: "destinantion",
                key: "destinantion",
            },
            {
                title: "Status",
                dataIndex: "status",
                key: "status",
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
                                        onConfirm={() =>
                                            this.handleDelete(record.key)
                                        }
                                    >
                                        Delete
                                    </Popconfirm>
                                </Menu.Item>
                                <Menu.Item
                                    onClick={() => {
                                        this.setState({
                                            infoModal: true,
                                            edit: record.key,
                                        });
                                    }}
                                >
                                    Edit
                                </Menu.Item>
                                <Menu.Item>
                                    {/* <Link
                                        to={{
                                            pathname: `/organisations/info/${record.key}`,
                                        }}
                                        className="nav-link"
                                    > */}
                                    View
                                    {/* </Link> */}
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
            edit: false, //creating Component
            data: [
                {
                    key: 1,
                    name: "Albert Einstein",
                    client: "Micheal Boltyz",
                    project: "Project A",
                    d_date: "12 Jun 2020",
                    a_date: "22 Oct 2020",
                    destinantion: "California",
                    status: "Closed",
                },
                {
                    key: 2,
                    name: "Nikola Teslo",
                    client: "Micheal Boltyz",
                    project: "Project B",
                    d_date: "12 Jun 2020",
                    a_date: "22 Oct 2020",
                    destinantion: "California",
                    status: "Expense Submitted",
                },
                {
                    key: 3,
                    name: "Jeff Hardy",
                    client: "Micheal Boltyz",
                    project: "Project A",
                    d_date: "12 Jun 2020",
                    a_date: "22 Oct 2020",
                    destinantion: "California",
                    status: "Expense Submitted",
                },
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
            edit: false,
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
        const { data, infoModal, edit } = this.state;
        const columns = this.columns;
        return (
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={4}>Travels</Title>
                    </Col>
                    <Col style={{ textAlign: "end" }} span={4}>
                        <Row justify="space-between">
                            <Col>
                                <Button type="default" size="small">
                                    {" "}
                                    <FilterOutlined />
                                    Filter
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        this.setState({ infoModal: true });
                                    }}
                                    size="small"
                                >
                                    {" "}
                                    <PlusSquareOutlined />
                                    Travels
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
                        edit={edit}
                        close={this.closeModal}
                        callBack={this.callBack}
                        rows={data.length + 1} //Just for time Being till we call the Api's to rernder data while add and edit
                    />
                )}
            </>
        );
    }
}

export default Travels;
