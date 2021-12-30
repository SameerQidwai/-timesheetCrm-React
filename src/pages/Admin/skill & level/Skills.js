import React, { Component } from "react";
import { Typography, Row, Col, Popconfirm, Modal, Button, Table, Dropdown, Menu, } from "antd";
import { SettingOutlined, DownOutlined, CloseOutlined, PlusSquareOutlined, LoadingOutlined} from "@ant-design/icons"; //Icons
import Forms from "../../../components/Core/Form";

import { levels, addList, getList, editLabel, delLabel, } from "../../../service/skills";
import { localStore } from "../../../service/constant";

const { Title } = Typography;

class Skills extends Component {
    constructor() {
        super();
        this.skillForm = React.createRef();
        this.levelForm = React.createRef();
        this.columns = [
            {
                title: "Skill Name",
                dataIndex: "label",
                key: "label",
                sorter: (a, b)=>{
                    if (a.label && b.label){
                        return a.label.localeCompare(b.label)
                    }
                }
            },
            {
                title: "Action",
                key: "action",
                align: "right",
                render: (record, text) => (
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

        this.priority_data = [
            {
                label: '1',
                value: 1,
            },
            {
                label: '2',
                value: 2,
            },
            {
                label: '3',
                value: 3,
            },
            {
                label: '4',
                value: 4,
            },
            {
                label: '5',
                value: 5,
            },
        ];

        this.level_data = [
            {
                val: 1,
                value: "Superstar",
                label: "Superstar",
            },
            {
                key: 2,
                value: "Senior",
                label: "Senior",
            },
            {
                key: 3,
                value: "Middle",
                label: "Middle",
            },
            {
                key: 4,
                value: "Junior",
                label: "Junior",
            },
            {
                key: 5,
                value: "Trainee",
                label: "Trainee",
            },
        ];

        this.state = {
            isVisible: false, // modal variable
            editSkill: false, // edit or addnew to change modal titles
            mergeObj: {}, // merge submit results into object
            formSubmitted: false, //check if got data from skill submit
            levelSubmitted: false, //check if got data from level submit
            level_data: false,
            loading: false,
            data_skill: [],
            skillFields: {
                formId: "skill_form",
                FormCol: 24,
                FieldSpace: { xs: 12, sm: 16, md: 12 },
                layout: { labelCol: { span: 4 } },
                justifyField: "center",
                FormLayout: "inline",
                size: "small",
                fields: [
                    {
                        object: "obj",
                        fieldCol: 24,
                        layout: { wrapperCol: { span: 20 } },
                        key: "label",
                        label: "Name",
                        size: "small",
                        // rules:[{ required: true, message:'You are not good to go' }],
                        type: "Input",
                        labelAlign: "left",
                        itemStyle: { marginBottom: "5px" },
                    },
                    {
                        fieldCol: 24,
                        Placeholder: "Add Skill",
                        type: "Button",
                        mode: "primary",
                        style: { textAlign: "right" },
                        size: "small",
                        itemStyle: { marginBottom: "10px" },
                        onClick: function func(value, e) {
                            let obj = this.state.LevelFields.fields[
                                this.state.LevelFields.fields.length - 1
                            ]; // get the inster number for keys
                            const item_no = obj ? parseInt(obj.key) + 1 : 0;
                            this.state.LevelFields.fields = this.state.LevelFields.fields.concat(
                                ...this.newField(item_no)
                            );
                            this.setState({
                                LevelFields: this.state.LevelFields,
                            });
                        }.bind(this),
                    },
                    {
                        fieldCol: 15,
                        Placeholder: "Level Name",
                        type: "Text",
                        size: "small",
                    },
                    {
                        fieldCol: 7,
                        layout: {
                            wrapperCol: { offset: 1 },
                        },
                        Placeholder: "priority",
                        type: "Text",
                        size: "small",
                    },
                ],
            },
            LevelFields: {
                formId: "level_form",
                FormCol: 24,
                // FieldSpace: { xs: 12, sm: 16, md: 12},
                // layout: {labelCol: { span: 12 }},
                justifyField: "center",
                FormLayout: "inline",
                size: "small",
                fields: [],
            },
        };
    }

    componentDidMount = () => {
        this.getLevel();
        this.getData();
    };

    getLevel = () => {
        levels().then((res) => {
            if (res.success) {
                this.setState({
                    level_data: res.data,
                });
            }
        });
    };

    getData = () => {
        getList().then((res) => {
            if (res.success) {
                this.setState({
                    data_skill: res.data,
                    isVisible: false,
                    editSkill: false,
                    skillFields: {
                        ...this.state.skillFields,
                        initialValues: {},
                    },
                    LevelFields: {
                        ...this.state.LevelFields,
                        initialValues: {},
                        fields: [],
                    },
                    mergeObj: {},
                });
            }
        });
    };

    newField = (item_no) => {
        //inserting new fields in modals
        const { level_data } = this.state;
        const splice_key = [`level${item_no}`, `priority${item_no}`, item_no];
        return [
            {
                object: "obj",
                fieldCol: 15,
                layout: { wrapperCol: { span: 23 } },
                key: `level${item_no}`,
                size: "small",
                // rules:[{ required: true }],
                data: level_data,
                type: "Select",
                labelAlign: "left",
                itemStyle: { marginBottom: "5px" },
            },
            {
                object: "obj",
                fieldCol: 7,
                layout: { wrapperCol: { span: 20 } },
                key: `priority${item_no}`,
                size: "small",
                // rules:[{ required: true }],
                data: this.priority_data,
                type: "Select",
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
                    this.state.LevelFields.fields = this.state.LevelFields.fields.filter(
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
                        LevelFields: this.state.LevelFields,
                    });
                }.bind(this),
            },
        ];
    };

    toggelModal = (status) => {
        const { FormFields_1 } = this.state;
        if (!status) {
            this.setState({
                skillFields: { ...this.state.skillFields, initialValues: {} },
                LevelFields: {
                    ...this.state.LevelFields,
                    fields: [],
                    initialValues: {},
                },
                isVisible: false,
                editSkill: false,
                formSubmitted: false,
                levelSubmitted: false,
                loading: false
            });
        } else {
            this.setState({
                isVisible: status,
                loading: false,
                LevelFields: {
                    ...this.state.LevelFields,
                    fields: this.newField(0),
                },
            });
        }
    };

    handleDelete = (id) => {
        delLabel(id).then((res) => {
            if (res) {
                this.getData();
            }
        });
    };

    submit = () => {
        //submit button click
        this.skillForm.current.refs.skill_form.submit();
        this.levelForm.current.refs.level_form.submit();
    };

    skillCall = (vake) => {
        // this will work after  got  Object from the skill from
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    label: vake.obj.label,
                },
                formSubmitted: true, // skill form submitted
            },
            () => {
                if (this.state.formSubmitted && this.state.levelSubmitted) {
                    //check if both form is submittef
                    if (!this.state.editSkill) {
                        console.log("emes");
                        this.addSkill(this.state.mergeObj); //add skill
                    } else {
                        console.log("edit");
                        this.editRecord(this.state.mergeObj); //edit skill
                    }
                }
            }
        );
    };

    levelCall = (vake) => {
        // this will work after  getting the Object from level form
        const { obj } = vake;
        const vars = [];
        let result = Object.keys(obj).length / 2;
        for (let i = 0; i < result; i++) {
            if(obj[`level${i}`]){
                vars.push({
                    standardLevelId: obj[`level${i}`],
                    priority: obj[`priority${i}`],
                });
            }
        }
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    standardSkillStandardLevels: vars,
                },
                levelSubmitted: true, // level form submitted
            },
            () => {
                if (this.state.formSubmitted && this.state.levelSubmitted) {
                    //check if both form is submittef
                    if (!this.state.editSkill) {
                        console.log("emes");
                        this.addSkill(this.state.mergeObj); //add skill
                    } else {
                        console.log("edit");
                        this.editRecord(this.state.mergeObj); //edit skill
                    }
                }
            }
        );
    };

    addSkill = (value) => {
        this.setState({loading: true})
        const { mergeObj } = this.state;
        console.log({ mergeObj });
        addList(mergeObj).then((res) => {
            this.getData();
        });
    };

    getRecord = (data) => {
        const vars = {};
        const array = data.standardSkillStandardLevels;
        let result = array.length;
        for (let i = 0; i < result; i++) {
            this.state.LevelFields.fields = this.state.LevelFields.fields.concat(
                this.newField(i)
            );
            let el = array[i];
            vars[`level${i}`] = el.standardLevel.id;
            vars[`priority${i}`] = el.priority;
        }

        var obj = { label: data.label };
        this.setState({
            skillFields: {
                ...this.state.skillFields,
                initialValues: { obj: obj },
            },
            LevelFields: {
                ...this.state.LevelFields,
                initialValues: { obj: vars },
            },
            editSkill: data.id, //save edit field
            isVisible: true, //open modal
        });
    };

    editRecord = () => {
        this.setState({loading: true})
        const { mergeObj, editSkill } = this.state;
        mergeObj.id = editSkill;
        console.log(mergeObj);
        editLabel(mergeObj).then((res) => {
            if (res) {
                this.getData();
                this.toggelModal(false);
            }
        });
    };

    render() {
        const { data_skill, isVisible, editSkill, LevelFields, skillFields, loading } = this.state;
        return (
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={3}>Standard Skills</Title>
                    </Col>
                    <Col>
                        <Button
                            type="primary"
                            size="small"
                            onClick={() => { this.toggelModal(true); }}
                        >
                            <PlusSquareOutlined /> Add Skill
                        </Button>
                    </Col>
                </Row>
                <Table
                    pagination={{pageSize: localStore().pageSize}}
                    columns={this.columns}
                    dataSource={data_skill}
                    size="small"
                />
                {isVisible && (
                    <Modal
                        title={ editSkill ? "Edit Skill" : "Add Skill" }
                        maskClosable={false}
                        centered
                        visible={isVisible}
                        okButtonProps={{ disabled: loading }}
                        okText={loading ?<LoadingOutlined /> :"Save"}
                        width={400}
                        onCancel={() => { this.toggelModal(false); }}
                        onOk={() => { this.submit(); }}
                    >
                        <Row justify="center">
                            <Forms
                                ref={this.skillForm}
                                Callback={this.skillCall}
                                FormFields={skillFields}
                            />
                        </Row>
                        <Row style={{ maxHeight: "85px", overflowY: "auto" }}>
                            <Forms
                                ref={this.levelForm}
                                Callback={this.levelCall}
                                FormFields={LevelFields}
                            />
                        </Row>
                    </Modal>
                )}
            </>
        );
    }
}

export default Skills;
