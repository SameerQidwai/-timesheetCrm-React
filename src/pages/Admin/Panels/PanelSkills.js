import React, { Component } from "react";
import { Row, Col, Typography, Button, Table, Menu, Dropdown, Popconfirm, Modal, } from "antd";
import { DownOutlined, SettingOutlined, PlusSquareOutlined, CloseOutlined, } from "@ant-design/icons"; //Icons

import Form from "../../../components/Core/Form";

import { getlevels, getSkills, getList, editLabel, addList, delLabel, } from "../../../service/panelSkill";
import { getStandardLevels } from "../../../service/constant-Apis";
import Operation from "antd/lib/transfer/operation";

const { Title } = Typography;

class PanelInfo extends Component {
    constructor(props) {
        super(props);
        this.dynamoForm_1 = React.createRef();
        this.dynamoForm_2 = React.createRef();

        this.columns = [
            {
                title: "Skill",
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
                                    onClick={() => this.getRecord(record)}
                                >
                                    View
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
            openModal: false,
            mergeObj: {},
            form1Submitted: false,
            form2Submitted: false,
            editPS: false,
            panelId: false,
            skill_select: false,
            skill_pirority: false,
            data: [],

            FormFields: {
                formId: "title_form",
                justify: "center",
                FormCol: 24,
                FieldSpace: { xs: 12, sm: 16, md: 12 },
                layout: { labelCol: { span: 4 } },
                justifyField: "center",
                FormLayout: "inline",
                size: "small",
                fields: [
                    {
                        fieldCol: 12,
                        Placeholder: "Panel Skill",
                        type: "Text",
                        size: "small",
                    },
                    {
                        fieldCol: 12,
                        Placeholder: "Generic Skill",
                        type: "Text",
                        size: "small",
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        // wrapperCol: { span: 20 },
                        key: "label",
                        // label: "Panel Skill",
                        size: "small",
                        rules: [
                            {
                                required: true,
                                message: "You are not good to go",
                            },
                        ],
                        type: "Input",
                        labelAlign: "left",
                        itemStyle: { marginBottom: "5px" },
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        // labelCol: { span: 7 },
                        key: "standard",
                        // label: "Generic Skill",
                        size: "small",
                        rules: [
                            {
                                required: true,
                                message: "You are not good to go",
                            },
                        ],
                        type: "Select",
                        data: [],
                        // onChange: function name(value, option) {
                        //     if (value){
                        //         console.log(option);
                        //         const { FormFields_1 } = this.state
                        //         this.setState({skill_pirority: option.level, FormFields_1})
                        //     }  
                        // }.bind(this),
                        labelAlign: "left",
                        itemStyle: { marginBottom: "5px" },
                    },
                    {
                        fieldCol: 24,
                        Placeholder: "Add Level",
                        type: "Button",
                        mode: "primary",
                        style: { textAlign: "right" },
                        size: "small",
                        itemStyle: { marginBottom: "10px" },
                        onClick: function func(value, e) {
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
                        fieldCol: 8,
                        Placeholder: "Panel Level",
                        type: "Text",
                        size: "small",
                    },
                    {
                        fieldCol: 7,
                        layout: {
                            wrapperCol: { offset: 1 },
                        },
                        Placeholder: "Generic Level",
                        type: "Text",
                        size: "small",
                    },
                    {
                        fieldCol: 4,
                        layout: {
                            wrapperCol: { offset: 1 },
                        },
                        Placeholder: "ST Ceil",
                        tooltip: true,
                        tooltipTitle: "Short Term Ceiling Rate (ex GST)",
                        tooltipTrigger: "hover",
                        type: "Text",
                        size: "small",
                    },
                    {
                        fieldCol: 4,
                        layout: {
                            wrapperCol: { offset: 1 },
                        },
                        tooltip: true,
                        tooltipTitle: "Long Term Ceiling Rate (ex GST)",
                        tooltipTrigger: "hover",
                        Placeholder: "LT Ceil",
                        type: "Text",
                        size: "small",
                    },
                ],
            },

            FormFields_1: {
                formId: "hours_form",
                justify: "center",
                FormCol: 24,
                // FieldSpace: { xs: 12, sm: 16, md: 12},
                // layout: {labelCol: { span: 12 }},
                justifyField: "center",
                FormLayout: "inline",
                size: "small",
                // backstyle: {maxHeight:'145px',overflowY: 'auto'},
                fields: [],
            },
        };
    }

    componentDidMount() {
        this.setState(
            {
                panelId: this.props.match.params.id,
            },
            () => {
                this.getData();
                this.getSkilllevels();
            }
        );
    }
    getSkilllevels = () => {
        getlevels().then((level_res) => {
            getSkills().then((skill_res) => {
                if (level_res.success && skill_res.success) {
                    const { FormFields } = this.state;
                    FormFields.fields[3].data = skill_res.data;
                    this.setState({
                        FormFields,
                        skill_pirority: level_res.data,
                    });
                }
            });
        });
    };
    // getSkilllevels = () => {
    //     getStandardLevels().then(res=>{
    //         const { FormFields } = this.state;
    //         console.log(res.data);
    //         FormFields.fields[3].data = res.data;
    //         this.setState({
    //             FormFields,
    //             // skill_pirority: level_res.data,
    //         });
    //     });
    // };

    getData = () => {
        const { panelId, FormFields, FormFields_1 } = this.state;
        getList(panelId).then((res) => {
            if (res.success) {
                this.setState({
                    data: res.data,
                    FormFields: { ...FormFields, initialValues: {} },
                    FormFields_1: {
                        ...FormFields_1,
                        fields: [],
                        initialValues: {},
                    },
                    mergeObj: {},
                    openModal: false,
                    editPS: false,
                    form1Submitted: false,
                    form2Submitted: false,
                });
            }
        });
    };

    newField = (item_no) => {
        const { skill_pirority } = this.state;
        //inserting new fields in modals
        const splice_key = [
            `level${item_no}`,
            `pirority${item_no}`,
            `stceil${item_no}`,
            `ltceil${item_no}`,
            item_no,
        ];
        return [
            {
                object: "obj",
                fieldCol: 8,
                layout: { wrapperCol: { span: 20 } },
                key: `level${item_no}`,
                size: "small",
                // rules:[{ required: true }],
                type: "Input",
                labelAlign: "left",
                itemStyle: { marginBottom: "5px" },
            },
            {
                object: "obj",
                fieldCol: 7,
                layout: { wrapperCol: { span: 20 } },
                key: `pirority${item_no}`,
                size: "small",
                // rules:[{ required: true }],
                data: skill_pirority,
                type: "Select",
                labelAlign: "left",
                itemStyle: { marginBottom: "5px" },
            },
            {
                object: "obj",
                fieldCol: 4,
                layout: { wrapperCol: { span: 20 } },
                key: `stceil${item_no}`,
                size: "small",
                // rules:[{ required: true }],
                type: "InputNumber",
                labelAlign: "left",
                itemStyle: { marginBottom: "5px" },
            },
            {
                object: "obj",
                fieldCol: 4,
                layout: { wrapperCol: { span: 20 } },
                key: `ltceil${item_no}`,
                size: "small",
                // rules:[{ required: true }],
                type: "InputNumber",
                labelAlign: "left",
                itemStyle: { marginBottom: "5px" },
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
                onClick: function func(value, e) {
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

    handleDelete = (id) => {
        delLabel(id).then((res) => {
            if (res) {
                this.getData();
            }
        });
    };

    toggelModal = (status) => {
        const { FormFields_1, FormFields } = this.state;
        if (!status) {
            this.setState({
                FormFields: { ...FormFields, initialValues: {} },
                FormFields_1: {
                    ...FormFields_1,
                    fields: [],
                    initialValues: {},
                },
                openModal: false,
                editPS: false,
                form1Submitted: false,
                form2Submitted: false,
            });
        } else {
            this.setState({
                openModal: status,
                FormFields_1: { ...FormFields_1, fields: this.newField(0) },
                editPS: false,
            });
        }
    };

    submit = () => {
        this.dynamoForm_1.current.refs.title_form.submit();
        this.dynamoForm_2.current.refs.hours_form.submit();
    };

    Callback = (vake) => {
        // this will work after I get the Object from the form
        const { panelId } = this.state;
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    label: vake.obj.label,
                    standardSkillId: vake.obj.standard,
                    panelId: panelId,
                },
                form1Submitted: true,
            },
            () => {
                if (this.state.form1Submitted && this.state.form2Submitted) {
                    if (!this.state.editPS) {
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
        let result = Object.keys(obj).length / 4;
        for (let i = 0; i < result; i++) {
            vars.push({
                levelLabel: obj[`level${i}`],
                standardLevelId: obj[`pirority${i}`],
                shortTermCeil: obj[`stceil${i}`],
                longTermCeil: obj[`ltceil${i}`],
            });
        }
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    panelSkillStandardLevels: vars,
                },
                form2Submitted: true,
            },
            () => {
                if (this.state.form1Submitted && this.state.form2Submitted) {
                    if (!this.state.editPS) {
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

    renderTable = () => {
        const { mergeObj } = this.state;
        addList(mergeObj).then((res) => {
            this.getData();
        });
    };

    getRecord = (data, text) => {
        const vars = {};
        const array = data.panelSkillStandardLevels;
        console.log(array);
        let result = array.length;
        for (let i = 0; i < result; i++) {
            this.state.FormFields_1.fields = this.state.FormFields_1.fields.concat(
                this.newField(i)
            );
            let el = array[i];
            vars[`level${i}`] = el.levelLabel;
            vars[`pirority${i}`] = el.standardLevel.id;
            vars[`stceil${i}`] = el.shortTermCeil;
            vars[`ltceil${i}`] = el.longTermCeil;
        }

        var obj = {
            key: data.id,
            label: data.label,
            standard: data.standardSkill.id,
        };
        this.setState({
            FormFields: {
                ...this.state.FormFields,
                initialValues: { obj: obj },
            },
            FormFields_1: {
                ...this.state.FormFields_1,
                initialValues: { obj: vars },
            },
            editPS: data.id,
            openModal: true,
        });
    };

    editRecord = () => {
        const { mergeObj, editPS } = this.state;
        mergeObj.id = editPS;
        console.log(mergeObj);
        editLabel(mergeObj).then((res) => {
            if (res) {
                this.getData();
            }
        });
    };

    render() {
        const skills = this.state.data;
        return (
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={4}>Panel Information</Title>
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
                            Add Skill
                        </Button>
                    </Col>
                </Row>
                <Table
                    rowKey={(data) => data.id}
                    columns={this.columns}
                    dataSource={skills}
                    size="small"
                />
                {this.state.openModal ? (
                    <Modal
                        title={this.state.editPS ? "Edit Skill" : "Add Skill"}
                        centered
                        visible={this.state.openModal}
                        onOk={() => {
                            this.submit();
                        }}
                        okText={"Save"}
                        onCancel={() => {
                            this.toggelModal(false);
                        }}
                        width={700}
                    >
                        <Row>
                            <Form
                                ref={this.dynamoForm_1}
                                Callback={this.Callback}
                                FormFields={this.state.FormFields}
                            />
                        </Row>
                        <Row style={{ maxHeight: "145px", overflowY: "auto" }}>
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

export default PanelInfo;
