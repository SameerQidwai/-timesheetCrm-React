import React, { Component } from "react";
import { Modal, Tabs, Row, Col, Button, Input, Select } from "antd";
import { UploadOutlined, PlusSquareFilled, CloseOutlined, } from "@ant-design/icons"; //Icons

import Form from "../../components/Core/Form";
import moment from "moment";

import { getOrgPersons, getStates } from "../../service/constant-Apis";
import { getContactRecord } from "../../service/conatct-person";
import { addList, getRecord, editList } from "../../service/Employees";
const { TabPane } = Tabs;

class InfoModal extends Component {
    constructor() {
        super();
        this.basicRef = React.createRef();
        this.billingRef = React.createRef();
        this.detailRef = React.createRef();
        this.kinRef = React.createRef();
        this.detailRef = React.createRef();
        this.bankRef = React.createRef();
        
        this.state = {
            editEmp: false,
            basicSubmitted: false,
            billingSubmitted: false,
            detailSubmitted: false,
            kinSubmitted: false,
            bankSubmitted: false,

            CONTACT:[],
            sContact: null,
            data: {
                code: 1,
                cpCode: "004",
                email: "Trigger@oneLm.com",
                firstName: "Charles",
                lastName: "Michel",
                role: "006",
                disabled: false,
                phoneNumber: "0098287381",
                dateOfBirth: moment("12 19 1997"),
                s_date: moment("12 19 2020"),
                address: "15 yemen Road, Yemen",
                gender: "Male",
                pay_email: "Trigger.payme@oneLm.com",
                h_rate: "90",
                mem_ac: "98098",
                b_ac: "CPAL98304829101",
                pay_f: "Weekly",
                s_date: moment("12 26 2020"),
                fc_email: "Trigger@gmail.com",
                fc_contact: "0098287381",
                e_date: moment("12 19 2120"),
                lw_date: moment("12 18 2120"),
                er_code: "Retired",
                nok_name: "Jeanne Michel",
                nok_phone: "0098287382",
                nok_relation: "Daughter",
                nok_gender: "Female",
                nok_dob: moment("12 19 2022"),
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
                        fieldCol: 12, // this is only label 1
                        size: "small",
                        Placeholder: "Contact person Code",
                        type: "Text",
                        labelAlign: "left",
                        disabled: true,
                    },
                    {
                        fieldCol: 12, // this is only label 4
                        size: "small",
                        Placeholder: "Email",
                        disabled: false,
                        type: "Text",
                        labelAlign: "left",
                    },
                    {
                        object: "basic", //this is field 3
                        fieldCol: 12,
                        key: "cpCode",
                        size: "small",
                        disabled: true,
                        // rules:[{ required: true }],
                        type: "Input",
                        labelAlign: "left",
                        itemStyle: { marginBottom: 10 },
                    },
                    {
                        object: "basic", //this is field 6
                        fieldCol: 12,
                        key: "email",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                        disabled: false,
                        // rules: [
                        //     {
                        //         type: "email",
                        //         message: "The input is not valid E-mail!",
                        //     },
                        //     {
                        //         required: true,
                        //         message: "Please input your E-mail!",
                        //     },
                        // ],
                        itemStyle: { marginBottom: 10 },
                    },
                    {
                        fieldCol: 12, // this is only label 5
                        size: "small",
                        Placeholder: "First Name",
                        disabled: false,
                        // rules:[{ required: true }],
                        type: "Text",
                        labelAlign: "left",
                    },
                    {
                        fieldCol: 12, // this is only label 8
                        size: "small",
                        Placeholder: "Last Name",
                        disabled: false,
                        // rules:[{ required: true }],
                        type: "Text",
                        labelAlign: "left",
                    },
                    {
                        object: "basic", //this is field 7
                        fieldCol: 12,
                        key: "firstName",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                        labelAlign: "left",
                        disabled: false,
                        rules: [
                            {
                                required: true,
                                message: "First Name is required",
                            },
                        ],
                        itemStyle: { marginBottom: 10 },
                    },
                    {
                        object: "basic", //this is field 9
                        fieldCol: 12,
                        key: "lastName",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                        labelAlign: "left",
                        disabled: false,
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: "Last Name is required",
                        //     },
                        // ],
                        itemStyle: { marginBottom: 5 },
                    },
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
                        object: "basic",
                        fieldCol: 12,
                        key: "phoneNumber",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "input",
                        // rules: [
                        //     {
                        //         // required: true,
                        //         type: "string",
                        //         message: "Enter minimum 8 Numbers",
                        //         min: 6,
                        //     },
                        // ],
                        itemStyle: { marginBottom: 10 },
                    },
                    {
                        object: "basic",
                        fieldCol: 12,
                        key: "dateOfBirth",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "DatePicker",
                        fieldStyle: { width: "100%" },
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: "Date of Birth is required",
                        //     },
                        // ],
                        itemStyle: { marginBottom: 10 },
                    },
                    {
                        Placeholder: "Gender",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "State",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "basic",
                        fieldCol: 12,
                        key: "gender",
                        size: "small",
                        data: [
                            { label: "Male", value: "Male" },
                            { label: "Female", value: "Female" },
                        ],
                        itemStyle: { marginBottom: 10 },
                        // rules:[{ required: true }],
                        type: "Radio",
                        mode: "button",
                        shape: "solid",
                    },
                    {
                        object: "basic",
                        fieldCol: 12,
                        key: "stateId",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Select",
                        data: [],
                        itemStyle: { marginBottom: 10 },
                    },
                    {
                        Placeholder: "Address",
                        fieldCol: 24,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                    },
                    {
                        object: "basic",
                        fieldCol: 24,
                        key: "address",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                        itemStyle: { marginBottom: "10px" },
                    },
                ],
            },

            DetailFields:{
                formId: "detail_form",
                FormCol: 24,
                FieldSpace: 24,
                justifyField: "center",
                FormLayout: "inline",
                size: "middle",
                fields: [
                    {
                        Placeholder: "TFN",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                    },
                    {
                        Placeholder: "Annuation Id",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                    },
                    {
                        object: "detail",
                        fieldCol: 12,
                        key: "tfn",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                        itemStyle: { marginBottom: "10px" },
                    },
                    {
                        object: "detail",
                        fieldCol: 12,
                        key: "superAnnuationId",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                        itemStyle: { marginBottom: "10px" },
                    },
                    {
                        Placeholder: "Annuation Name",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                    },
                    {
                        Placeholder: "Member Number",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                    },
                    {
                        object: "detail",
                        fieldCol: 12,
                        key: "superAnnuationName",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                        itemStyle: { marginBottom: "10px" },
                    },
                    {
                        object: "detail",
                        fieldCol: 12,
                        key: "memberNumber",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                        itemStyle: { marginBottom: "10px" },
                    },
                    {
                        Placeholder: "SMSF Bank Account Id",
                        fieldCol: 24,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                    },
                    {
                        object: "detail",
                        fieldCol: 12,
                        key: "smsfBankAccountId",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                        itemStyle: { marginBottom: "10px" },
                    },
                    {
                        Placeholder: "Training",
                        fieldCol: 24,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                    },
                    {
                        object: "detail",
                        fieldCol: 24,
                        key: "training",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Textarea",
                    },
                ]
            },

            KinFields: {
                formId: "kin_form",
                FormCol: 24,
                FieldSpace: 24,
                justifyField: "center",
                FormLayout: "inline",
                size: "middle",
                fields: [
                    {
                        Placeholder: "Name",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Number",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "kin",
                        fieldCol: 12,
                        key: "nextOfKinName",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "input",
                        // rules: [
                        //     {
                        //         // required: true,
                        //         type: "string",
                        //         message: "Enter minimum 8 Numbers",
                        //         min: 6,
                        //     },
                        // ],
                        itemStyle: { marginBottom: 1 },
                    },
                    {
                        object: "kin",
                        fieldCol: 12,
                        key: "nextOfKinPhoneNumber",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "input",
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: "First Name is required",
                        //     },
                        // ],
                        itemStyle: { marginBottom: 1 },
                    },
                    {
                        Placeholder: "Email",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Relation",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "kin",
                        fieldCol: 12,
                        key: "nextOfKinRelation",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "input",
                    },
                    {
                        object: "kin",
                        fieldCol: 12,
                        key: "nextOfKinEmail",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "input",
                        itemStyle:{marginBottom:10},
                    },
                    {
                        object: "kin",
                        fieldCol: 12,
                        key: "nextOfKinGender",
                        label: "Gender",
                        size: "small",
                        data: [
                            { label: "Male", value: "Male" },
                            { label: "Female", value: "Female" },
                        ],
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: "Gender is Obviously required",
                        //     },
                        // ],
                        itemStyle: { marginBottom: 1 },
                        // rules:[{ required: true }],
                        type: "Radio",
                        mode: "button",
                        shape: "solid",
                    },                    
                ],
            },

            BankFields: {
                formId: "bank_form",
                FormCol: 24,
                FieldSpace: 24,
                justifyField: "center",
                FormLayout: "inline",
                size: "middle",
                fields:[
                    {
                        Placeholder: "Bank Name",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                    },
                    {
                        Placeholder: "Bank Account No",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                    },
                    {
                        object: "bank",
                        fieldCol: 12,
                        key: "bankName",
                        size: "small",
                        type: "Input",
                        itemStyle: { marginBottom: "10px" },
                    },
                    {
                        object: "bank",
                        fieldCol: 12,
                        key: "bankAccountNo",
                        size: "small",
                        type: "Input",
                        itemStyle: { marginBottom: "10px" },
                    },
                    {
                        Placeholder: "Bank BSB",
                        fieldCol: 24,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                    },
                    {
                        object: "bank",
                        fieldCol: 12,
                        key: "bankBsb",
                        size: "small",
                        type: "Input",
                        itemStyle: { marginBottom: "10px" },
                    },
                ]
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
                        Placeholder: "Work Hours In a Day",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "billing",
                        fieldCol: 12,
                        key: "payslipEmail",
                        size: "small",
                        type: "input",
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: "Payment Email is required",
                        //     },
                        // ],
                        itemStyle: { marginBottom: 1 },
                    },
                    {
                        object: "billing",
                        fieldCol: 12,
                        key: "noOfHours",
                        size: "small",
                        type: "InputNumber",
                        // shape: " Hours",
                        fieldStyle: { width: "100%" },
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: "How much he Cost",
                        //     },
                        // ],
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
                        Placeholder: "Type",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "billing",
                        fieldCol: 12,
                        key: "membershipAccountNo",
                        size: "small",
                        type: "input",
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: "Member Ship is required",
                        //     },
                        // ],
                        itemStyle: { marginBottom: 1 },
                    },
                    {
                        object: "billing",
                        fieldCol: 12,
                        key: "type",
                        size: "small",
                        data: [
                            { label: "Casual", value: 1 },
                            { label: "Part Time", value: 2 },
                            { label: "Full Time", value: 3 },
                        ],
                        type: "Select",
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: "Account Number",
                        //     },
                        // ],
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
                        Placeholder: "Remuneration Frequancy",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "billing",
                        fieldCol: 12,
                        key: "payFrequency",
                        size: "small",
                        data: [
                            { label: "Hourly", value: 1 },
                            { label: "Daily", value: 2 },
                            { label: "Weekly", value: 3 },
                            { label: "Fortnightly", value: 4 },
                            { label: "Monthly", value: 5 },
                        ],
                        type: "Select",
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: "Payment Frequncy is required",
                        //     },
                        // ],
                        itemStyle: { marginBottom: 1 },
                    },
                    {
                        object: "billing",
                        fieldCol: 12,
                        key: "remunerationAmountPer",
                        size: "small",
                        data: [
                            { label: "Hourly", value: 1 },
                            { label: "Daily", value: 2 },
                            { label: "Weekly", value: 3 },
                            { label: "Fortnightly", value: 4 },
                            { label: "Monthly", value: 5 },
                            { label: "Yearly", value: 6 },
                        ],
                        type: "Select",
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: "Payment Frequncy is required",
                        //     },
                        // ],
                        itemStyle: { marginBottom: 1 },
                    },
                    {
                        Placeholder: "Remuneration Amount",
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
                        key: "remunerationAmount",
                        size: "small",
                        type: "InputNumber",
                        shape: "$",
                        fieldStyle: { width: "100%" },
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: "How much he Cost",
                        //     },
                        // ],
                        itemStyle: { marginBottom: 1 },
                    },
                    
                    {
                        object: "billing",
                        fieldCol: 12,
                        key: "startDate",
                        size: "small",
                        type: "DatePicker",
                        fieldStyle: { width: "100%" },
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: "Start Date is required",
                        //     },
                        // ],
                        itemStyle: { marginBottom: 1 },
                    },
                    {
                        Placeholder: "End Date",
                        fieldCol: 24,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                   
                    {
                        object: "billing",
                        fieldCol: 12,
                        key: "endDate",
                        size: "small",
                        type: "DatePicker",
                        fieldStyle: { width: "100%" },
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: "Start Date is required",
                        //     },
                        // ],
                        itemStyle: { marginBottom: 1 },
                    },
                ],
            },
        };
    }

    componentDidMount = () => {
        // console.log(this.props);
        const { editEmp } = this.props
        this.fetchAll(editEmp)
    };

    fetchAll = (edit) =>{
        console.log(edit);
        const { editEmp } = this.props
        Promise.all([ getStates(), edit ? this.getRecord(editEmp) : getOrgPersons(1) ])
        .then(res => {
            const { BasicFields } = this.state
            BasicFields.fields[15].data = res[0].data;
                this.setState({
                    BasicFields,
                    CONTACT: !edit ? res[1].data: [],
                })
        })
        .catch(e => {
            console.log(e);
        })
    }

    submit = () => {
        this.basicRef.current && this.basicRef.current.refs.basic_form.submit();
        this.detailRef.current && this.detailRef.current.refs.detail_form.submit();
        this.kinRef.current && this.kinRef.current.refs.kin_form.submit();
        this.bankRef.current && this.bankRef.current.refs.bank_form.submit();
        this.billingRef.current && this.billingRef.current.refs.billing_form.submit();
    };

    BasicCall = (vake) => {
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
                    this.state.kinSubmitted &&
                    this.state.bankSubmitted &&
                    this.state.billingSubmitted 
                ) {
                    //check if both form is submittef
                    if (!this.props.editEmp) {
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
        vake.billing.noOfHoursPer =1
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    latestEmploymentContract: vake.billing,
                },
                billingSubmitted: true, // level form submitted
            },
            () => {
                if (
                    this.state.basicSubmitted &&
                    this.state.detailSubmitted &&
                    this.state.kinSubmitted &&
                    this.state.bankSubmitted &&
                    this.state.billingSubmitted 
                ) {
                    //check if both form is submittef
                    if (!this.props.editEmp) {
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
                    this.state.kinSubmitted &&
                    this.state.bankSubmitted &&
                    this.state.billingSubmitted  
                ) {
                    //check if both form is submittef
                    if (!this.props.editEmp) {
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

    KinCall = (vake) => {
        // this will work after I get the Object from the form
        console.log(vake);
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    ...vake.kin,
                },
                kinSubmitted: true, // level form submitted
            },
            () => {
                if (
                    this.state.basicSubmitted &&
                    this.state.kinSubmitted &&
                    this.state.bankSubmitted &&
                    this.state.detailSubmitted &&
                    this.state.billingSubmitted 
                ) {
                    //check if both form is submittef
                    if (!this.props.editEmp) {
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

    BankCall = (vake) => {
        // this will work after I get the Object from the form
        console.log(vake);
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    ...vake.bank,
                },
                bankSubmitted: true, // level form submitted
            },
            () => {
                if (
                    this.state.basicSubmitted &&
                    this.state.kinSubmitted &&
                    this.state.bankSubmitted &&
                    this.state.detailSubmitted &&
                    this.state.billingSubmitted 
                ) {
                    //check if both form is submittef
                    if (!this.props.editEmp) {
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

    addEmployee = (data) => {
        console.log("addEmployee", data);
        const { callBack } = this.props;
        const { sContact } = this.state
        data.contactPersonId = sContact
        // value.key = rows; // get new key
        console.log(data);
        addList(data).then(res=>{
            console.log(res);
            if(res.success){
                console.log(res.data, false);
                callBack(res.data, false);
            }else{
                this.setState({
                    basicSubmitted: false,
                    kinSubmitted: false,
                    bankSubmitted: false,
                    detailSubmitted: false,
                    billingSubmitted: false,
                })
            }
        })
    };

    getRecord = (id) => {
        console.log('getRecord');
        getRecord(id).then(res=>{
            if (res.success){
                this.basicRef.current.refs.basic_form.setFieldsValue({ basic: res.basic, });

                this.detailRef.current.refs.detail_form.setFieldsValue({ detail: res.detail, });

                this.kinRef.current.refs.kin_form.setFieldsValue({ kin: res.kin, });

                this.bankRef.current.refs.bank_form.setFieldsValue({ bank: res.bank, });

                this.billingRef.current.refs.billing_form.setFieldsValue({ billing: res.billing, })
            }
        })
    };

    editRecord = (value) => {
        const { editEmp, callBack } = this.props;
        editList(editEmp, value).then((res) => {
            if(res.success){
                console.log('hereh');
                callBack()
            }else{
                this.setState({
                    basicSubmitted: false,
                    kinSubmitted: false,
                    bankSubmitted: false,
                    detailSubmitted: false,
                    billingSubmitted: false,
                })
            }
        });
    };

    onCancel = () => {
        const { BasicFields, BillingFields, DetailFields, KinFields, BankFields} = this.state;

        delete BasicFields.initialValues; // delete initialValues of fields on close
        delete DetailFields.initialValues;
        delete KinFields.initialValues;
        delete BillingFields.initialValues;
        this.setState(
            {
                basicSubmitted: false,
                detailSubmitted: false,
                billingSubmitted: false,
                BasicFields: { ...BasicFields }, //delete Formfields on Close
                BillingFields: { ...BillingFields },
                DetailFields: { ...DetailFields },
                mergeObj: {},
            },
            () => {
                this.props.close();
            }
        );
    };

    onContact = (value) => {
        console.log(value);
        getContactRecord(value).then(res=>{
            if(res.success){
                console.log(res.data);
                res.data.cpCode = `Emp-00${res.data.id}`
                res.data.dateOfBirth = res.data.dateOfBirth && moment(res.data.dateOfBirth) 
                this.basicRef.current.refs.basic_form.setFieldsValue({ basic: res.data, });
                this.setState({sContact: value})
            }
        })
    };
    
    onContactClear = () =>{
        this.setState({
            sContact: null,
        },()=>{
            console.log('sameer');
            this.basicRef.current.refs.basic_form.resetFields();
        })
    }

    render() {
        const { editEmp, visible } = this.props;
        const { BasicFields, DetailFields, KinFields, BankFields, BillingFields, CONTACT, sContact } = this.state;

        return (
            <Modal
                title={editEmp ? "Edit Employee" : "Add Employee"}
                centered
                visible={visible}
                onOk={() => {
                    this.submit();
                }}
                okText={"Save"}
                onCancel={this.onCancel}
                width={700}
            >
                {!editEmp &&<Row style={{marginBottom:"1em"}}>
                    <Select
                        value={sContact}
                        placeholder="Contact Person"
                        options={CONTACT}
                        showArrow
                        showSearch
                        size="small"
                        allowClear
                        onClear={this.onContactClear}
                        onChange={this.onContact}
                        optionFilterProp="label"
                        filterOption={
                            (input, option) =>
                                option.label
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            // console.log(option.label)
                            // console.log(input.toLowerCase())
                        }
                        style={{width:"20em"}}
                    />
                    </Row>}
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
                    <TabPane tab="Next Of Kin" key="3" forceRender>
                        <Form
                            ref={this.kinRef}
                            Callback={this.KinCall}
                            FormFields={KinFields}
                        />
                    </TabPane>
                    <TabPane tab="Bank" key="4" forceRender>
                        <Form
                            ref={this.bankRef}
                            Callback={this.BankCall}
                            FormFields={BankFields}
                        />
                    </TabPane>
                    <TabPane tab="Contarct" key="5" forceRender>
                        <Form
                            ref={this.billingRef}
                            Callback={this.BillingCall}
                            FormFields={BillingFields}
                        />
                    </TabPane>
                </Tabs>
            </Modal>
        );
    }
}

export default InfoModal;
