import React, { Component } from "react";
import { Modal, Tabs, Row, Col, Button, Input } from "antd";
import {
    UploadOutlined,
    PlusSquareFilled,
    CloseOutlined,
} from "@ant-design/icons"; //Icons

import Form from "../../components/Core/Form";
import moment from "moment";

const { TabPane } = Tabs;

class InfoModal extends Component {
    constructor() {
        super();
        this.basicRef = React.createRef();
        this.billingRef = React.createRef();
        this.detailRef = React.createRef();
        this.skillRef = React.createRef();

        this.priority_data = [
            {
                value: 1,
                label: "Superstar",
            },
            {
                value: 2,
                label: "Senior",
            },
            {
                value: 3,
                label: "Middle",
            },
            {
                value: 4,
                label: "Junior",
            },
            {
                value: 5,
                label: "Trainee",
            },
            {
                value: 6,
                label: "Internee",
            },
        ];

        this.skill_data = [
            {
                value: 1,
                label: "Java Developer",
            },
            {
                value: 2,
                label: "Graphic Designer",
            },
            {
                value: 3,
                label: "Python Developer",
            },
            {
                value: 4,
                label: "html/Css",
            },
            {
                value: 5,
                label: "Carpenter",
            },
        ];

        this.state = {
            editClient: false,
            basicSubmitted: false,
            billingSubmitted: false,
            detailSubmitted: false,
            skillSubmitted: false,
            data: {
                code: 1,
                cpCode: "004",
                email: "Trigger@oneLm.com",
                fname: "Charles",
                lname: "Michel",
                role: "006",
                disabled: false,
                phone: "0098287381",
                dob: moment("12 19 1997"),
                s_date: moment("12 19 2020"),
                address: "15 yemen Road, Yemen",
                sex: "Male",
                pay_email: "Trigger.payme@oneLm.com",
                h_rate: "90",
                mem_ac: "98098",
                b_ac: "CPAL98304829101",
                pay_f: "Weekly",
                s_date: moment("12 26 2020"),
                skill: {
                    skill0: 1,
                    pirority0: 2,
                    skill1: 2,
                    pirority1: 4,
                    skill2: 3,
                    pirority2: 6,
                },
                fc_email: "Trigger@gmail.com",
                fc_contact: "0098287381",
                e_date: moment("12 19 2120"),
                lw_date: moment("12 18 2120"),
                er_code: "Retired",
            },
            BasicFields: {
                //creating Component
                formId: "basic_form",
                FormCol: 24,
                // FieldSpace:24,
                justifyField: "center",
                FormLayout: "inline",
                layout: { labelCol: { span: 10 }, wrapperCol: { span: 0 } },
                size: "small",
                fields: [
                    {
                        fieldCol: 12, // this is only label 0
                        size: "small",
                        Placeholder: "Code",
                        type: "Text",
                        labelAlign: "left",
                    },
                    {
                        fieldCol: 12, // this is only label 1
                        size: "small",
                        Placeholder: "Organization",
                        type: "Text",
                        labelAlign: "left",
                    },

                    {
                        object: "basic", //this is field 2
                        fieldCol: 12,
                        key: "code",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                        labelAlign: "left",
                    },
                    {
                        object: "basic", //this is field 3
                        fieldCol: 12,
                        key: "org",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Select",
                        data: [
                            { value: "001", label: "001- One Lm" },
                            { value: "002", label: "002- Globe" },
                            { value: "003", label: "003- Times" },
                            { value: "004", label: "004- Ron" },
                            { value: "005", label: "005- Wardrobe" },
                            { value: "006", label: "006- ICI" },
                        ],
                        labelAlign: "left",
                        itemStyle: { marginBottom: 10 },
                    },
                    {
                        fieldCol: 12, // this is only label 4
                        size: "small",
                        Placeholder: "Email",
                        type: "Text",
                        labelAlign: "left",
                    },
                    {
                        fieldCol: 12, // this is only label 5
                        size: "small",
                        Placeholder: "First Name",
                        // rules:[{ required: true }],
                        type: "Text",
                        labelAlign: "left",
                    },
                    {
                        object: "basic", //this is field 6
                        fieldCol: 12,
                        key: "email",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                        rules: [
                            {
                                type: "email",
                                message: "The input is not valid E-mail!",
                            },
                            {
                                required: true,
                                message: "Please input your E-mail!",
                            },
                        ],
                        itemStyle: { marginBottom: 10 },
                    },
                    {
                        object: "basic", //this is field 7
                        fieldCol: 12,
                        key: "fname",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                        labelAlign: "left",
                        rules: [
                            {
                                required: true,
                                message: "First Name is required",
                            },
                        ],
                        itemStyle: { marginBottom: 10 },
                    },

                    {
                        fieldCol: 24, // this is only label 8
                        size: "small",
                        Placeholder: "Last Name",
                        // rules:[{ required: true }],
                        type: "Text",
                        labelAlign: "left",
                    },
                    {
                        object: "basic", //this is field 9
                        fieldCol: 12,
                        key: "lname",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                        labelAlign: "left",
                        rules: [
                            {
                                required: true,
                                message: "Last Name is required",
                            },
                        ],
                        itemStyle: { marginBottom: 5 },
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
                        fieldCol: 12,
                        key: "role",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Select",
                        labelAlign: "left",
                        data: [
                            { value: "001", label: "001-Developer" },
                            { value: "002", label: "010-Designer" },
                            { value: "003", label: "100-Manger" },
                            { value: "004", label: "110-Carpenter" },
                            { value: "005", label: "101-Assistant" },
                            { value: "006", label: "011-Gamer" },
                            { value: "007", label: "111-Gambler" },
                        ],
                        wrapperCol: { span: 24 },
                        rules: [
                            {
                                required: true,
                                message: "Select the role of Contactor",
                            },
                        ],
                        itemStyle: { marginBottom: 1 },
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
                        Placeholder: "Date Of Birth",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                        itemStyle: { marginBottom: 1 },
                    },

                    {
                        object: "detail",
                        fieldCol: 12,
                        key: "phone",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "input",
                        rules: [
                            {
                                // required: true,
                                type: "string",
                                message: "Enter minimum 8 Numbers",
                                min: 6,
                            },
                        ],
                        itemStyle: { marginBottom: 1 },
                    },
                    {
                        object: "detail",
                        fieldCol: 12,
                        key: "dob",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "DatePicker",
                        fieldStyle: { width: "-webkit-fill-available" },
                        rules: [
                            {
                                required: true,
                                message: "Date of Birth is required",
                            },
                        ],
                        itemStyle: { marginBottom: 1 },
                    },
                    {
                        Placeholder: "Start Date",
                        fieldCol: 24,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "detail",
                        fieldCol: 12,
                        key: "s_date",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "DatePicker",
                        fieldStyle: { width: "-webkit-fill-available" },
                        rules: [
                            {
                                required: true,
                                message: "Start Date is required",
                            },
                        ],
                        itemStyle: { marginBottom: 1 },
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
                        rules: [
                            {
                                required: true,
                                message: "Gender is Obviously required",
                            },
                        ],
                        itemStyle: { marginBottom: 1 },
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
                        rules: [
                            {
                                required: true,
                                message: "Payment Email is required",
                            },
                        ],
                        itemStyle: { marginBottom: 1 },
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
                        rules: [
                            {
                                required: true,
                                message: "How much he Cost",
                            },
                        ],
                        itemStyle: { marginBottom: 1 },
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
                        rules: [
                            {
                                required: true,
                                message: "Member Ship is required",
                            },
                        ],
                        itemStyle: { marginBottom: 1 },
                    },
                    {
                        object: "billing",
                        fieldCol: 12,
                        key: "b_ac",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "input",
                        rules: [
                            {
                                required: true,
                                message: "Account Number",
                            },
                        ],
                        itemStyle: { marginBottom: 1 },
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
                        rules: [
                            {
                                required: true,
                                message: "Payment Frequncy is required",
                            },
                        ],
                        itemStyle: { marginBottom: 1 },
                    },
                    {
                        object: "billing",
                        fieldCol: 12,
                        key: "s_date",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "DatePicker",
                        fieldStyle: { width: "-webkit-fill-available" },
                        rules: [
                            {
                                required: true,
                                message: "Start Date is required",
                            },
                        ],
                        itemStyle: { marginBottom: 1 },
                    },
                ],
            },
            // SkillFields: {
            //     formId: "skill_form",
            //     FormCol: 24,
            //     FieldSpace: 24,
            //     justifyField: "center",
            //     FormLayout: "inline",
            //     layout: { labelCol: { span: 9 }, wrapperCol: { span: 0 } },
            //     size: "middle",
            //     fields: this.newSkillField(0),
            // },
        };
    }

    componentDidMount = () => {
        console.log(this.props);
        if (this.props.editClient) {
            this.getRecord(this.state.data);
        }
    };

    submit = () => {
        //submit button click
        // console.log(this.detailRef.current);
        this.basicRef.current && this.basicRef.current.refs.basic_form.submit();
        this.detailRef.current &&
            this.detailRef.current.refs.detail_form.submit();
        this.billingRef.current &&
            this.billingRef.current.refs.billing_form.submit();
        // this.skillRef.current && this.skillRef.current.refs.skill_form.submit();
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
                    this.state.billingSubmitted
                    // this.state.skillSubmitted
                ) {
                    //check if both form is submittef
                    if (!this.props.editClient) {
                        console.log("emes");
                        this.addClient(this.state.mergeObj); //add skill
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
                    this.state.billingSubmitted
                    // this.state.skillSubmitted
                ) {
                    //check if both form is submittef
                    if (!this.props.editClient) {
                        console.log("emes");
                        this.addClient(this.state.mergeObj); //add skill
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
                    this.state.billingSubmitted
                    // this.state.skillSubmitted
                ) {
                    //check if both form is submittef
                    if (!this.props.editClient) {
                        console.log("emes");
                        this.addClient(this.state.mergeObj); //add skill
                    } else {
                        console.log("edit");
                        this.editRecord(this.state.mergeObj); //edit skill
                    }
                }
            }
        );
    };

    // SkillCall = (vake) => {
    //     // this will work after I get the Object from the form
    //     console.log(vake);
    //     this.setState(
    //         {
    //             mergeObj: {
    //                 ...this.state.mergeObj,
    //                 skill: { ...vake.skill },
    //             },
    //             skillSubmitted: true, // level form submitted
    //         },
    //         () => {
    //             if (
    //                 this.state.basicSubmitted &&
    //                 this.state.detailSubmitted &&
    //                 this.state.billingSubmitted &&
    //                 this.state.skillSubmitted
    //             ) {
    //                 //check if both form is submittef
    //                 if (!this.props.editClient) {
    //                     console.log("emes");
    //                     this.addClient(this.state.mergeObj); //add skill
    //                 } else {
    //                     console.log("edit");
    //                     this.editRecord(this.state.mergeObj); //edit skill
    //                 }
    //             }
    //         }
    //     );
    // };

    // insertSkill = () => {
    //     const { SkillFields } = this.state;
    //     let obj = SkillFields.fields[SkillFields.fields.length - 1]; // get the inster number for keys
    //     const item_no = obj ? parseInt(obj.key) + 1 : 0;
    //     SkillFields.fields = SkillFields.fields.concat(
    //         ...this.newSkillField(item_no)
    //     );
    //     this.setState({
    //         SkillFields,
    //     });
    // };

    // newSkillField = (item_no) => {
    //     //inserting new fields in modals
    //     const splice_key = [`skill${item_no}`, `pirority${item_no}`, item_no];
    //     return [
    //         {
    //             object: "skill",
    //             fieldCol: 11,
    //             layout: { wrapperCol: { span: 23 } },
    //             key: `skill${item_no}`,
    //             size: "small",
    //             // rules:[{ required: true }],
    //             data: this.skill_data,
    //             type: "Select",
    //             labelAlign: "left",
    //             rules: [
    //                 {
    //                     required: true,
    //                     message: "skill is required",
    //                 },
    //             ],
    //         },
    //         {
    //             object: "skill",
    //             fieldCol: 11,
    //             layout: { wrapperCol: { span: 20 } },
    //             key: `pirority${item_no}`,
    //             size: "small",
    //             // rules:[{ required: true }],
    //             data: this.priority_data,
    //             type: "Select",
    //             labelAlign: "left",
    //             itemStyle: { marginBottom: "5px" },
    //             rules: [
    //                 {
    //                     required: true,
    //                     message: "skill is required",
    //                 },
    //             ],
    //         },
    //         {
    //             fieldCol: 2,
    //             size: "small",
    //             Placeholder: <CloseOutlined />,
    //             key: item_no,
    //             // rules:[{ required: true }],
    //             type: "Text",
    //             style: {
    //                 textAlign: "right",
    //             },
    //             fieldStyle: {
    //                 cursor: "pointer",
    //             },
    //             onClick: function func(value, e) {
    //                 const { SkillFields } = this.state;
    //                 SkillFields.fields = SkillFields.fields.filter((obj) => {
    //                     return (
    //                         obj.key !== splice_key[0] &&
    //                         obj.key !== splice_key[1] &&
    //                         obj.key !== splice_key[2]
    //                     );
    //                 });

    //                 this.setState({
    //                     SkillFields,
    //                 });
    //             }.bind(this),
    //         },
    //     ];
    // };

    addClient = (value) => {
        console.log("addClient", value);
        const { rows, callBack } = this.props;
        value.key = rows; // get new key
        callBack(value, false);
        this.onCancel();
    };

    getRecord = (data) => {
        // console.log(data);
        // const { SkillFields } = this.state;

        // let result = data.skill ? Object.keys(data.skill).length / 2 : 0; // field to inserted

        // for (let i = 1; i < result; i++) {
        //     //field insert array
        //     SkillFields.fields = SkillFields.fields.concat(
        //         this.newSkillField(i)
        //     );
        // }

        let basic = {
            // exist: true,
            code: data.code,
            cpCode: data.cpCode,
            email: data.email,
            fname: data.fname,
            lname: data.lname,
            role: data.role,
            disabled: data.disabled,
        };

        let detail = {
            phone: data.phone,
            dob: data.dob,
            s_date: data.s_date,
            address: data.address,
            sex: data.sex,
        };

        let billing = {
            pay_email: data.pay_email,
            h_rate: data.h_rate,
            mem_ac: data.mem_ac,
            b_ac: data.b_ac,
            pay_f: data.pay_f,
            s_date: data.s_date,
        };

        let skill = { ...data.skill };
        // console.log(basic, billing, detail, skill);

        this.basicRef.current.refs.basic_form.setFieldsValue({
            basic: basic,
        });

        this.detailRef.current.refs.detail_form.setFieldsValue({
            detail: detail,
        });

        this.billingRef.current.refs.billing_form.setFieldsValue({
            billing: billing,
        });

        // this.skillRef.current.refs.skill_form.setFieldsValue({
        //     skill: skill,
        // });

        // this.setState({
        //     SkillFields,
        // });
    };

    editRecord = (value) => {
        const { editClient, callBack } = this.props;
        value.key = editClient;
        callBack(value, editClient);
        this.onCancel();
    };

    onCancel = () => {
        const {
            BasicFields,
            BillingFields,
            DetailFields,
            // SkillFields,
        } = this.state;

        delete BasicFields.initialValues; // delete initialValues of fields on close
        delete DetailFields.initialValues;
        delete BillingFields.initialValues;
        // delete SkillFields.initialValues;
        this.setState(
            {
                basicSubmitted: false,
                detailSubmitted: false,
                billingSubmitted: false,
                // skillSubmitted: false,
                BasicFields: { ...BasicFields }, //delete Formfields on Close
                BillingFields: { ...BillingFields },
                DetailFields: { ...DetailFields },
                // SkillFields: { ...SkillFields },
                mergeObj: {},
            },
            () => {
                this.props.close();
            }
        );
    };

    onchecked = (e) => {
        const { name, checked } = e.target;
        console.log(name, checked);
        this.basicRef.current.setFieldsValue({
            email: "mailme.g.com",
        });
        // this.props.form.setFieldsValue({
        //     [fname]: fvalue,
        // });
    };

    render() {
        const { editClient, visible } = this.props;
        const {
            BasicFields,
            DetailFields,
            BillingFields,
            // SkillFields,
        } = this.state;

        return (
            <Modal
                title={editClient ? "Edit Client" : "Add Client"}
                centered
                visible={visible}
                onOk={() => {
                    this.submit();
                }}
                okText={"Save"}
                onCancel={this.onCancel}
                width={700}
            >
                <Tabs type="card">
                    <TabPane tab="Basic" key="1" forceRender>
                        <Form
                            ref={this.basicRef}
                            Callback={this.BasicCall}
                            FormFields={BasicFields}
                        />
                    </TabPane>
                    <TabPane tab="Detail" key="2" forceRender>
                        <Form
                            ref={this.detailRef}
                            Callback={this.DetailCall}
                            FormFields={DetailFields}
                        />
                    </TabPane>
                    <TabPane tab="Billing" key="4" forceRender>
                        <Form
                            ref={this.billingRef}
                            Callback={this.BillingCall}
                            FormFields={BillingFields}
                        />
                    </TabPane>
                    {/* <TabPane tab="Skill" key="5" forceRender>
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
                    </TabPane> */}
                </Tabs>
            </Modal>
        );
    }
}

export default InfoModal;
