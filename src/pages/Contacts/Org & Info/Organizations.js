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
import "../../styles/table.css";

const { Title } = Typography;

class Organizations extends Component {
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
                title: "Name",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "Parent Organization",
                dataIndex: "parent",
                key: "parent",
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
                                            editOrg: record.key,
                                        });
                                    }}
                                >
                                    Edit
                                </Menu.Item>
                                <Menu.Item>
                                    <Link
                                        to={{
                                            pathname: `/organizations/info/${record.key}`,
                                        }}
                                        className="nav-link"
                                    >
                                        View
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
            editOrg: false, //creating Component
            data: [
                {
                    key: 1,
                    name: "One_LM",
                    // ABN: "098908", //creating Component
                    // CTI: "09809",
                    // EBA: "098098",
                    // SumIns_PI: 98098,
                    // SumIns_PL: 90809809,
                    // SumIns_Wc: "10 30 2020",
                    // Tax_Code: "09809809",
                    // address: "098098098",
                    // contact: "9809809",
                    // contactName: "90809809",
                    // email: "098908",
                    // expiry_PI: "10 06 2020",
                    // expiry_PL: "10 30 2020",
                    // insurer_PI: "908908",
                    // insurer_PL: "980980",
                    // insurer_WC: "98098",
                    // invoice_email: "9098",
                    // phone: "908098",
                    // policy_PI: "098098",
                    // policy_PL: "098098",
                    // policy_WC: "9809809",
                    // website: "098098098",
                },
                {
                    key: 2,
                    name: "Org A",
                    parent: "One_LM",
                },
                {
                    key: 3,
                    name: "Org B",
                    parent: "Org A",
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
            editOrg: false,
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
        const { data, infoModal, editOrg } = this.state;
        const columns = this.columns;
        return (
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={4}>Organizations</Title>
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
                                    Organizations
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
                        editOrg={editOrg}
                        close={this.closeModal}
                        callBack={this.callBack}
                        rows={data.length + 1} //Just for time Being till we call the Api's to rernder data while add and edit
                    />
                )}
            </>
        );
    }
}

export default Organizations;
