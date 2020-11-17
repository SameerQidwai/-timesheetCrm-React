import React, { Component } from "react";
import {
    Row,
    Col,
    Menu,
    Table,
    Modal,
    Button,
    Dropdown,
    Popconfirm,
    Typography,
} from "antd";
import {
    DownOutlined,
    SettingOutlined,
    PlusSquareOutlined,
    FilterOutlined,
    UploadOutlined,
} from "@ant-design/icons"; //Icons
// import { Link } from 'react-router-dom'

import Form from "../../components/Core/Form";
import "../styles/table.css";

const { Title } = Typography;

class Contact extends Component {
    constructor(props) {
        super(props);
        this.contactForm = React.createRef();
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
                title: "Organization",
                dataIndex: "org",
                key: "org",
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
                                            this.handleDelete(record.code)
                                        }
                                    >
                                        Delete
                                    </Popconfirm>
                                </Menu.Item>
                                <Menu.Item>Edit</Menu.Item>
                                <Menu.Item>
                                    {/* <Link to={{ pathname: '/admin/calender/holidays' ,query: record.key}} className="nav-link"> */}
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
            data: [
                {
                    key: 1,
                    org: "One_LM",
                    name: "Micheal Boltz",
                    email: "m.boltz@gmail.com",
                },
                {
                    key: 2,
                    org: "Org A",
                    name: "Bob Tuner",
                    email: "b.tuner@gmail.com",
                },
                {
                    key: 3,
                    org: "Org B",
                    name: "Richard Tim",
                    email: "r.tim@gmail.com",
                },
            ],
            openModal: false,
            editContact: false,
            FormFields: {
                formId: "contact_form",
                justify: "center",
                FormCol: 24,
                FieldSpace: { xs: 12, sm: 16, md: 122 },
                layout: { labelCol: { span: 12 } },
                justifyField: "center",
                FormLayout: "inline",
                size: "middle",
                fields: [
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "contactName",
                        label: "Name",
                        size: "small",
                        // wrapperCol: { span: 19 },
                        // rules:[{ required: true }],
                        type: "input",
                        labelAlign: "right",
                        itemStyle: { marginBottom: "10px" },
                        fieldStyle: { marginLeft: "13px" },
                        // labelCol:{flex:1},
                        // wrapperCol:{flex:'auto'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "contact",
                        label: "Mobile",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "input",
                        labelAlign: "right",
                        itemStyle: { marginBottom: "10px" },
                        // labelCol:{flex:1},
                        // wrapperCol:{flex:'auto'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "email",
                        label: "Email",
                        size: "small",
                        // rules:[{ required: true }],
                        wrapperCol: { span: 20 },
                        type: "input",
                        labelAlign: "right",
                        fieldStyle: { marginLeft: "5px" },
                        // labelCol:{flex:1},
                        // wrapperCol:{flex:'auto'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "org_id",
                        label: "Ogranizaition",
                        size: "small",
                        // rules:[{ required: true }],
                        labelCol: { flex: "1px 0 auto" },
                        wrapperCol: { flex: "auto" },
                        type: "Select",
                        // labelAlign: 'right',
                        itemStyle: { marginBottom: "10px" },
                    },
                    {
                        object: "obj",
                        fieldCol: 24,
                        key: "address",
                        label: "Address",
                        size: "small",
                        type: "input",
                        itemStyle: { marginBottom: "10px" },
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "cv",
                        size: "small",
                        valuePropName: "fileList",
                        getValue: true,
                        Placeholder: (
                            <>
                                Click or drag CV <UploadOutlined />
                            </>
                        ),
                        type: "Dragger",
                        labelAlign: "right",
                        itemStyle: { marginBottom: "10px" },
                        rangMax: false,
                        mode: "",
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "resume",
                        size: "small",
                        labelCol: { span: 12 },
                        rangMax: true,
                        Placeholder: (
                            <>
                                Click or drag Cover Letter <UploadOutlined />
                            </>
                        ),
                        type: "Dragger",
                        labelAlign: "right",
                        valuePropName: "fileList",
                        getValue: true,
                        mode: "",
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "attach",
                        size: "small",
                        mode: "",
                        Placeholder: (
                            <>
                                Click or drag Other Doc <UploadOutlined />
                            </>
                        ),

                        type: "Dragger",
                        labelAlign: "right",
                        valuePropName: "fileList",
                        getValue: true,
                    },
                ],
            },
        };
    }

    handleDelete = (code) => {
        const dataSource = [...this.state.data];
        this.setState({
            data: dataSource.filter((item) => item.code !== code),
        });
    };

    toggelModal = (status) => {
        this.setState({ openModal: status });

        if (this.state.openModal) {
            this.contactForm.current.refs.contact_form.resetFields(); // to reset file
            delete this.state.FormFields.initialValues; // to delete intilize if not written
            this.setState({
                // set state
                FormFields: this.state.FormFields,
                editContact: false,
            });
        }
    };

    Callback = (vake) => {
        // this will work after I get the Object from the form
        console.log(vake);
    };

    getRecord = (data) => {
        this.setState({
            FormFields: {
                ...this.state.FormFields,
                initialValues: { obj: data },
            },
            editContact: data.key,
        });

        this.toggelModal(true);
    };

    editRecord = (obj) => {
        obj.key = this.state.editContact;
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

    submit = () => {
        this.contactForm.current.refs.contact_form.submit();
    };

    render() {
        const data = this.state.data;
        const columns = this.columns;
        return (
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={4}>Contact Persons</Title>
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
                                    size="small"
                                    onClick={() => {
                                        this.setState({
                                            openModal: true,
                                        });
                                    }}
                                >
                                    {" "}
                                    <PlusSquareOutlined />
                                    Contact Person
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
                {this.state.openModal ? (
                    <Modal
                        title={
                            this.state.editContact
                                ? "Edit Contact Person"
                                : "Add Contact Person"
                        }
                        centered
                        visible={this.state.openModal}
                        onOk={() => {
                            this.submit();
                        }}
                        okText={this.state.editContact ? "Edit" : "Save"}
                        onCancel={() => {
                            this.toggelModal(false);
                        }}
                        width={600}
                    >
                        <Form
                            ref={this.contactForm}
                            Callback={this.Callback}
                            FormFields={this.state.FormFields}
                        />
                    </Modal>
                ) : null}
            </>
        );
    }
}

export default Contact;
