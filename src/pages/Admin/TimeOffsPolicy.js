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
    Modal,
} from "antd";
import {
    DownOutlined,
    SettingOutlined,
    PlusSquareOutlined,
    CloseOutlined,
} from "@ant-design/icons"; //Icons

import Form from "../../components/Core/Form";
import "../styles/table.css";

const { Title } = Typography;

class TimeOffsPolicy extends Component {
    constructor(props) {
        super(props);
        this.dynamoForm_1 = React.createRef();
        this.dynamoForm_2 = React.createRef();

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
                render: (text, record) => (
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
            data: [
                {
                    key: 1,
                    title: "Standards",
                    offs: {
                        hours0: 1,
                        timeoff0: "Vacations",
                        incAt0: "M",
                        threshold0: "900",
                        hours1: 11,
                        timeoff1: "Sick Leave",
                        incAt1: "M",
                        threshold1: "16",
                    },
                },
                {
                    key: 2,
                    title: "Executives",
                    offs: {
                        hours0: 2,
                        timeoff0: "Vacations",
                        incAt0: "M",
                        threshold0: "901",
                        hours1: 22,
                        timeoff1: "Sick Leave",
                        incAt1: "Y",
                        threshold1: "26",
                    },
                },
            ],
            openModal: false,
            mergeObj: {},
            form1Submitted: false,
            form2Submitted: false,

            FormFields: {
                //this is for insert new fields
                formId: "title_form",
                justify: "center",
                FormCol: 24,
                FieldSpace: { xs: 12, sm: 16, md: 12 },
                layout: { labelCol: { span: 8 } },
                justifyField: "center",
                FormLayout: "inline",
                size: "small",
                fields: [
                    {
                        object: "obj",
                        fieldCol: 24,
                        layout: { wrapperCol: { span: 22 } },
                        key: "title",
                        label: "Title",
                        size: "small",
                        rules: [
                            {
                                required: true,
                                message: "You are not good to go",
                            },
                        ],
                        type: "input",
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
                        func: function func(value, e) {
                            let obj = this.state.FormFields_1.fields[
                                this.state.FormFields_1.fields.length - 1
                            ]; // get the inster number for keys
                            console.log(obj);
                            const item_no = obj ? parseInt(obj.key) + 1 : 0;
                            this.state.FormFields_1.fields = this.state.FormFields_1.fields.concat(
                                ...this.newField(item_no)
                            );
                            this.setState({
                                FormFields_1: this.state.FormFields_1,
                            });
                        }.bind(this),
                    },
                    {
                        fieldCol: 10,
                        Placeholder: "Time Off",
                        type: "Text",
                        size: "small",
                    },
                    {
                        fieldCol: 5,
                        layout: {
                            wrapperCol: { offset: 1 },
                        },
                        Placeholder: "Hours",
                        type: "Text",
                        size: "small",
                    },
                    {
                        fieldCol: 3,
                        layout: {
                            wrapperCol: { offset: 1 },
                        },
                        Placeholder: "Increase",
                        type: "Text",
                        size: "small",
                    },
                    {
                        fieldCol: 5,
                        layout: {
                            wrapperCol: { offset: 1 },
                        },
                        Placeholder: "Threshold",
                        type: "Text",
                        size: "small",
                    },
                ],
            },

            FormFields_1: {
                formId: "hours_form",
                justify: "space-between",
                FormCol: 24,
                FieldSpace: { xs: 12, sm: 16, md: 12 },
                layout: { labelCol: { span: 12 } },
                FormLayout: "inline",
                size: "small",
                // backstyle: {maxHeight:'115px',overflowY: 'auto'},
                fields: this.newField(0),
            },

            editTimeoff: false,
        };
    }

    newField = (item_no) => {
        //inserting new fields in modals
        const splice_key = [
            `timeoff${item_no}`,
            `hours${item_no}`,
            `incAt${item_no}`,
            `threshold${item_no}`,
            item_no,
        ];
        // console.log(splice_key)
        return [
            {
                object: "obj",
                fieldCol: 10,
                layout: { wrapperCol: { span: 23 } },
                key: `timeoff${item_no}`,
                size: "small",
                // rules:[{ required: true }],
                type: "Select",
                labelAlign: "left",
                itemStyle: { marginBottom: "5px" },
                data: [
                    { value: "Sick Leave", label: "Sick Leave" },
                    { value: "Vacations", label: "Vacations" },
                    { value: "Traning", label: "Traning" },
                ],
            },
            {
                object: "obj",
                fieldCol: 5,
                layout: { wrapperCol: { span: 20, offset: 2 } },
                key: `hours${item_no}`,
                size: "small",
                // rules:[{ required: true }],
                type: "InputNumber",
                labelAlign: "left",
                itemStyle: { marginBottom: "5px" },
            },
            {
                object: "obj",
                fieldCol: 3,
                layout: { wrapperCol: { span: 23 } },
                key: `incAt${item_no}`,
                size: "small",
                // rules:[{ required: true }],
                type: "Select",
                labelAlign: "left",
                itemStyle: { marginBottom: "5px" },
                data: [
                    { value: "M", label: "M" },
                    { value: "Y", label: "Y" },
                ],
            },
            {
                object: "obj",
                fieldCol: 5,
                layout: { wrapperCol: { span: 23 } },
                key: `threshold${item_no}`,
                size: "small",
                // rules:[{ required: true }],
                type: "InputNumber",
                labelAlign: "left",
                itemStyle: { marginBottom: "5px" },
                data: [
                    { value: "Sick Leave", label: "Sick Leave" },
                    { value: "Vacations", label: "Vacations" },
                    { value: "Traning", label: "Traning" },
                ],
            },
            {
                fieldCol: 1,
                size: "small",
                Placeholder: <CloseOutlined />,
                key: item_no,
                // rules:[{ required: true }],
                type: "Text",
                style: {
                    textAlign: "right",
                },
                fieldStyle: {
                    cursor: "pointer",
                },
                func: function func(value, e) {
                    this.state.FormFields_1.fields = this.state.FormFields_1.fields.filter(
                        (obj) => {
                            return (
                                obj.key !== splice_key[0] &&
                                obj.key !== splice_key[1] &&
                                obj.key !== splice_key[2] &&
                                obj.key !== splice_key[3] &&
                                obj.key !== splice_key[4]
                            );
                        }
                    );

                    this.setState({
                        FormFields_1: this.state.FormFields_1,
                    });
                }.bind(this),
            },
        ];
    };

    handleDelete = (key) => {
        const dataSource = [...this.state.data];
        this.setState({ data: dataSource.filter((item) => item.key !== key) });
    };

    toggelModal = (status) => {
        this.setState({
            openModal: status,
        });

        if (this.state.openModal) {
            this.dynamoForm_1.current.refs.title_form.resetFields();
            this.dynamoForm_2.current.refs.hours_form.resetFields();

            delete this.state.FormFields.initialValues;
            delete this.state.FormFields_1.initialValues;
            this.state.FormFields_1.fields = this.newField(0);

            this.setState({
                FormFields: this.state.FormFields,
                FormFields_1: this.state.FormFields_1,
                editTimeoff: false,
            });
        }
    };

    Callback = (vake) => {
        // this will work after I get the Object from the form
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    title: vake.obj.title,
                    key: vake.obj.key
                        ? vake.obj.key
                        : this.state.data.length + 1,
                },
                form1Submitted: true,
            },
            () => {
                if (this.state.form1Submitted && this.state.form2Submitted) {
                    if (!this.state.editTimeoff) {
                        console.log("emes");
                        this.renderTable();
                    } else {
                        console.log("edit");
                        this.editRecord();
                    }
                }
            }
        );
    };

    Callback2 = (vake) => {
        // this will work after I get the Object from the form
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    offs: vake.obj,
                },
                form2Submitted: true,
            },
            () => {
                if (this.state.form1Submitted && this.state.form2Submitted) {
                    if (!this.state.editTimeoff) {
                        console.log("emes");
                        this.renderTable();
                    } else {
                        console.log("edit");
                        this.editRecord();
                    }
                }
            }
        );
    };

    submit = () => {
        this.dynamoForm_1.current.refs.title_form.submit();
        this.dynamoForm_2.current.refs.hours_form.submit();
    };

    getRecord = (data, text) => {
        let result = data.offs ? Object.keys(data.offs).length / 4 : 0;
        for (let i = 1; i < result; i++) {
            this.state.FormFields_1.fields = this.state.FormFields_1.fields.concat(
                this.newField(i)
            );
        }

        var obj = { key: data.key, title: data.title };
        console.log(data);
        this.setState(
            {
                FormFields: {
                    ...this.state.FormFields,
                    initialValues: { obj: obj },
                },
                FormFields_1: {
                    ...this.state.FormFields_1,
                    initialValues: { obj: data.offs },
                },
                editTimeoff: data.key,
            },
            () => {
                this.toggelModal(true);
            }
        );
    };

    editRecord = () => {
        this.state.mergeObj.key = this.state.editTimeoff;
        this.state.data[this.state.editTimeoff - 1] = this.state.mergeObj;

        this.setState(
            {
                data: [...this.state.data],
                mergeObj: {},
            },
            () => {
                this.toggelModal(false);
                console.log(this.state.data);
            }
        );
    };

    renderTable = () => {
        const { data, mergeObj } = this.state;
        this.setState(
            {
                data: [...data, mergeObj],
                mergeObj: {},
            },
            () => {
                this.toggelModal(false);
                console.log("Data Rendered");
            }
        );
    };

    render() {
        const data = this.state.data;
        const columns = this.columns;
        return (
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={4}>Time Off Policies </Title>
                    </Col>
                    <Col style={{ textAlign: "end" }}>
                        <Button
                            type="primary"
                            onClick={() => {
                                this.toggelModal(true);
                            }}
                            size="small"
                        >
                            {" "}
                            <PlusSquareOutlined />
                            Add Time Off Policy
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
                            this.state.editTimeoff
                                ? "Edit Time Off Policy"
                                : "Add Time Off Policy"
                        }
                        centered
                        visible={this.state.openModal}
                        onOk={() => {
                            this.submit();
                        }}
                        okText={this.state.editTimeoff ? "Edit" : "Save"}
                        onCancel={() => {
                            this.toggelModal(false);
                        }}
                        width={640}
                    >
                        <Row>
                            <Form
                                ref={this.dynamoForm_1}
                                Callback={this.Callback}
                                FormFields={this.state.FormFields}
                            />
                        </Row>
                        <Row style={{ maxHeight: "115px", overflowY: "auto" }}>
                            <Form
                                ref={this.dynamoForm_2}
                                Callback={this.Callback2}
                                FormFields={this.state.FormFields_1}
                            />
                        </Row>
                    </Modal>
                ) : null}
            </>
        );
    }
}

export default TimeOffsPolicy;
