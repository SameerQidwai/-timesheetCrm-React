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
        this.smsfRef = React.createRef();
        
        this.state = {
            editEmp: false,
            basicSubmitted: false,
            billingSubmitted: false,
            detailSubmitted: false,
            kinSubmitted: false,
            bankSubmitted: false,
            smsfSubmitted: false,

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
                        fieldCol: 12, // this is only label 4
                        size: "small",
                        Placeholder: "Email",
                        disabled: false,
                        type: "Text",
                        labelAlign: "left",
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
                            { label: "Male", value: "M" },
                            { label: "Female", value: "F" },
                            { label: "Other", value: "O" },
                        ],
                        itemStyle: { marginBottom: 10 },
                        // rules:[{ required: true }],
                        type: "Select",
                        // mode: "button",
                        // shape: "solid",
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
                        Placeholder: "Tax File Number",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                    },
                    {
                        Placeholder: "Tax-free Threshold",
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
                        key: "taxFreeThreshold",
                        size: "small",
                        data: [
                            { label: "Yes", value: true },
                            { label: "No", value: false },
                        ],
                        // rules: [ { required: true, message: "Gender is Obviously required", }, ],
                        type: "Select",
                        // mode: "button",
                        // shape: "solid",
                        itemStyle: { marginBottom: 10 },
                    },
                    {
                        Placeholder: "HELP (HECS)",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                    },
                    {
                        Placeholder: "Superannuation Fund Name",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                    },
                    {
                        object: "detail",
                        fieldCol: 12,
                        key: "helpHECS",
                        size: "small",
                        data: [
                            { label: "Yes", value: true },
                            { label: "No", value: false },
                        ],
                        // rules: [ { required: true, message: "Gender is Obviously required", }, ],
                        type: "Select",
                        // mode: "button",
                        // shape: "solid",
                        itemStyle: { marginBottom: 10 },
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
                        Placeholder: "Membership/Account Number",
                        fieldCol: 24,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
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
                        mode:{ minRows: 6, maxRows:12},
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
                        Placeholder: "Phone",
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
                        Placeholder: "Relationship to Employee",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
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
                        key: "nextOfKinRelation",
                        size: "small",
                        // rules:[{ required: true }],
                        data:[
                            {label: 'Spouse',value:'Spouse' },
                            {label: 'Partner',value:'Partner' },
                            {label: 'Sibling',value:'Sibling' },
                            {label: 'Parent',value:'Parent' },
                            {label: 'Child',value:'Child' },
                            {label: 'Friend',value:'Friend' },
                        ],
                        type: "Select",
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
                        Placeholder: "Bank Account Name",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                    },
                    {
                        Placeholder: "Bank Account Number",
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
                        Placeholder: "BSB Number",
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
                        Placeholder: "Employment Status",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Payslip Email",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
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
                        onChange: function name(value) {
                            const { BillingFields } = this.state
                            if (value === 1){
                                BillingFields.fields[10].Placeholder = "Hourly Base Salary"
                                this.setState({BillingFields})
                            }else{
                                BillingFields.fields[10].Placeholder = "Annual Base Salary"
                                this.setState({BillingFields})
                            }
                        }.bind(this),
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: "Account Number",
                        //     },
                        // ],
                        itemStyle: { marginBottom: 1 },
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
                        Placeholder: "Full Work Hours",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Contract Start Date",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    
                    {
                        object: "billing",
                        fieldCol: 6,
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
                        object: "billing",
                        fieldCol: 6,
                        key: "noOfHoursPer",
                        size: "small",
                        type: "Select",
                        // shape: " Hours",
                        data: [
                            { label: "Daily", value: 2 },
                            { label: "Weekly", value: 3 },
                            { label: "Fortnightly", value: 4 },
                            { label: "Monthly", value: 5 },
                        ],
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
                        Placeholder: "Contract End Date",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Annual Base Salary",
                        fieldCol: 12,
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
                    // {
                    //     Placeholder: "Hourly Rate",
                    //     fieldCol: 12,
                    //     size: "small",
                    //     type: "Text",
                    //     labelAlign: "right",
                    //     // itemStyle:{marginBottom:'10px'},
                    // },
                    {
                        Placeholder: "Pay Frequence",
                        fieldCol: 24,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    // {
                    //     object: "billing",
                    //     fieldCol: 12,
                    //     key: "hourlyrate",
                    //     size: "small",
                    //     type: "InputNumber",
                    //     shape: "$",
                    //     fieldStyle: { width: "100%" },
                    //     // rules: [
                    //     //     {
                    //     //         required: true,
                    //     //         message: "How much he Cost",
                    //     //     },
                    //     // ],
                    //     itemStyle: { marginBottom: 1 },
                    // }, 
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
                        Placeholder: "Comments",
                        fieldCol: 24,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "billing",
                        fieldCol: 24,
                        key: "comments",
                        size: "small",
                        type: "Textarea",
                        itemStyle: { marginBottom: 1 },
                    },
                ],
            },

            SmsfFields: {
                formId: "smsf_form",
                FormCol: 24,
                FieldSpace: 24,
                justifyField: "center",
                FormLayout: "inline",
                size: "middle",
                fields:[
                    {
                        Placeholder: "SMSF Name",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                    },
                    {
                        Placeholder: "SMSF ABN",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                    },
                    {
                        object: "smsf",
                        fieldCol: 12,
                        key: "smsfName",
                        size: "small",
                        type: "Input",
                        itemStyle: { marginBottom: "10px" },
                    },
                    {
                        object: "smsf",
                        fieldCol: 12,
                        key: "smsfABN",
                        size: "small",
                        type: "Input",
                        itemStyle: { marginBottom: "10px" },
                    },
                    {
                        Placeholder: "ESA Address",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                    },
                    {
                        Placeholder: "Bank Account Name",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                    },
                    {
                        object: "smsf",
                        fieldCol: 12,
                        key: "smsfAddress",
                        size: "small",
                        type: "Input",
                        itemStyle: { marginBottom: "10px" },
                    },
                    {
                        object: "smsf",
                        fieldCol: 12,
                        key: "smsfBankName",
                        size: "small",
                        type: "Input",
                        itemStyle: { marginBottom: "10px" },
                    },
                    {
                        Placeholder: "BSB Number",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                    },
                    {
                        Placeholder: "Bank Account Number",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                    },
                    {
                        object: "smsf",
                        fieldCol: 12,
                        key: "smsfBankBsb",
                        size: "small",
                        type: "Input",
                        itemStyle: { marginBottom: "10px" },
                    },
                    {
                        object: "smsf",
                        fieldCol: 12,
                        key: "smsfBankAccountNo",
                        size: "small",
                        type: "Input",
                        itemStyle: { marginBottom: "10px" },
                    },
                ]
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
        this.smsfRef.current && this.smsfRef.current.refs.smsf_form.submit();
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
                    this.state.billingSubmitted &&
                    this.state.smsfSubmitted 
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
        // cnecking if type is selected
        if (vake.billing.type ){
            vake.billing.type === 1 ? vake.billing.remunerationAmountPer = 1 : vake.billing.remunerationAmountPer = 7
            //check what type is selected
        }
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
                    this.state.billingSubmitted &&
                    this.state.smsfSubmitted 
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
                    this.state.billingSubmitted  &&
                    this.state.smsfSubmitted 
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
                    this.state.billingSubmitted &&
                    this.state.smsfSubmitted 
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
        const { bank } = vake
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    ...{
                        smsfBankAccountId: bank.smsfBankAccountId? bank.smsfBankAccountId: '',
                        bankName: bank.name? bank.name: '',
                        bankAccountNo: bank.accountNo? bank.accountNo: '',
                        bankBsb: bank.bsb? bank.bsb: '',
                    },
                },
                bankSubmitted: true, // level form submitted
            },
            () => {
                if (
                    this.state.basicSubmitted &&
                    this.state.kinSubmitted &&
                    this.state.bankSubmitted &&
                    this.state.detailSubmitted &&
                    this.state.billingSubmitted &&
                    this.state.smsfSubmitted 
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

    SmsfCall = (vake) => {
        // this will work after I get the Object from the form
        console.log(vake);
        const { smsf } = vake
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    ...{ // to send the defaut value
                        smsfName: smsf.smsfName? smsf.smsfName: '', 
                        smsfABN: smsf.smsfABN? smsf.smsfABN: '',
                        smsfAddress: smsf.smsfAddress? smsf.smsfAddress: '',
                        smsfBankName: smsf.smsfBankName? smsf.smsfBankName: '',
                        smsfBankBsb: smsf.smsfBankBsb? smsf.smsfBankBsb: '',
                        smsfBankAccountNo: smsf.smsfBankAccountNo? smsf.smsfBankAccountNo: '',
                    },
                },
                smsfSubmitted: true, // level form submitted
            },
            () => {
                if (
                    this.state.basicSubmitted &&
                    this.state.kinSubmitted &&
                    this.state.bankSubmitted &&
                    this.state.detailSubmitted &&
                    this.state.billingSubmitted &&
                    this.state.smsfSubmitted 
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
        this.setState({
            basicSubmitted: false,
            kinSubmitted: false,
            bankSubmitted: false,
            detailSubmitted: false,
            billingSubmitted: false,
            smsfSubmitted: false,
        })
        addList(data).then(res=>{
            console.log(res);
            if(res.success){
                console.log(res.data, false);
                callBack(res.data, false);
            }
        })
    };

    getRecord = (id) => {
        console.log('getRecord');
        getRecord(id).then(res=>{
            if (res.success){
                console.log(res.smsf);
                this.basicRef.current.refs.basic_form.setFieldsValue({ basic: res.basic, });

                this.detailRef.current.refs.detail_form.setFieldsValue({ detail: res.detail, });

                this.kinRef.current.refs.kin_form.setFieldsValue({ kin: res.kin, });

                this.bankRef.current.refs.bank_form.setFieldsValue({ bank: res.bank, });

                this.billingRef.current.refs.billing_form.setFieldsValue({ billing: res.billing, })

                this.smsfRef.current.refs.smsf_form.setFieldsValue({ smsf: res.smsf, })
            }
        })
    };

    editRecord = (value) => {
        const { editEmp, callBack } = this.props;
        this.setState({
            basicSubmitted: false,
            kinSubmitted: false,
            bankSubmitted: false,
            detailSubmitted: false,
            billingSubmitted: false,
            smsfSubmitted: false,
        })
        editList(editEmp, value).then((res) => {
            if(res.success){
                console.log('hereh');
                callBack()
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
        const { BasicFields, DetailFields, KinFields, BankFields, BillingFields, SmsfFields,  CONTACT, sContact } = this.state;

        return (
            <Modal
                title={editEmp ? "Edit Employee" : "Add Employee"}
                maskClosable={false}
                centered
                visible={visible}
                onOk={() => {
                    this.submit();
                }}
                okText={"Save"}
                onCancel={this.onCancel}
                width={900}
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
                    <TabPane tab="Personal Details" key="details" forceRender>
                        <Form
                            ref={this.basicRef}
                            Callback={this.BasicCall}
                            FormFields={BasicFields}
                        />
                    </TabPane>
                    <TabPane tab=" Employment Contracts" key="contract" forceRender>
                        <Form
                            ref={this.billingRef}
                            Callback={this.BillingCall}
                            FormFields={BillingFields}
                        />
                    </TabPane>
                    <TabPane tab="Superannuation" key="superannuation" forceRender>
                        <Form
                            ref={this.detailRef}
                            Callback={this.DetailCall}
                            FormFields={DetailFields}
                        />
                    </TabPane>
                    <TabPane tab="Next of Kin" key="kin" forceRender>
                        <Form
                            ref={this.kinRef}
                            Callback={this.KinCall}
                            FormFields={KinFields}
                        />
                    </TabPane>
                    <TabPane tab="Banking Details" key="bank" forceRender>
                        <Form
                            ref={this.bankRef}
                            Callback={this.BankCall}
                            FormFields={BankFields}
                        />
                    </TabPane>
                    <TabPane tab=" SMSF Details" key="SMSF" forceRender>
                        <Form
                            ref={this.smsfRef}
                            Callback={this.SmsfCall}
                            FormFields={SmsfFields}
                        />
                    </TabPane>
                </Tabs>
            </Modal>
        );
    }
}

export default InfoModal;
