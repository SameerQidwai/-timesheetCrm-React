import React, { Component } from "react";
import { Modal, Tabs, Row, Col, Button } from "antd";
import {
    UploadOutlined,
    PlusSquareFilled,
    CloseOutlined,
} from "@ant-design/icons"; //Icons

import Form from "../../components/Core/Form";

const { TabPane } = Tabs;

class InfoModal extends Component {
    constructor() {
        super();
        this.basicRef = React.createRef();
        this.billingRef = React.createRef();
        this.detailRef = React.createRef();
        this.skillRef = React.createRef();
        this.exitRef = React.createRef();
        this.state = {
            editOrg: false,
            basicSubmitted: false,
            billingSubmitted: false,
            detailSubmitted: false,
            skillSubmitted: false,
            exitSubmitted: false,
            data: {
                key: 1,
                name: "One_LM",
                ABN: "098908",
                CTI: "09809",
                EBA: "098098",
                SumIns_PI: 98098,
                SumIns_PL: 90809809,
                SumIns_Wc: "10 30 2020",
                Tax_Code: "09809809",
                address: "098098098",
                contact: "9809809",
                contactName: "90809809",
                email: "098908",
                expiry_PI: "10 06 2020",
                expiry_PL: "10 30 2020",
                insurer_PI: "908908",
                insurer_PL: "980980",
                insurer_WC: "98098",
                invoice_email: "9098",
                phone: "908098",
                policy_PI: "098098",
                policy_PL: "098098",
                policy_WC: "9809809",
                website: "098098098",
            },
            BasicFields: {
                //creating Component
                formId: "basic_form",
                FormCol: 24,
                // FieldSpace:24,
                justifyField: "center",
                FormLayout: "inline",
                layout: { labelCol: { span: 10 }, wrapperCol: { span: 0 } },
                size: "middle",
                fields: [
                    {
                        fieldCol: 12, // this is only label
                        size: "small",
                        Placeholder: "Code",
                        type: "Text",
                        labelAlign: "left",
                    },
                    {
                        fieldCol: 12, // this is only label
                        size: "small",
                        Placeholder: "Email",
                        type: "Text",
                        labelAlign: "left",
                    },
                    {
                        object: "basic", //this is field
                        fieldCol: 12,
                        key: "code",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                        labelAlign: "left",
                    },
                    {
                        object: "basic", //this is field
                        fieldCol: 12,
                        key: "email",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                    },
                    {
                        fieldCol: 12, // this is only label
                        size: "small",
                        Placeholder: "First Name",
                        // rules:[{ required: true }],
                        type: "Text",
                        labelAlign: "left",
                    },
                    {
                        fieldCol: 12, // this is only label
                        size: "small",
                        Placeholder: "Last Name",
                        // rules:[{ required: true }],
                        type: "Text",
                        labelAlign: "left",
                    },
                    {
                        object: "basic", //this is field
                        fieldCol: 12,
                        key: "fname",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                        labelAlign: "left",
                    },
                    {
                        object: "basic", //this is field
                        fieldCol: 12,
                        key: "lname",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                        labelAlign: "left",
                    },
                    {
                        fieldCol: 24, // this is only label
                        size: "small",
                        Placeholder: "Role",
                        // rules:[{ required: true }],
                        type: "Text",
                        labelAlign: "left",
                    },
                    {
                        object: "basic", //this is field
                        fieldCol: 24,
                        key: "Role",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Select",
                        labelAlign: "left",
                        wrapperCol: { span: 12 },
                    },
                    {
                        fieldCol: 12, // this is only label
                        size: "small",
                        Placeholder: "Password",
                        mode: false,
                        // rules:[{ required: true }],
                        type: "Text",
                        labelAlign: "left",
                    },
                    {
                        fieldCol: 12, // this is only label
                        size: "small",
                        Placeholder: "Verify Password",
                        // rules:[{ required: true }],
                        mode: false,
                        type: "Text",
                        labelAlign: "left",
                    },
                    {
                        object: "basic", //this is field
                        fieldCol: 12,
                        key: "pass",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Password",
                        labelAlign: "left",
                    },
                    {
                        object: "basic", //this is field
                        fieldCol: 12,
                        key: "vpass",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Password",
                        labelAlign: "left",
                        itemStyle: { marginBottom: "10px" },
                    },
                    {
                        object: "basic", //this is field
                        fieldCol: 12,
                        key: "disabled",
                        size: "small",
                        label: "Is Disabled",
                        // rules:[{ required: true }],
                        valuePropName: "checked",
                        type: "Switch",
                        labelAlign: "left",
                    },
                ],
            },
            DetailFields: {
                formId: "detail_form",
                FormCol: 24,
                FieldSpace: 24,
                justifyField: "center",
                FormLayout: "inline",
                size: "middle",
                fields: [
                    {
                        Placeholder: "Phone",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Next Of Kin",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "detail",
                        fieldCol: 12,
                        key: "phone",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "input",
                    },
                    {
                        object: "detail",
                        fieldCol: 12,
                        key: "nok",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "input",
                    },
                    {
                        Placeholder: "Next Of Kin Number",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Next Of Kin Relation",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "detail",
                        fieldCol: 12,
                        key: "nok_phone",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "input",
                    },
                    {
                        object: "detail",
                        fieldCol: 12,
                        key: "nok_relation",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "input",
                    },
                    {
                        Placeholder: "Date Of Birth",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Start Date",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "detail",
                        fieldCol: 12,
                        key: "dob",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "DatePicker",
                        fieldStyle: { width: "-webkit-fill-available" },
                    },
                    {
                        object: "detail",
                        fieldCol: 12,
                        key: "ks_date",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "DatePicker",
                        fieldStyle: { width: "-webkit-fill-available" },
                    },
                    {
                        Placeholder: "Address",
                        fieldCol: 24,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                    },
                    {
                        object: "detail",
                        fieldCol: 24,
                        key: "address",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                        itemStyle: { marginBottom: "10px" },
                    },
                    {
                        object: "detail",
                        fieldCol: 24,
                        key: "sex",
                        label: "Gender",
                        size: "small",
                        data: [
                            { label: "Male", value: "Male" },
                            { label: "Female", value: "Female" },
                        ],
                        // rules:[{ required: true }],
                        type: "Radio",
                        mode: "button",
                        shape: "solid",
                    },
                ],
            },
            BillingFields: {
                formId: "billing_form",
                FormCol: 24,
                FieldSpace: 24,
                justifyField: "center",
                FormLayout: "inline",
                layout: { labelCol: { span: 9 }, wrapperCol: { span: 0 } },
                size: "middle",
                fields: [
                    {
                        Placeholder: "Payslip Email",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Hourly Rate",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "billing",
                        fieldCol: 12,
                        key: "pay_email",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "input",
                    },
                    {
                        object: "billing",
                        fieldCol: 12,
                        key: "h_rate",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "InputNumber",
                        shape: "$",
                        fieldStyle: { width: "-webkit-fill-available" },
                    },
                    {
                        Placeholder: "Membership A/c no",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Bank Account",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "billing",
                        fieldCol: 12,
                        key: "mem_ac",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "input",
                    },
                    {
                        object: "billing",
                        fieldCol: 12,
                        key: "b_ac",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "input",
                    },
                    {
                        Placeholder: "Pay Frequence",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Start Date",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "billing",
                        fieldCol: 12,
                        key: "pay_f",
                        size: "small",
                        // rules:[{ required: true }],
                        data: [
                            { label: "Daily", value: "daily" },
                            { label: "Weekly", value: "weekly" },
                            { label: "Monthly", value: "monthly" },
                        ],
                        type: "Select",
                    },
                    {
                        object: "billing",
                        fieldCol: 12,
                        key: "s_date",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "DatePicker",
                        fieldStyle: { width: "-webkit-fill-available" },
                    },
                ],
            },
            SkillFields: {
                formId: "skill_form",
                FormCol: 24,
                FieldSpace: 24,
                justifyField: "center",
                FormLayout: "inline",
                layout: { labelCol: { span: 9 }, wrapperCol: { span: 0 } },
                size: "middle",
                fields: this.newSkillField(0),
            },
            ExitFields: {
                formId: "exit_form",
                FormCol: 24,
                FieldSpace: 24,
                justifyField: "center",
                FormLayout: "inline",
                size: "middle",
                fields: [
                    {
                        Placeholder: "Future Contact Email",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Future Contact Mobile",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "exit",
                        fieldCol: 12,
                        key: "fc_email",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                    },
                    {
                        object: "exit",
                        fieldCol: 12,
                        key: "fc_contact",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                    },
                    {
                        Placeholder: "Exit Date",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Last Working Date",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "exit",
                        fieldCol: 12,
                        key: "e_date",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "DatePicker",
                        fieldStyle: { width: "-webkit-fill-available" },
                    },
                    {
                        object: "exit",
                        fieldCol: 12,
                        key: "lw_date",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "lw_date",
                        fieldStyle: { width: "-webkit-fill-available" },
                    },
                    {
                        Placeholder: "Exit Reason Code",
                        fieldCol: 24,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "exit",
                        fieldCol: 12,
                        key: "er_code",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                    },
                ],
            },
        };
    }

    submit = () => {
        //submit button click
        this.basicRef.current.refs.basic_form.submit();
        this.detailRef.current &&
            this.detailRef.current.refs.detail_form.submit();
        this.billingRef.current &&
            this.billingRef.current.refs.billing_form.submit();
        this.skillRef.current && this.skillRef.current.refs.skill_form.submit();
        this.exitRef.current && this.exitRef.current.refs.exit_form.submit();
    };

    BasicCall = (vake) => {
        // this will work after  got  Object from the skill from
        console.log(vake);
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    ...vake.basic,
                },
                basicSubmitted: true, // skill form submitted
            },
            () => {
                if (
                    this.state.basicSubmitted &&
                    this.state.detailSubmitted &&
                    this.state.billingSubmitted &&
                    this.state.skillSubmitted &&
                    this.state.exitSubmitted
                ) {
                    //check if both form is submittef
                    if (!this.props.editOrg) {
                        console.log("emes");
                        this.addEmployee(this.state.mergeObj); //add skill
                    } else {
                        console.log("edit");
                        this.editRecord(this.state.mergeObj); //edit skill
                    }
                }
            }
        );
    };

    BillingCall = (vake) => {
        // this will work after  getting the Object from level form
        console.log(vake);
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    ...vake.billing,
                },
                billingSubmitted: true, // level form submitted
            },
            () => {
                if (
                    this.state.basicSubmitted &&
                    this.state.detailSubmitted &&
                    this.state.billingSubmitted &&
                    this.state.skillSubmitted &&
                    this.state.exitSubmitted
                ) {
                    //check if both form is submittef
                    if (!this.props.editOrg) {
                        console.log("emes");
                        this.addEmployee(this.state.mergeObj); //add skill
                    } else {
                        console.log("edit");
                        this.editRecord(this.state.mergeObj); //edit skill
                    }
                }
            }
        );
    };

    DetailCall = (vake) => {
        // this will work after I get the Object from the form
        console.log(vake);
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    ...vake.detail,
                },
                detailSubmitted: true, // level form submitted
            },
            () => {
                if (
                    this.state.basicSubmitted &&
                    this.state.detailSubmitted &&
                    this.state.billingSubmitted &&
                    this.state.skillSubmitted &&
                    this.state.exitSubmitted
                ) {
                    //check if both form is submittef
                    if (!this.props.editOrg) {
                        console.log("emes");
                        this.addEmployee(this.state.mergeObj); //add skill
                    } else {
                        console.log("edit");
                        this.editRecord(this.state.mergeObj); //edit skill
                    }
                }
            }
        );
    };

    SkillCall = (vake) => {
        // this will work after I get the Object from the form
        console.log(vake);
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    ...vake.skill,
                },
                skillSubmitted: true, // level form submitted
            },
            () => {
                if (
                    this.state.basicSubmitted &&
                    this.state.detailSubmitted &&
                    this.state.billingSubmitted &&
                    this.state.skillSubmitted &&
                    this.state.exitSubmitted
                ) {
                    //check if both form is submittef
                    if (!this.props.editOrg) {
                        console.log("emes");
                        this.addEmployee(this.state.mergeObj); //add skill
                    } else {
                        console.log("edit");
                        this.editRecord(this.state.mergeObj); //edit skill
                    }
                }
            }
        );
    };

    ExitCall = (vake) => {
        // this will work after I get the Object from the form
        console.log(vake);
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    ...vake.exit,
                },
                exitSubmitted: true, // level form submitted
            },
            () => {
                if (
                    this.state.basicSubmitted &&
                    this.state.detailSubmitted &&
                    this.state.billingSubmitted &&
                    this.state.skillSubmitted &&
                    this.state.exitSubmitted
                ) {
                    //check if both form is submittef
                    if (!this.props.editOrg) {
                        console.log("emes");
                        this.addEmployee(this.state.mergeObj); //add skill
                    } else {
                        console.log("edit");
                        this.editRecord(this.state.mergeObj); //edit skill
                    }
                }
            }
        );
    };

    addEmployee = (value) => {
        const { rows, callBack } = this.props;
        value.key = rows; // get new key
        callBack(value, false);
        this.onCancel();
    };

    getRecord = (data) => {
        let basic = {};
        let detail = {};
        let billing = {};
        let skill = {};
        let exit = {};

        this.setState({
            // editOrg: data.key,
            BasicFields: {
                ...this.state.BasicFields,
                initialValues: { obj: basic },
            },
            BillingFields: {
                ...this.state.BillingFields,
                initialValues: { obj: billing },
            },
            DetailFields: {
                ...this.state.DetailFields,
                initialValues: { obj: detail },
            },
            SkillFields: {
                ...this.state.SkillFields,
                initialValues: { obj: skill },
            },
            ExitFields: {
                ...this.state.ExitFields,
                initialValues: { obj: exit },
            },
        });
    };

    editRecord = (value) => {
        const { editOrg, callBack } = this.props;
        value.key = editOrg;
        callBack(value, editOrg);
        this.onCancel();
    };

    onCancel = () => {
        const {
            BasicFields,
            BillingFields,
            DetailFields,
            SkillFields,
            ExitFields,
        } = this.state;

        delete BasicFields.initialValues; // delete initialValues of fields on close
        delete DetailFields.initialValues;
        delete BillingFields.initialValues;
        delete SkillFields.initialValues;
        delete ExitFields.initialValues;
        this.setState(
            {
                basicSubmitted: false,
                detailSubmitted: false,
                billingSubmitted: false,
                skillSubmitted: false,
                exitSubmitted: false,
                BasicFields: { ...BasicFields }, //delete Formfields on Close
                BillingFields: { ...BillingFields },
                DetailFields: { ...DetailFields },
                SkillFields: { ...SkillFields },
                ExitFields: { ...ExitFields },
                mergeObj: {},
            },
            () => {
                this.props.close();
            }
        );
    };

    newSkillField = (item_no) => {
        //inserting new fields in modals
        const splice_key = [`skill${item_no}`, `pirority${item_no}`, item_no];
        return [
            {
                object: "skill",
                fieldCol: 11,
                layout: { wrapperCol: { span: 23 } },
                key: `skill${item_no}`,
                size: "small",
                // rules:[{ required: true }],
                data: this.level_data,
                type: "Select",
                labelAlign: "left",
                itemStyle: { marginBottom: "5px" },
            },
            {
                object: "skill",
                fieldCol: 11,
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
                fieldCol: 2,
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
                    const { SkillFields } = this.state;
                    SkillFields.fields = SkillFields.fields.filter((obj) => {
                        return (
                            obj.key !== splice_key[0] &&
                            obj.key !== splice_key[1] &&
                            obj.key !== splice_key[2]
                        );
                    });

                    this.setState({
                        SkillFields,
                    });
                }.bind(this),
            },
        ];
    };

    insertSkill = () => {
        const { SkillFields } = this.state;
        let obj = SkillFields.fields[SkillFields.fields.length - 1]; // get the inster number for keys
        const item_no = obj ? parseInt(obj.key) + 1 : 0;
        SkillFields.fields = SkillFields.fields.concat(
            ...this.newSkillField(item_no)
        );
        this.setState({
            SkillFields,
        });
    };

    render() {
        const { editOrg, visible } = this.props;
        const {
            BasicFields,
            DetailFields,
            BillingFields,
            SkillFields,
            ExitFields,
        } = this.state;
        return (
            <Modal
                title={editOrg ? "Edit Empolyee" : "Add Empolyee"}
                centered
                visible={visible}
                onOk={() => {
                    this.submit();
                }}
                okText={editOrg ? "Edit" : "Save"}
                onCancel={this.onCancel}
                width={700}
            >
                <Tabs type="card">
                    <TabPane tab="Basic" key="1">
                        <Form
                            ref={this.basicRef}
                            Callback={this.BasicCall}
                            FormFields={BasicFields}
                        />
                    </TabPane>
                    <TabPane tab="Detail" key="2">
                        <Form
                            ref={this.detailRef}
                            Callback={this.DetailCall}
                            FormFields={DetailFields}
                        />
                    </TabPane>
                    <TabPane tab="Billing" key="3">
                        <Form
                            ref={this.billingRef}
                            Callback={this.BillingCall}
                            FormFields={BillingFields}
                        />
                    </TabPane>
                    <TabPane tab="Skill" key="4">
                        <Row justify="end">
                            <Col>
                                <Button
                                    type="primary"
                                    size="small"
                                    onClick={this.insertSkill}
                                >
                                    <PlusSquareFilled /> Insert Skill
                                </Button>
                            </Col>
                            <Col span="24">
                                <Row>
                                    <Col span="11">Skill</Col>
                                    <Col span="11">Level</Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Form
                                ref={this.skillRef}
                                Callback={this.SkillCall}
                                FormFields={SkillFields}
                            />
                        </Row>
                    </TabPane>
                    <TabPane tab="Exit" key="5">
                        <Form
                            ref={this.exitRef}
                            Callback={this.ExitCall}
                            FormFields={ExitFields}
                        />
                    </TabPane>
                </Tabs>
            </Modal>
        );
    }
}

export default InfoModal;
