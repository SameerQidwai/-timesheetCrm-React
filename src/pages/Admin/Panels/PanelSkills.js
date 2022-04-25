import React, { Component } from "react";
import { Row, Col, Typography, Button, Table, Menu, Dropdown, Popconfirm, Modal, } from "antd";
import { DownOutlined, SettingOutlined, PlusSquareOutlined, MinusCircleOutlined, LoadingOutlined} from "@ant-design/icons"; //Icons

import Form from "../../../components/Core/Forms/Form";

import { getlevels, getSkills, getList, editLabel, addList, delLabel, } from "../../../service/panelSkill";
import { getSkillLevels as selectedSkill } from "../../../service/constant-Apis";
import Operation from "antd/lib/transfer/operation";
import { localStore } from "../../../service/constant";
import { tableSorter, tableTitleFilter } from "../../../components/Core/Table/TableFilter";

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
                                        title="Are you sure, you want to delete?"
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
            loading: false,
            data: [],
            filterData: [],

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
                        key: "label",
                        size: "small",
                        rules: [
                            {
                                required: true,
                                message: "Panel Skill is Required",
                            },
                        ],
                        type: "Input",
                        labelAlign: "left",
                        itemStyle: { marginBottom: "5px" },
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "standard",
                        size: "small",
                        rules: [
                            {
                                required: true,
                                message: "Generic Skill is Required",
                            },
                        ],
                        type: "Select",
                        data: [],
                        onChange: (value, option) =>{
                            if (value){
                                let skill = `skill=${option.value}`
                                selectedSkill(skill).then(res=>{
                                    if(res.success){
                                        const { FormFields_1 } = this.state
                                        const { fields } = FormFields_1
                                        fields.map((el, index)=>{
                                            if(index===1 || index%6===1){
                                                el.data = res.data
                                            }
                                            return el
                                        })
                                        this.setState({
                                            skill_pirority: res.data,
                                            FormFields_1: {...FormFields_1, fields: fields}
                                        })
                                    }
                                })
                            }  
                        },
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
                        onClick: (value, e) =>{
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
                        },
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
                preserve: false,
                FormCol: 24,
                justifyField: "center",
                FormLayout: "inline",
                size: "small",
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
                this.getSkills();
            }
        );
    }
    getSkills = () => {
        getSkills().then((skill_res) => {
            if (skill_res.success) {
                const { FormFields } = this.state;
                FormFields.fields[3].data = skill_res.data;
                this.setState({
                    FormFields,
                });
            }
        });
    };

    getData = () => {
        const { panelId, FormFields, FormFields_1 } = this.state;
        getList(panelId).then((res) => {
            if (res.success) {
                this.setState({
                    data: res.data,
                    filterData: res.data,
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
                    loading: false
                });
            }
        });
    };

    newField = (item_no) => {
        const { skill_pirority } = this.state;
        //inserting new fields in modals
        const splice_key = [ `level${item_no}`, `pirority${item_no}`, `stceil${item_no}`, `ltceil${item_no}`, `id${item_no}`, item_no, ];
        return [
            {
                object: "obj",
                fieldCol: 8,
                layout: { wrapperCol: { span: 20 } },
                key: splice_key[0],
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
                key: splice_key[1],
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
                key: splice_key[2],
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
                key: splice_key[3],
                size: "small",
                // rules:[{ required: true }],
                type: "InputNumber",
                labelAlign: "left",
                itemStyle: { marginBottom: "5px" },
            },
            {
                object: "obj",
                fieldCol: 6,
                key: splice_key[4],
                hidden: true,
                size: "small",
                // rules:[{ required: true }],
                type: "Input",
            },
            {
                fieldCol: 1,
                size: "small",
                Placeholder: <MinusCircleOutlined />,
                key: splice_key[5],
                // rules:[{ required: true }],
                type: "Text",
                style: {
                    textAlign: "right",
                },
                fieldStyle: {
                    cursor: "pointer",
                },
                onClick: (value, e) =>{
                    this.state.FormFields_1.fields = this.state.FormFields_1.fields.filter(
                        (obj) => {
                            return (
                                obj.key !== splice_key[0] &&
                                obj.key !== splice_key[1] &&
                                obj.key !== splice_key[2] &&
                                obj.key !== splice_key[3] &&
                                obj.key !== splice_key[4] &&
                                obj.key !== splice_key[5]
                            );
                        }
                    );

                    this.setState({
                        FormFields_1: this.state.FormFields_1,
                    });
                },
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
                loading: false
            });
        } else {
            this.setState({
                openModal: status,
                FormFields_1: { ...FormFields_1, fields: this.newField(0) },
                editPS: false,
                loading: false
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
        let result = Object.keys(obj).length / 5;
        for (let i = 0; i < result; i++) {
            if(obj[`pirority${i}`]){
                vars.push({
                    id: obj[`id${i}`] ?? 0,
                    levelLabel: obj[`level${i}`],
                    standardLevelId: obj[`pirority${i}`],
                    shortTermCeil: obj[`stceil${i}`],
                    longTermCeil: obj[`ltceil${i}`],
                });
            }
        }
        console.log(vars);
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
        this.setState({ loading: true })
        addList(mergeObj).then((res) => {
            this.getData();
        });
    };

    getRecord = (data, text) => {
        const vars = {};
        const array = data.panelSkillStandardLevels;
        var obj = {
            key: data.id,
            label: data.label,
            standard: data.standardSkill.id,
        };
        selectedSkill(`skill=${obj.standard}`).then(res=>{
            if(res.success){
                this.setState({
                    skill_pirority: res.data
                },()=>{
                    let result = array.length;
                    for (let i = 0; i < result; i++) {
                        this.state.FormFields_1.fields = this.state.FormFields_1.fields.concat(
                            this.newField(i)
                        );
                        let el = array[i];
                        vars[`id${i}`] = el.id;
                        vars[`level${i}`] = el.levelLabel;
                        vars[`pirority${i}`] = el.standardLevel.id;
                        vars[`stceil${i}`] = el.shortTermCeil;
                        vars[`ltceil${i}`] = el.longTermCeil;
                    }
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
                    
                })
            }
        })
        
    };

    editRecord = () => {
        const { mergeObj, editPS } = this.state;
        this.setState({ loading: true })
        mergeObj.id = editPS;
        editLabel(mergeObj).then((res) => {
            if (res) {
                this.getData();
            }
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
        const {data, openModal, editPS, FormFields, FormFields_1, loading, filterData} = this.state;
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
                            <PlusSquareOutlined />
                            Add Skill
                        </Button>
                    </Col>
                </Row>
                <Table
                    title={()=>tableTitleFilter(5, this.generalFilter)}
                    bordered
                    pagination={{pageSize: localStore().pageSize}}
                    rowKey={(data) => data.id}
                    columns={this.columns}
                    dataSource={filterData}
                    size="small"
                />
                {openModal ? (
                    <Modal
                        title={editPS ? "Edit Skill" : "Add Skill"}
                        maskClosable={false}
                        centered
                        visible={openModal}
                        onOk={() => {
                            this.submit();
                        }}
                        okButtonProps={{ disabled: loading }}
                        okText={loading ?<LoadingOutlined /> :"Save"}
                        onCancel={() => { this.toggelModal(false); }}
                        width={700}
                    >
                        <Row>
                            <Form
                                ref={this.dynamoForm_1}
                                Callback={this.Callback}
                                FormFields={FormFields}
                            />
                        </Row>
                        <Row style={{ maxHeight: "145px", overflowY: "auto" }}>
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

export default PanelInfo;
