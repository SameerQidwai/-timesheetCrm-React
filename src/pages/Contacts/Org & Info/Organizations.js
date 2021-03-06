import React, { Component } from "react";
import { Popconfirm, Typography, Dropdown, Button, Table, Menu, Row, Col, } from "antd";
import { PlusSquareOutlined, SettingOutlined, FilterOutlined, DownOutlined, } from "@ant-design/icons"; //Icons
import { Link } from "react-router-dom";

import InfoModal from "./InfoModal";
import { getList, delOrg } from "../../../service/Organizations";

import "../../styles/table.css";

const { Title } = Typography;

class Organizations extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: "Code",
                dataIndex: "id",
                key: "id",
                render: (record) => `00${record}`,
            },
            {
                title: "Name",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "Parent Organisation",
                dataIndex: "parentOrganization",
                key: "parentOrganization",
                render: (record) => { if (record) {return record.name} }
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
                                        onConfirm={() => this.handleDelete(record.id) }
                                    >Delete</Popconfirm>
                                </Menu.Item>
                                <Menu.Item
                                    onClick={() => { this.setState({ infoModal: true, editOrg: record.id }); }}
                                >Edit </Menu.Item>
                                <Menu.Item>
                                    <Link
                                        to={{ pathname: `/organisations/info/${record.id}`, }}
                                        className="nav-link"
                                    >View </Link>
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
            data: [],
        };
    }
    
    componentDidMount = () =>{
        this.getData()
    }

    getData = () => {
        getList().then((res) => {
            if (res.success) {
                this.setState({
                    data: res.data,
                    infoModal: false,
                    editOrg: false,
                });
            }
        });
    };

    handleDelete = (id) => {
        delOrg(id).then((res) => {
            if (res.success) {
                this.getData();
            }
        });
    };

    closeModal = () => {
        this.setState({
            infoModal: false,
            editOrg: false,
        });
    };
    callBack = () => {
        this.getData()
    };

    render() {
        const { data, infoModal, editOrg } = this.state;
        const columns = this.columns;
        return (
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={4}>Organisations</Title>
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
                                >
                                    <PlusSquareOutlined />
                                    Organisations
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
                        editOrg={editOrg}
                        close={this.closeModal}
                        callBack={this.callBack}
                    />
                )}
            </>
        );
    }
}

export default Organizations;
