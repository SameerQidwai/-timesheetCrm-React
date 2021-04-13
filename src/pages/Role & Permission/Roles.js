import React, { Component } from "react";
import { Table, Menu, Dropdown, Button, Popconfirm, Row, Col, Typography, Modal, } from "antd";
import {
    DownOutlined, SettingOutlined, PlusSquareOutlined, LoadingOutlined } from "@ant-design/icons"; //Icons

import Form from "../../components/Core/Form";
import "../styles/table.css";
import Permission from "./Permission";

const { Title } = Typography;

class Roles extends Component {
    constructor(props) {
        super(props);
        this.roleForm = React.createRef();
        this.columns = [
            {
                title: "Title",
                dataIndex: "title",
                key: "title",
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
                                        this.getRecord(record);
                                    }}
                                >
                                    Edit
                                </Menu.Item>
                                <Menu.Item onClick={this.callPermission}>
                                    {/* <Link to={{ pathname: '/admin/calender/holidays' ,query: record.key}} className="nav-link"> */}
                                    Permissions
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
            data: [
                {
                    key: 1,
                    title: "Admin",
                },
                {
                    key: 2,
                    title: "Team Opportunity",
                },
                {
                    key: 3,
                    title: "Project Manager",
                },
            ],
            perData: [
                {
                    key: 1,
                    category: "Skills",
                    create: true,
                    update: false,
                    read: true,
                    delete: false,
                },
                {
                    key: 2,
                    category: "Employees",
                    create: true,
                    update: true,
                    read: true,
                    delete: true,
                },
                {
                    key: 3,
                    category: "Projects",
                    create: true,
                    update: false,
                    read: true,
                    delete: false,
                },
                {
                    key: 4,
                    category: "Time Off",
                    create: true,
                    update: false,
                    read: false,
                    delete: false,
                },
                {
                    key: 5,
                    category: "Travler",
                    create: false,
                    update: true,
                    read: true,
                    delete: false,
                },
                {
                    key: 6,
                    category: "opportunity",
                    create: false,
                    update: true,
                    read: false,
                    delete: true,
                },
            ],

            openModal: false,
            editTimeoff: false,
            perModal: false,
            loading: false,
            FormFields: {
                formId: "role_form",
                justify: "center",
                FormCol: 20,
                FieldSpace: { xs: 12, sm: 16, md: 122 },
                layout: { labelCol: { span: 12 } },
                justifyField: "center",
                // FormLayout:'inline',
                size: "middle",
                fields: [
                    {
                        object: "obj",
                        fieldCol: 20,
                        layout: {
                            labelCol: { span: 4 },
                            wrapperCol: { span: 0 },
                        },
                        key: "title",
                        label: "Title",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "input",
                        labelAlign: "left",
                    },
                ],
            },
        };
    }

    toggelModal = (status) => {
        this.setState({ openModal: status });

        if (this.state.openModal) {
            this.roleForm.current.refs.role_form.resetFields(); // to reset file
            delete this.state.FormFields.initialValues; // to delete intilize if not written
            this.setState({
                // set state
                FormFields: this.state.FormFields,
                editTimeoff: false,
            });
        }
    };

    Callback = (vake) => {
        // this will work after I get the Object from the form
        if (!this.state.editTimeoff) {
            vake.obj.key = this.state.data.length + 1;
            this.setState(
                {
                    data: [...this.state.data, vake.obj],
                },
                () => {
                    this.toggelModal(false);
                    this.roleForm.current.refs.role_form.resetFields();
                    console.log("Data Rendered");
                }
            );
        } else {
            this.editRecord(vake.obj);
        }
    };

    getRecord = (data) => {
        this.setState({
            FormFields: {
                ...this.state.FormFields,
                initialValues: { obj: data },
            },
            editTimeoff: data.key,
        });

        this.toggelModal(true);
    };

    editRecord = (obj) => {
        obj.key = this.state.editTimeoff;
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

    callPermission = () => {
        this.setState({ perModal: true });
    };

    submit = () => {
        this.setState({loading: true})
        this.roleForm.current.refs.role_form.submit();
    };

    render() {
        const {data, openModal, editTimeoff, FormFields, perData, perModal, loading} = this.state;
        const columns = this.columns;
        return (
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={4}>Roles</Title>
                    </Col>
                    <Col style={{ textAlign: "end" }}>
                        <Button
                            type="primary"
                            onClick={() => {
                                this.toggelModal(true);
                            }}
                            size="small"
                        >
                            <PlusSquareOutlined />
                            Add Roles
                        </Button>
                    </Col>
                    <Col span={24}>
                        <Table
                            columns={columns}
                            dataSource={data}
                            size="small"
                        />
                    </Col>
                </Row>
                {openModal ? (
                    <Modal
                        title={ editTimeoff ? "Edit Role" : "Add New Role" }
                        maskClosable={false}
                        centered
                        visible={openModal}
                        onOk={() => {
                            this.submit();
                        }}
                        okButtonProps={{ disabled: loading }}
                        okText={loading ?<LoadingOutlined /> :"Save"}
                        onCancel={() => {
                            this.toggelModal(false);
                        }}
                        width={600}
                    >
                        <Form
                            ref={this.roleForm}
                            Callback={() => this.Callback()}
                            FormFields={FormFields}
                        />
                    </Modal>
                ) : null}
                <Permission
                    isVisible={perModal}
                    Callback={() => {
                        this.setState({ perModal: false });
                    }}
                    data={perData}
                />
            </>
        );
    }
}

export default Roles;
