import React, { Component } from "react";
import { Row, Col, Menu, Table, Modal, Button, Dropdown, Popconfirm, Typography, } from "antd";
import { DownOutlined, SettingOutlined, PlusSquareOutlined, FilterOutlined, UploadOutlined, } from "@ant-design/icons"; //Icons
// import { Link } from 'react-router-dom'

import InfoModal from "./InfoModal";
import { getList, delList } from "../../../service/conatct-person";

import "../../styles/table.css";

const { Title } = Typography;

class Contact extends Component {
    constructor(props) {
        super(props);
        this.contactForm = React.createRef();
        
        this.columns = [
            {
                title: "Code",
                dataIndex: "id",
                key: "id",
                render: (record) => `00${record}`,
            },
            {
                title: "First Name",
                dataIndex: "firstName",
                key: "firstName",
            },
            {
                title: "Last Name",
                dataIndex: "lastName",
                key: "lastName",
            },
            {
                title: "Email",
                dataIndex: "email",
                key: "email",
            },
            {
                title: "Contact",
                dataIndex: "phoneNumber",
                key: "phoneNumber",
            },
            // {
            //     title: "Organization",
            //     render: (record) => {
            //         const value = record.contactPersonOrganizations
            //         console.log(value[value.length-1])
            //     },
            // },
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
                                            this.handleDelete(record.id)
                                        }
                                    >
                                        Delete
                                    </Popconfirm>
                                </Menu.Item>
                                <Menu.Item
                                    onClick={() => { this.setState({ openModal: true, editCP: record.id }); }}
                                >Edit</Menu.Item>
                                {/* <Menu.Item> */}
                                    {/* <Link to={{ pathname: '/admin/calender/holidays' ,query: record.key}} className="nav-link"> */}
                                    {/* View */}
                                    {/* </Link> */}
                                {/* </Menu.Item> */}
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
            data: [],
            openModal: false,
            editCP: false,
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
                    openModal: false,
                    editCP: false,
                });
            }
        });
    };

    handleDelete = (id) => {
        delList(id).then((res) => {
            if (res.success) {
                this.getData();
            }
        });
    };

    toggelModal = (status) => {
        this.setState({ openModal: status });
    };

    Callback = () => {
        this.getData()
    };

    submit = () => {
        this.contactForm.current.refs.contact_form.submit();
    };

    render() {
        const {data, openModal, editCP} = this.state;
        const columns = this.columns;
        return (
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={4}>Contact Persons</Title>
                    </Col>
                    <Col style={{ textAlign: "end" }} span={12}>
                        <Row justify="end">
                            <Col>
                                <Button type="default" size="small">
                                    <FilterOutlined />
                                    Filter
                                </Button>
                            </Col>
                            <Col offset={1}>
                                <Button
                                    type="primary"
                                    size="small"
                                    onClick={() => { this.setState({ openModal: true, }); }}
                                >
                                    <PlusSquareOutlined />
                                    Contact Person
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
                {openModal && (
                    <InfoModal
                        visible={openModal}
                        editCP={editCP}
                        close={this.toggelModal}
                        callBack={this.Callback}
                    />
                )}

            </>
        );
    }
}

export default Contact;
