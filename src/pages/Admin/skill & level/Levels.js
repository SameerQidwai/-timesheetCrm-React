import React, { Component } from "react";
import { Typography, Row, Col, Popconfirm, Modal, Button, Table, Dropdown, Menu, } from "antd";
import { SettingOutlined, DownOutlined, PlusSquareOutlined, LoadingOutlined} from "@ant-design/icons"; //Icons
import Forms from "../../../components/Core/Form";

import { getList, addList, delLabel, editLabel } from "../../../service/level";

const { Title } = Typography;

class Levels extends Component {
    constructor() {
        super();
        this.levelForm = React.createRef();
        this.columns = [
            {
                title: "Level Name",
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
                                <Menu.Item>
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
            newSkill: "",
            data: [],
            editLevel: false,
            loading: false,
            FormFields: {
                formId: "level_form",
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
                    editLevel: false,
                    FormFields: {
                        ...this.state.FormFields,
                        initialValues: {},
                    },
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
        this.levelForm.current.refs.level_form.submit();
    };

    Callback = (value) => {
        if (!this.state.editLevel) {
            this.addType(value.obj);
        } else {
            this.editRecord(value.obj);
        }
    };

    addType = (value) => {
        this.setState({loading: true})
        addList(value).then((res) => {
            if (res) {
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
            editLevel: obj.id,
            isVisible: true,
        });
    };
    editRecord = (obj) => {
        this.setState({loading: true})
        const { editLevel } = this.state;
        obj.id = editLevel;
        editLabel(obj).then((res) => {
            if (res) {
                this.getData();
            }
        });
    };

    render() {
        const {data, isVisible, editLevel, FormFields, loading} = this.state;
        return (
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={3}>Standard Levels</Title>
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
                            <PlusSquareOutlined /> Add Level
                        </Button>
                    </Col>
                </Row>
                <Table
                    rowKey={(data) => data.id}
                    columns={this.columns}
                    dataSource={data}
                    size="small"
                />
                {isVisible && (
                    <Modal
                        title={
                            editLevel ? "Edit Level" : "Add Level"
                        }
                        maskClosable={false}
                        centered
                        visible={isVisible}
                        okText={"Save"}
                        width={400}
                        onCancel={() => {
                            this.setState({
                                isVisible: false, //close
                                FormFields: {
                                    ...FormFields,
                                    initialValues: {},
                                }, //delete Formfields on Close
                            });
                        }}
                        onOk={() => {
                            this.submit();
                        }}
                    >
                        <Row justify="center">
                            <Forms
                                ref={this.levelForm}
                                Callback={this.Callback}
                                FormFields={FormFields}
                            />
                        </Row>
                    </Modal>
                )}
            </>
        );
    }
}

export default Levels;
