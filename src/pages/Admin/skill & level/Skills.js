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
import {
    SettingOutlined,
    DownOutlined,
    CloseOutlined,
} from "@ant-design/icons"; //Icons
import Forms from "../../../components/Core/Form";
const { Title } = Typography;

class Skills extends Component {
    constructor() {
        super();
        this.skillForm = React.createRef();
        this.levelForm = React.createRef();
        this.columns = [
            {
                title: "Skill Name",
                dataIndex: "skill",
                key: "skill",
            },
            {
                title: "Action",
                key: "action",
                align: "right",
                render: (record, text) => (
                    <Dropdown
                        overlay={
                            <Menu>
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
                key: 1,
                value: 1,
            },
            {
                key: 2,
                value: 2,
            },
            {
                key: 3,
                value: 3,
            },
            {
                key: 4,
                value: 4,
            },
            {
                key: 5,
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
            data_skill: [
                {
                    key: 1,
                    skill: "Developer",
                },
                {
                    key: 2,
                    skill: "Accountant",
                },
                {
                    key: 3,
                    skill: "Carpenter",
                },
                {
                    key: 4,
                    skill: "Software Quality Assurance",
                },
                {
                    key: 5,
                    skill: "Office Boy",
                },
            ],
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
                        key: "skill",
                        label: "Name",
                        size: "small",
                        // rules:[{ required: true, message:'You are not good to go' }],
                        type: "Input",
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
                        func: function func(value, e) {
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
                        Placeholder: "Pirority",
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
                fields: this.newField(0),
            },
        };
    }

    newField = (item_no) => {
        //inserting new fields in modals
        const splice_key = [`level${item_no}`, `pirority${item_no}`, item_no];
        return [
            {
                object: "obj",
                fieldCol: 15,
                layout: { wrapperCol: { span: 23 } },
                key: `level${item_no}`,
                size: "small",
                // rules:[{ required: true }],
                data: this.level_data,
                type: "Select",
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
                func: function func(value, e) {
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

    handleDelete = (key) => {
        //delete Object
        this.setState({
            data: this.state.data_skill.filter((item) => item.key !== key),
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
                    skill: vake.obj.skill,
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
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    levels: vake.obj,
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
        value.key =
            this.state.data_skill[this.state.data_skill.length - 1].key + 1; // get new key
        this.setState(
            {
                data_skill: [...this.state.data_skill, value],
                isVisible: false,
            },
            () => {
                this.onCancel();
            }
        );
    };

    getRecord = (data) => {
        console.log(data);
        let result = data.levels ? Object.keys(data.levels).length / 2 : 0; // field to inserted

        for (let i = 1; i < result; i++) {
            //field insert array
            this.state.LevelFields.fields = this.state.LevelFields.fields.concat(
                this.newField(i)
            );
        }

        var obj = { key: data.key, skill: data.skill }; //skill field initial values

        this.setState({
            skillFields: {
                ...this.state.skillFields,
                initialValues: { obj: obj },
            },
            LevelFields: {
                ...this.state.LevelFields,
                initialValues: { obj: data.levels },
            },
            editSkill: data.key, //save edit field
            isVisible: true, //open modal
        });
    };

    editRecord = (value) => {
        value.key = this.state.editSkill; //get saved edit record key
        this.state.data_skill[value.key - 1] = value; // value to push on index

        this.setState(
            {
                data_skill: [...this.state.data_skill],
            },
            () => {
                this.onCancel(); // set all the state to initial
            }
        );
    };

    onCancel = () => {
        delete this.state.skillFields.initialValues; // delete initialValues of fields on close
        delete this.state.LevelFields.initialValues;
        this.setState({
            isVisible: false, //close
            skillFields: { ...this.state.skillFields }, //delete Formfields on Close
            LevelFields: {
                ...this.state.LevelFields,
                fields: this.newField(0),
            },
            editSkill: false,
            isVisible: false,
            formSubmitted: false,
            levelSubmitted: false,
        });
    };

    render() {
        const { data_skill } = this.state;
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
                            onClick={() => {
                                this.setState({
                                    isVisible: true, //Open Modal
                                });
                            }}
                        >
                            Add Level
                        </Button>
                    </Col>
                </Row>
                <Table
                    columns={this.columns}
                    dataSource={data_skill}
                    size="small"
                />
                {this.state.isVisible && (
                    <Modal
                        title={
                            this.state.editSkill ? "Edit Skill" : "Add Skill"
                        }
                        centered
                        visible={this.state.isVisible}
                        okText={this.state.editSkill ? "Edit" : "Save"}
                        width={400}
                        onCancel={() => {
                            this.onCancel();
                        }}
                        onOk={() => {
                            this.submit();
                        }}
                    >
                        <Row justify="center">
                            <Forms
                                ref={this.skillForm}
                                Callback={this.skillCall}
                                FormFields={this.state.skillFields}
                            />
                        </Row>
                        <Row style={{ maxHeight: "85px", overflowY: "auto" }}>
                            <Forms
                                ref={this.levelForm}
                                Callback={this.levelCall}
                                FormFields={this.state.LevelFields}
                            />
                        </Row>
                    </Modal>
                )}
            </>
        );
    }
}

export default Skills;
