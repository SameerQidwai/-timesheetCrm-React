import React, { Component } from "react";
import { Table, Menu, Dropdown, Button, Popconfirm, Row, Col, Typography, Modal, } from "antd";
import { DownOutlined, SettingOutlined, PlusSquareOutlined, CloseOutlined, LoadingOutlined} from "@ant-design/icons"; //Icons

import Form from "../../components/Core/Form";
import "../styles/table.css";

import { timeOff, addList, getList, editLabel, delLabel, } from "../../service/time-off-policy";
import { localStore } from "../../service/constant";
import { tableSorter, tableTitleFilter } from "../../components/Core/Table/TableFilter";

const { Title } = Typography;

class LeavePolicies extends Component {
    constructor(props) {
        super(props);
        this.dynamoForm_1 = React.createRef();
        this.dynamoForm_2 = React.createRef();

        this.columns = [
            {
                title: "Title",
                dataIndex: "label",
                key: "label",
                ...tableSorter('label', 'string')
            },
            {
                title: "Action",
                key: "action",
                align: "right",
                width: 115,
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
            timeoff: [],
            data: [],
            filterData: [],
            openModal: false,
            mergeObj: {},
            form1Submitted: false,
            form2Submitted: false,
            loading: false,

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
                        key: "label",
                        label: "Policy Title",
                        size: "small",
                        rules: [
                            {
                                required: true,
                                message: "Policy Title is Required",
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
                        onClick: function func(value, e) {
                            let obj = this.state.FormFields_1.fields[
                                this.state.FormFields_1.fields.length - 1
                            ]; // get the inster number for keys
                            const item_no = obj ? parseInt(obj.key) + 1 : 0;
                            this.state.FormFields_1.fields = this.state.FormFields_1.fields.concat(
                                ...this.newField(item_no)
                            );
                            this.setState({
                                FormFields_1: this.state.FormFields_1,
                            });
                        }.bind(this),
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
                fields: [],
            },

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
                this.setState({
                    timeoff: res.data,
                });
            }
        });
    };
    getData = () => {
        getList().then((res) => {
            if (res.success) {
                this.setState({
                    data: res.data,
                    filterData: res.data,
                    openModal: false,
                    editTimeoff: false,
                    FormFields: {
                        ...this.state.FormFields,
                        initialValues: {},
                    },
                    FormFields_1: {
                        ...this.state.FormFields_1,
                        initialValues: {},
                        fields: [],
                    },
                    mergeObj: {},
                    loading: false
                });
            }
        });
    };

    newField = (item_no) => {
        //inserting new fields in modals
        const { timeoff } = this.state;
        const splice_key = [ `category${item_no}`, `earnHours${item_no}`, `earnEvery${item_no}`, `resetEvery${item_no}`, `resetHours${item_no}`, `threshold${item_no}`, item_no, ];
        // console.log(splice_key)
        return [
            {
                object: "obj",
                fieldCol: 6,
                layout: { wrapperCol: { span: 23 } },
                key: splice_key[0],
                size: "small",
                // rules:[{ required: true }],
                type: "Select",
                labelAlign: "left",
                itemStyle: { marginBottom: "5px" },
                data: timeoff,
            },
            {
                object: "obj",
                fieldCol: 3,
                layout: { wrapperCol: { span: 20, offset: 2 } },
                key: splice_key[1],
                size: "small",
                // rules:[{ required: true }],
                type: "InputNumber",
                labelAlign: "left",
                itemStyle: { marginBottom: "5px" },
            },
            {
                object: "obj",
                fieldCol: 4,
                layout: { wrapperCol: { span: 23 } },
                key: splice_key[2],
                size: "small",
                // rules:[{ required: true }],
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
                object: "obj",
                fieldCol: 4,
                layout: { wrapperCol: { span: 23 } },
                key: splice_key[3],
                size: "small",
                // rules:[{ required: true }],
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
                object: "obj",
                fieldCol: 3,
                layout: { wrapperCol: { span: 23 } },
                key: splice_key[4],
                size: "small",
                // rules:[{ required: true }],
                type: "InputNumber",
                labelAlign: "left",
                itemStyle: { marginBottom: "5px" },
                data: [],
            },
            {
                object: "obj",
                fieldCol: 3,
                layout: { wrapperCol: { span: 23 } },
                key: splice_key[5],
                size: "small",
                // rules:[{ required: true }],
                type: "InputNumber",
                labelAlign: "left",
                itemStyle: { marginBottom: "5px" },
                data: [],
            },
            {
                fieldCol: 1,
                size: "small",
                Placeholder: <CloseOutlined />,
                key: splice_key[6],
                // rules:[{ required: true }],
                type: "Text",
                style: {
                    textAlign: "right",
                },
                fieldStyle: {
                    cursor: "pointer",
                },
                onClick: function func(value, e) {
                    this.state.FormFields_1.fields = this.state.FormFields_1.fields.filter(
                        (obj) => {
                            return (
                                obj.key !== splice_key[0] &&
                                obj.key !== splice_key[1] &&
                                obj.key !== splice_key[2] &&
                                obj.key !== splice_key[3] &&
                                obj.key !== splice_key[4] &&
                                obj.key !== splice_key[5] &&
                                obj.key !== splice_key[6]
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

    handleDelete = (id) => {
        delLabel(id).then((res) => {
            if (res) {
                this.getData();
            }
        });
    };

    toggelModal = (status) => {
        const { FormFields_1 } = this.state;
        if (!status) {
            delete this.state.FormFields.initialValues;
            delete this.state.FormFields_1.initialValues;

            this.setState({
                FormFields: this.state.FormFields,
                FormFields_1: { ...this.state.FormFields_1, fields: [] },
                openModal: false,
                editTimeoff: false,
            });
        } else {
            this.setState({
                openModal: status,
                FormFields_1: { ...FormFields_1, fields: this.newField(0) },
            });
        }
    };

    submit = () => {
        this.dynamoForm_1.current.refs.title_form.submit();
        this.dynamoForm_2.current.refs.hours_form.submit();
    };

    Callback = (vake) => {
        // this will work after I get the Object from the form
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    label: vake.obj.label,
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
        const { obj } = vake;
        const vars = [];
        let result = Object.keys(obj).length / 6;
        for (let i = 0; i < result; i++) {
            if(obj[`category${i}`]){
                vars.push({
                    timeOffTypeId: obj[`category${i}`],
                    earnHours: obj[`earnHours${i}`],
                    earnEvery: obj[`earnEvery${i}`],
                    resetEvery: obj[`resetEvery${i}`],
                    resetHours: obj[`resetHours${i}`],
                    threshold: obj[`threshold${i}`],
                });
            }
        }
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    timeOffPolicyTimeOffTypes: vars,
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

    getRecord = (data, text) => {
        const vars = {};
        const array = data.timeOffPolicyTimeOffTypes;
        let result = array.length;
        for (let i = 0; i < result; i++) {
            this.state.FormFields_1.fields = this.state.FormFields_1.fields.concat(
                this.newField(i)
            );
            let el = array[i];
            vars[`category${i}`] = el.timeOffType.id;
            vars[`earnHours${i}`] = el.earnHours;
            vars[`earnEvery${i}`] = el.earnEvery;
            vars[`resetEvery${i}`] = el.resetEvery;
            vars[`resetHours${i}`] = el.resetHours;
            vars[`threshold${i}`] = el.threshold;
        }

        var obj = { label: data.label };
        this.setState({
            FormFields: {
                ...this.state.FormFields,
                initialValues: { obj: obj },
            },
            FormFields_1: {
                ...this.state.FormFields_1,
                initialValues: { obj: vars },
            },
            editTimeoff: data.id,
            openModal: true,
        });
    };

    editRecord = () => {
        const { mergeObj } = this.state;
        mergeObj.id = this.state.editTimeoff;
        this.setState({loading: true})
        editLabel(mergeObj).then((res) => {
            if (res) {
                this.getData();
                this.toggelModal(false);
            }
        });
    };

    renderTable = () => {
        const { mergeObj } = this.state;
        this.setState({loading: true})
        addList(mergeObj).then((res) => {
            this.getData();
        });
    };

    generalFilter = (value) =>{
        const { data } = this.state
        if (value){
            this.setState({
                filterData: data.filter(el => {
                    return el.label && el.label.toLowerCase().includes(value.toLowerCase()) 
                })
            })
        }else{
            this.setState({
                filterData: data
            })
        }
    }

    render() {
        const {data, openModal, editTimeoff, FormFields, FormFields_1, loading, filterData} = this.state;
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
                            title={()=>tableTitleFilter(5, this.generalFilter)}
                            bordered
                            pagination={{pageSize: localStore().pageSize}}
                            rowKey={(data) => data.id}
                            columns={columns}
                            dataSource={filterData}
                            size="small"
                        />
                    </Col>
                </Row>
                {openModal ? (
                    <Modal
                        title={ editTimeoff ? "Edit Leave Policy" : "Add Leave Policy" }
                        maskClosable={false}
                        centered
                        visible={openModal}
                        onOk={() => { this.submit(); }}
                        okButtonProps={{ disabled: loading }}
                        okText={loading ?<LoadingOutlined /> :"Save"}
                        onCancel={() => { this.toggelModal(false); }}
                        width={900}
                    >
                        <Row>
                            <Form
                                ref={this.dynamoForm_1}
                                Callback={this.Callback}
                                FormFields={FormFields}
                            />
                        </Row>
                        <Row style={{ maxHeight: "115px", overflowY: "auto" }}>
                            <Form
                                ref={this.dynamoForm_2}
                                Callback={this.Callback2}
                                FormFields={FormFields_1}
                            />
                        </Row>
                    </Modal>
                ) : null}
            </>
        );
    }
}

export default LeavePolicies;
