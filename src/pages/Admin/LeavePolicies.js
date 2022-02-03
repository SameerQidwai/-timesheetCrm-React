import React, { Component } from "react";
import { Table, Menu, Dropdown, Button, Popconfirm, Row, Col, Typography, Modal, Form, InputNumber, Select, Space, Input} from "antd";
import { DownOutlined, SettingOutlined, PlusSquareOutlined, MinusCircleFilled, LoadingOutlined} from "@ant-design/icons"; //Icons

// import Form from "../../components/Core/Form";
import "../styles/table.css";

import { timeOff, addList, getList, editLabel, delLabel, } from "../../service/time-off-policy";
import { localStore } from "../../service/constant";
import FormItems from "../../components/Core/FormItems";

const { Title } = Typography;

class LeavePolicies extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.addField = React.createRef();

        this.columns = [
            {
                title: "Title",
                dataIndex: "label",
                key: "label",
            },
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
                                    onClick={() => this.getRecord(record, text)}
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

        this.state = {
            data: [],
            openModal: false,
            loading: false,

            FormFields: [
                {
                    object: "obj",
                    fieldCol: 24,
                    key: "label",
                    label: "Policy Title",
                    size: "small",
                    rules: [
                        {
                            required: true,
                            message: "Policy Title is Required",
                        },
                    ],
                    type: "Input",
                    labelAlign: "left",
                    itemStyle: { marginBottom: "5px" },
                },
                {
                    fieldCol: 24,
                    layout: { wrapperCol: { span: 0 } },
                    Placeholder: "Insert Time Off",
                    type: "Button",
                    mode: "primary",
                    style: { textAlign: "right" },
                    size: "small",
                    onClick: (value, e) => {
                        this.addField.click()
                    },
                    itemStyle: { marginBottom: 5 },
                },
                {
                    fieldCol: 6,
                    Placeholder: "Categories",
                    type: "Text",
                    size: "small",
                },
                {
                    fieldCol: 3,
                    layout: {
                        wrapperCol: { offset: 1 },
                    },
                    Placeholder: "Earn Hours",
                    type: "Text",
                    size: "small",
                },
                {
                    fieldCol: 4,
                    layout: {
                        wrapperCol: { offset: 1 },
                    },
                    Placeholder: "Earn Every",
                    type: "Text",
                    size: "small",
                },
                {
                    fieldCol: 4,
                    layout: {
                        wrapperCol: { offset: 1 },
                    },
                    Placeholder: "Reset Every",
                    type: "Text",
                    size: "small",
                },
                {
                    fieldCol: 3,
                    layout: {
                        wrapperCol: { offset: 1 },
                    },
                    Placeholder: "Rest Hours",
                    type: "Text",
                    size: "small",
                },
                {
                    fieldCol: 3,
                    layout: {
                        wrapperCol: { offset: 1 },
                    },
                    Placeholder: "Threshold",
                    type: "Text",
                    size: "small",
                },
            ],

            FormFields_1: [
                {
                    fieldCol: 6,
                    key: "leaveRequestTypeId",
                    size: "small",
                    type: "Select",
                },
                {
                    fieldCol: 3,
                    key: "earnHours",
                    size: "small",
                    type: "InputNumber",
                },
                {
                    fieldCol: 4,
                    key: "earnEvery",
                    size: "small",
                    type: "Select",
                    labelAlign: "left",
                    itemStyle: { marginBottom: "5px" },
                    data: [
                        { value: "M", label: "Monthly" },
                        { value: "Y", label: "Yearly" },
                        { value: "A", label: "Anniversary" },
                        { value: "MA", label: "Monthly Anniversary" },
                        { value: "N", label: "NEVER" },
                    ],
                },
                {
                    fieldCol: 3,
                    key: "resetHours",
                    size: "small",
                    type: "InputNumber",
                    labelAlign: "left",
                    itemStyle: { marginBottom: "5px" },
                },
                {
                    fieldCol: 4,
                    key: "resetEvery",
                    size: "small",
                    type: "Select",
                    labelAlign: "left",
                    itemStyle: { marginBottom: "5px" },
                    data: [
                        { value: "M", label: "Monthly" },
                        { value: "Y", label: "Yearly" },
                        { value: "A", label: "Anniversary" },
                        { value: "MA", label: "Monthly Anniversary" },
                        { value: "N", label: "NEVER" },
                    ],
                },
                {
                    fieldCol: 3,
                    key: "threshold",
                    size: "small",
                    type: "InputNumber",
                    labelAlign: "left",
                    itemStyle: { marginBottom: "5px" },
                }
            ],

            editTimeoff: false,
        };
    }

    componentDidMount = () => {
        this.timeOff();
        this.getData();
    };

    timeOff = () => {
        timeOff().then((res) => {
            if (res.success) {
                const { FormFields_1 } = this.state
                FormFields_1[0].data = res.data
                this.setState({
                    FormFields_1,
                });
            }
        });
    };
    getData = () => {
        getList().then((res) => {
            if (res.success) {
                this.setState({
                    data: res.data,
                    openModal: false,
                    editTimeoff: false,
                    loading: false
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
        if (!status) {

            this.setState({
                openModal: false,
                editTimeoff: false,
            });
        } else {
            this.setState({
                openModal: status,
            });
        }
    };

    getRecord = (data, text) => {       
        this.setState({
            editTimeoff: data.id,
            openModal: true,
        },()=>this.formRef.current.setFieldsValue({obj: data}));
    };

    editRecord = (value) => {
        value.id = this.state.editTimeoff;
        this.setState({loading: true})
        editLabel(value).then((res) => {
            if (res) {
                this.getData();
                this.toggelModal(false);
            }
        });
    };

    renderTable = (value) => {
        this.setState({loading: true})
        addList(value).then((res) => {
            this.getData();
        });
    };

    onFinish = (values) =>{
        const { obj } = values
        if (!this.state.editTimeoff) {
            console.log("emes");
            this.renderTable(obj);
        } else {
            console.log("edit");
            this.editRecord(obj);
        }
    }

    render() {
        const {data, openModal, editTimeoff, FormFields, FormFields_1, loading } = this.state;
        const columns = this.columns;
        return (
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={4}>Leave Policies </Title>
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
                            Add Leave Policy
                        </Button>
                    </Col>
                    <Col span={24}>
                        <Table
                            pagination={{pageSize: localStore().pageSize}}
                            rowKey={(data) => data.id}
                            columns={columns}
                            dataSource={data}
                            size="small"
                        />
                    </Col>
                </Row>
                {openModal && (
                    <Modal
                        title={ editTimeoff ? "Edit Leave Policy" : "Add Leave Policy" }
                        maskClosable={false}
                        centered
                        visible={openModal}
                        okButtonProps={{ disabled: loading, htmlType: 'submit', form: 'my-form' }}
                        okText={loading ?<LoadingOutlined /> :"Save"}
                        onCancel={() => { this.toggelModal(false); }}
                        width={1200}
                        forceRender={true}
                    >   
                    <Form
                        id={'my-form'}
                        ref={this.formRef}
                        onFinish={this.onFinish}
                        scrollToFirstError={true}
                        size="small"
                        layout="inline"
                    >
                        <FormItems FormFields={FormFields} />

                        <Form.List name={['obj', "leaveRequestPolicyLeaveRequestTypes"]}>
                            {(fields, { add, remove }) => (<>
                                <Form.Item style={{textAlign: "right"}}>
                                    <Button size="small" onClick={() => add()} ref={(el)=>this.addField =el} >
                                    </Button>
                                </Form.Item>
                                    {fields.map(({name, key}) => (
                                    <>
                                        <FormItems FormFields={FormFields_1} listName={name} />
                                        <MinusCircleFilled style={{color:"red"}} onClick={() => remove(name)} />
                                    </>
                                ))}
                            </>)}
                            </Form.List>
                        </Form>
                    </Modal>
                )}
            </>
        );
    }
}

export default LeavePolicies;