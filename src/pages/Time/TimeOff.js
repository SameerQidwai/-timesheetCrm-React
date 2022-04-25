import React, { Component } from "react";
import {
    Table,
    Menu,
    Dropdown,
    Button,
    Popconfirm,
    Row,
    Col,
    Typography,
} from "antd";
import {
    DownOutlined,
    SettingOutlined,
    PlusSquareOutlined,
    FilterOutlined,
} from "@ant-design/icons"; //Icons
// import { Link } from "react-router-dom";

import InfoModal from "./InfoModal";

import "../styles/table.css";

const { Title } = Typography;

class TimeOff extends Component {
    constructor(props) {
        super(props);
        this.contactForm = React.createRef();
        this.columns = [
            {
                title: "Type",
                dataIndex: "type",
                key: "type",
            },
            {
                title: "Descriptions",
                dataIndex: "desc",
                key: "desc",
            },
            {
                title: "Hours off",
                dataIndex: "h_off",
                key: "h_off",
            },
            {
                title: "Days Off",
                dataIndex: "d_off",
                key: "d_off",
            },
            {
                title: "Begin Date",
                dataIndex: "b_date",
                key: "b_date",
            },
            {
                title: "End Date",
                dataIndex: "e_date",
                key: "e_date",
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
                width: 115,
                render: (record) => (
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item danger>
                                    <Popconfirm
                                        title="Are you sure, you want to delete?"
                                        onConfirm={() =>
                                            this.handleDelete(record.code)
                                        }
                                    >
                                        Delete
                                    </Popconfirm>
                                </Menu.Item>
                                <Menu.Item
                                    onClick={() => {
                                        this.setState({
                                            infoModal: true,
                                            editOff: record.key,
                                        });
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

        this.col_Status = [
            {
                title: "Type",
                dataIndex: "type",
                key: "type",
            },
            {
                title: "Earned + Forwarded",
                dataIndex: "earn_f",
                key: "earn_f",
            },
            {
                title: "Consumed",
                dataIndex: "consumed",
                key: "consumed",
            },
            {
                title: "Available",
                dataIndex: "available",
                key: "available",
            },
        ];

        this.state = {
            data: [
                {
                    key: 1,
                    type: "Sick Leaves",
                    desc: "I was sick",
                    h_off: 8,
                    d_off: 1,
                    b_date: "25 Nov 2020",
                    e_date: "25 Nov 2020",
                    status: "Approved",
                },
                {
                    key: 2,
                    type: "Vacations",
                    desc: "I want to go on trip",
                    h_off: 32,
                    d_off: 4,
                    b_date: "12 Nov 2020",
                    e_date: "16 Nov 2020",
                    status: "Approved",
                },
                {
                    key: 3,
                    type: "Training",
                    desc: "I am expending my skills",
                    h_off: 8,
                    d_off: 1,
                    b_date: "10 Oct 2020",
                    e_date: "10 Oct 2020",
                    status: "Approved",
                },
            ],
            data_status: [
                {
                    key: 1,
                    type: "Sick Leaves",
                    earn_f: 60,
                    consumed: 25,
                    available: 35,
                },
                {
                    key: 2,
                    type: "Vacations",
                    earn_f: 40,
                    consumed: 32,
                    available: 8,
                },
                {
                    key: 3,
                    type: "Training",
                    earn_f: 120,
                    consumed: 96,
                    available: 24,
                },
            ],
            infoModal: false,
            editOff: false,
        };
    }

    handleDelete = (code) => {
        const dataSource = [...this.state.data];
        this.setState({
            data: dataSource.filter((item) => item.code !== code),
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

    getRecord = (data) => {
        this.setState({
            FormFields: {
                ...this.state.FormFields,
                initialValues: { obj: data },
            },
            editOff: data.key,
        });

        this.toggelModal(true);
    };

    editRecord = (obj) => {
        obj.key = this.state.editOff;
        obj.code = obj.key;
        this.state.data[obj.key - 1] = obj;

        this.setState(
            {
                data: [...this.state.data],
                mergeObj: {},
            },
            () => {
                this.toggelModal(false);
            }
        );
    };

    closeModal = () => {
        this.setState({
            infoModal: false,
            editEmp: false,
        });
    };

    render() {
        const { data, data_status, infoModal, editOff } = this.state;
        return (
            <>
                <Row gutter={[0, 100]}>
                    <Col span={24}>
                        <Row justify="space-between">
                            <Col>
                                <Title level={4}>Time Offs</Title>
                            </Col>
                            <Col style={{ textAlign: "end" }} span={4}>
                                <Row justify="space-between">
                                    <Col>
                                        <Button size="small">
                                            {" "}
                                            <FilterOutlined />
                                            Filter
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button
                                            type="primary"
                                            onClick={() => {
                                                this.setState({
                                                    infoModal: true,
                                                });
                                            }}
                                            size="small"
                                        >
                                            {" "}
                                            <PlusSquareOutlined />
                                            Add Timeoff
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={24}>
                                <Table
                                    bordered
                                    columns={this.columns}
                                    dataSource={data}
                                    size="small"
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col span={24}>
                        <Row justify="space-between">
                            <Col>
                                <Title level={4}>Time Offs Status</Title>
                            </Col>
                            <Col span={24}>
                                <Table
                                    bordered
                                    columns={this.col_Status}
                                    dataSource={data_status}
                                    size="small"
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {infoModal && (
                    <InfoModal
                        visible={infoModal}
                        editOff={editOff}
                        close={this.closeModal}
                        callBack={this.callBack}
                    />
                )}
            </>
        );
    }
}

export default TimeOff;
