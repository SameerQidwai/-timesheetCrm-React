import React, { Component } from "react";
import { Typography, Row, Col, Popconfirm, Modal, Button, Table, Dropdown, Menu, } from "antd";
import { SettingOutlined, DownOutlined, PlusSquareOutlined, } from "@ant-design/icons"; //Icons
import Forms from "../../../components/Core/Form";

import { getList, addList, delLabel, editLabel, } from "../../../service/holiday-type";

const { Title } = Typography;

class HolidayTypes extends Component {
    constructor() {
        super();
        this.HalForm = React.createRef();
        this.columns = [
            {
                title: "Types",
                dataIndex: "label",
                key: "label",
            },
            {
                title: "Action",
                key: "action",
                align: "right",
                render: (record, text) => (
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item
                                    onClick={() => this.getRecord(record, text)}
                                >
                                    Edit
                                </Menu.Item>
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
            isVisible: false,
            newType: "",
            data: [],
            editType: false,
            FormFields: {
                formId: "type_form",
                FormCol: 20,
                FieldSpace: { xs: 12, sm: 16, md: 122 },
                // layout: { labelCol: { span: 8 } },
                FormLayout: "inline",
                size: "middle",
                fields: [
                    {
                        object: "obj",
                        fieldCol: 24,
                        key: "label",
                        label: "Name",
                        labelAlign: "right",
                        type: "Input",
                        size: "small",
                    },
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
                    isVisible: false,
                    editType: false,
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

    submit = () => {
        this.HalForm.current.refs.type_form.submit();
    };

    Callback = (value) => {
        if (!this.state.editType) {
            this.addType(value.obj);
        } else {
            this.editRecord(value.obj);
        }
    };

    addType = (value) => {
        addList(value).then((res) => {
            if (res) {
                this.HalForm.current.refs.type_form.resetFields();
                this.getData();
            }
        });
    };

    getRecord = (data) => {
        const obj = Object.assign({}, data);
        // console.log(obj);
        this.setState({
            FormFields: {
                ...this.state.FormFields,
                initialValues: { obj: obj },
            },
            editType: obj.id,
            isVisible: true,
        });
    };

    editRecord = (obj) => {
        const { editType } = this.state;
        obj.id = editType;
        editLabel(obj).then((res) => {
            if (res) {
                this.HalForm.current.refs.type_form.resetFields();
                this.getData();
            }
        });
    };

    render() {
        const { data, isVisible } = this.state;
        return (
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={3}>Holiday Types</Title>
                    </Col>
                    <Col>
                        <Button
                            type="primary"
                            size="small"
                            onClick={() => {
                                this.setState({
                                    isVisible: true, //Open Modal
                                });
                            }}
                        >
                            <PlusSquareOutlined /> Holiday Type
                        </Button>
                    </Col>
                </Row>
                <Table
                    columns={this.columns}
                    dataSource={data}
                    size="small"
                    rowKey={(data) => data.id}
                />
                {isVisible && (
                    <Modal
                        title={this.state.editType ? "Edit Type" : "Add Type"}
                        maskClosable={false}
                        centered
                        visible={isVisible}
                        okText={"Save"}
                        width={400}
                        onCancel={() => {
                            delete this.state.FormFields.initialValues; // delete initialValues of fields on close
                            this.setState({
                                isVisible: false, //close
                                FormFields: this.state.FormFields, //delete Formfields on Close
                            });
                        }}
                        onOk={() => {
                            this.submit();
                        }}
                    >
                        <Row justify="center">
                            <Forms
                                ref={this.HalForm}
                                Callback={this.Callback}
                                FormFields={this.state.FormFields}
                            />
                        </Row>
                    </Modal>
                )}
            </>
        );
    }
}

export default HolidayTypes;
