import React, { Component } from "react";
import { Table, Menu, Dropdown, Button, Popconfirm, Row, Col, Typography, Modal, } from "antd";
import { DownOutlined, SettingOutlined, PlusSquareOutlined, } from "@ant-design/icons"; //Icons
import { Link } from "react-router-dom";

import Form from "../../../components/Core/Form";
import { getList, addList, delLabel, editLabel } from "../../../service/panel";

import "../../styles/table.css";

const { Title } = Typography;

class Panels extends Component {
    constructor(props) {
        super(props);
        this.dynamoForm = React.createRef();

        this.columns = [
            {
                title: "Name",
                dataIndex: "label",
                key: "label",
            },
            // {
            //     title: "Contact",
            //     dataIndex: "contact",
            //     key: "contact",
            // },
            {
                title: "Action",
                key: "action",
                align: "right",
                render: (text, record) => (
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
                                    onClick={() => this.getRecord(record)}
                                >
                                    Edit
                                </Menu.Item>
                                <Menu.Item>
                                    <Link
                                        to={{
                                            pathname: `/admin/panels/skills/${record.id}`,
                                        }}
                                    >
                                        Skills
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
            data: [],
            openModal: false,
            editPanel: false,
            FormFields: {
                formId: "time_off",
                justify: "center",
                FormCol: 20,
                // FieldSpace: { xs: 12, sm: 16, md: 122},
                layout: { labelCol: { span: 6 } },
                justifyField: "center",
                // FormLayout:'inline',
                size: "middle",
                fields: [
                    {
                        object: "obj",
                        fieldCol: 24,
                        key: "label",
                        label: "Name",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "input",
                        labelAlign: "right",
                    },
                    // {
                    //     object: "obj",
                    //     fieldCol: 24,
                    //     key: "contact",
                    //     label: "Contact",
                    //     size: "small",
                    //     // rules:[{ required: true }],
                    //     type: "input",
                    //     labelAlign: "right",
                    // },
                ],
            },
        };
    }

    componentDidMount = () => {
        this.getData();
    };

    getData = () => {
        getList().then((res) => {
            if (res.success) {
                this.setState({
                    data: res.data,
                    FormFields: { ...this.state.FormFields, initialValues: {} },
                    openModal: false,
                    editPanel: false,
                });
            }
        });
    };

    handleDelete = (id) => {
        delLabel(id).then((res) => {
            if (res) {
                this.getData();
            }
        });
    };

    toggelModal = (status) => {
        if (status) {
            this.setState({ openModal: status });
        } else {
            this.setState({
                // set state
                FormFields: { ...this.state.FormFields, initialValues: {} },
                openModal: status,
                editPanel: false,
            });
        }
    };

    submit = () => {
        this.dynamoForm.current.refs.time_off.submit();
    };

    Callback = (vake) => {
        // this will work after I get the Object from the form
        if (!this.state.editPanel) {
            // to add new datas
            this.addType(vake.obj);
        } else {
            // to edit pervoius data
            this.editRecord(vake.obj);
        }
    };

    addType = (value) => {
        addList(value).then((res) => {
            if (res) {
                this.getData();
            }
        });
    };

    getRecord = (data) => {
        console.log(data);
        const obj = {
            id: data.id,
            label: data.label,
        };
        this.setState({
            FormFields: {
                ...this.state.FormFields,
                initialValues: { obj: obj },
            },
            editPanel: obj.id,
            openModal: true,
        });
    };

    editRecord = (obj) => {
        const { editPanel } = this.state;
        obj.id = editPanel;
        editLabel(obj).then((res) => {
            if (res) {
                this.getData();
            }
        });
    };

    render() {
        const data = this.state.data;
        const columns = this.columns;
        return (
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={4}>Panels</Title>
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
                            Add Panels
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
                {this.state.openModal ? (
                    <Modal
                        title={
                            this.state.editPanel
                                ? "Edit Panel"
                                : "Add New Panel"
                        }
                        centered
                        visible={this.state.openModal}
                        onOk={() => {
                            this.submit();
                        }}
                        okText={"Save"}
                        onCancel={() => {
                            this.toggelModal(false);
                        }}
                        width={400}
                    >
                        <Form
                            ref={this.dynamoForm}
                            Callback={this.Callback}
                            FormFields={this.state.FormFields}
                        />
                    </Modal>
                ) : null}
            </>
        );
    }
}

export default Panels;
