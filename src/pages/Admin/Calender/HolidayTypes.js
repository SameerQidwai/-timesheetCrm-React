import React, { Component } from "react";
import {
    Typography,
    Row,
    Col,
    Popconfirm,
    Modal,
    Button,
    Table,
    Dropdown,
    Menu,
} from "antd";
import { SettingOutlined, DownOutlined } from "@ant-design/icons"; //Icons
import Forms from "../../../components/Core/Form";
const { Title } = Typography;

class HolidayTypes extends Component {
    constructor() {
        super();
        this.HalForm = React.createRef();
        this.columns = [
            {
                title: "Types",
                dataIndex: "type",
                key: "type",
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
                                <Menu.Item>
                                    <Popconfirm
                                        title="Sure to delete?"
                                        onConfirm={() =>
                                            this.handleDelete(record.key)
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
            data: [
                {
                    key: 1,
                    type: "Easter",
                },
                {
                    key: 2,
                    type: "Christmas",
                },
                {
                    key: 3,
                    type: "Eid-ul-fiter",
                },
            ],
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
                        key: "type",
                        label: "Name",
                        labelAlign: "right",
                        type: "Input",
                        size: "small",
                    },
                ],
            },
        };
    }

    handleDelete = (key) => {
        this.setState({
            data: this.state.data.filter((item) => item.key !== key),
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
        let obj = {
            type: value.type,
            key: this.state.data[this.state.data.length - 1].key + 1,
        };

        this.setState({
            data: [...this.state.data, obj],
            isVisible: false,
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
            editType: obj.key,
            isVisible: true,
        });
    };

    editRecord = (obj) => {
        const { data, FormFields } = this.state;
        obj.key = this.state.editType;
        data[obj.key - 1] = obj;
        delete FormFields.initialValues;
        this.setState({
            data,
            FormFields,
            editType: false,
            isVisible: false,
        });
    };

    render() {
        const { data } = this.state;
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
                            Add Type
                        </Button>
                    </Col>
                </Row>
                <Table columns={this.columns} dataSource={data} size="small" />
                {this.state.isVisible && (
                    <Modal
                        title={this.state.editType ? "Edit Type" : "Add Type"}
                        centered
                        visible={this.state.isVisible}
                        okText={this.state.editType ? "Edit" : "Save"}
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
