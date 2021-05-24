import React, { Component } from "react";
import { Modal, Tabs, Row, Col, Button, Input, Select, Form as AntForm  } from "antd";
import { LoadingOutlined } from "@ant-design/icons"; //Icons

import Form from "../../../components/Core/Form";
import moment from "moment";

import { getOrgPersons, getStates } from "../../../service/constant-Apis";
import { getContactRecord } from "../../../service/conatct-person";
import { addList, getRecord, editList } from "../../../service/Employees";
const { TabPane } = Tabs;

class InfoModal extends Component {
    constructor() {
        super();
        this.basicRef = React.createRef();
        this.billingRef = React.createRef();
        this.detailRef = React.createRef();
        this.kinRef = React.createRef();
        this.bankRef = React.createRef();
        this.trainRef = React.createRef();
        this.emailRef = React.createRef();
        
        this.state = {
            editEmp: false,
            basicSubmitted: false,
            billingSubmitted: false,
            detailSubmitted: false,
            kinSubmitted: false,
            bankSubmitted: false,
            trainSubmitted: false,
            emailSubmitted: false,
            loading: false,
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
                        rangeMin: true,
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
                        readOnly: true,
                        rules:[{ required: true, message: 'Select Contact Person !!' }],
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
                        Placeholder: "Last Name",
                        fieldCol: 12, // this is only label 8
                        size: "small",
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
                        type: "input",
                        itemStyle: { marginBottom: 10 },
                    },
                    {
                        object: "basic", //this is field 6
                        fieldCol: 12,
                        key: "email",
                        size: "small",
                        type: "Input",
                        disabled: false,
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
                        Placeholder: "Superannuation Fund/ SMSF Name",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                    },
                    {
                        Placeholder: "Account type",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                    },
                    {
                        object: "detail",
                        fieldCol: 12,
                        key: "superannuationName",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                        itemStyle: { marginBottom: "10px" },
                    },
                    {
                        object: "detail",
                        fieldCol: 12,
                        key: "superannuationType",
                        size: "small",
                        data: [
                            { label: "Public", value: 'P' },
                            { label: "SMSF", value: 'S' },
                        ],
                        // rules: [ { required: true, message: "Gender is Obviously required", }, ],
                        type: "Select",
                        itemStyle: { marginBottom: 10 },
                        onChange: (value) =>{
                            this.onFundType(value)
                        }
                    },

                    // {
                    //     Placeholder: "Training",
                    //     fieldCol: 24,
                    //     size: "small",
                    //     type: "Text",
                    //     labelAlign: "right",
                    // },
                    // {
                    //     object: "detail",
                    //     fieldCol: 24,
                    //     key: "training",
                    //     size: "small",
                    //     mode:{ minRows: 6, maxRows:12},
                    //     // rules:[{ required: true }],
                    //     type: "Textarea",
                    // },
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
                        onChange: (e)=>{
                            this.setBankReq(e)
                        },
                        itemStyle: { marginBottom: 10 },
                    },
                    {
                        object: "bank",
                        fieldCol: 12,
                        key: "bankAccountNo",
                        size: "small",
                        type: "Input",
                        onChange: (e)=>{
                            this.setBankReq(e)
                        },
                        itemStyle: { marginBottom: 10 },
                    },
                    {
                        Placeholder: "BSB Number",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                    },
                    {
                        Placeholder: "Tax File Number",
                        fieldCol: 12,
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
                        onChange: (e)=>{
                            this.setBankReq(e)
                        },
                        itemStyle: { marginBottom: 10 },
                    },
                    {
                        object: "bank",
                        fieldCol: 12,
                        key: "tfn",
                        size: "small",
                        type: "Input",
                        onChange: (e)=>{
                            this.setBankReq(e)
                        },
                        itemStyle: { marginBottom: 10 },
                    },
                    {
                        Placeholder: "Tax-free Threshold",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                    },
                    {
                        Placeholder: "HELP (HECS)",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                    },
                    {
                        object: "bank",
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
                        object: "bank",
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
                        rangeMin: true,
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
                        rules: [ { required: true, message: "Status is Required", }, ],
                        itemStyle: { marginBottom: 1 },
                    },
                    {
                        object: "billing",
                        fieldCol: 12,
                        key: "payslipEmail",
                        size: "small",
                        type: "input",
                        itemStyle: { marginBottom: 1 },
                    },
                    {
                        Placeholder: "Full Work Hours",
                        rangeMin: true,
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Contract Start Date",
                        fieldCol: 12,
                        rangeMin: true,
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
                        rules: [ { required: true, message: "Work Hours is Required", }, ],
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
                        rules: [ { required: true, message: "Work Hours is Required", }, ],
                        itemStyle: { marginBottom: 1 },
                    },
                    {
                        object: "billing",
                        fieldCol: 12,
                        key: "startDate",
                        size: "small",
                        type: "DatePicker",
                        fieldStyle: { width: "100%" },
                        rules: [ { required: true, message: "Start Date is Required", }, ],
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
                        rangeMin: true,
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
                        rules: [ { required: true, message: "Salary is Required", }, ],
                        itemStyle: { marginBottom: 1 },
                    },  
                    {
                        Placeholder: "Pay Frequence",
                        rangeMin: true,
                        fieldCol: 24,
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
                        rules: [ { required: true, message: "Payment Frequncy is required", }, ],
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

            TrainFields: {
                formId: "train_form",
                FormCol: 24,
                FieldSpace: 24,
                justifyField: "center",
                FormLayout: "inline",
                size: "middle",
                fields:[
                    {
                        Placeholder: "Training",
                        fieldCol: 24,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                    },
                    {
                        object: "train",
                        fieldCol: 24,
                        key: "training",
                        size: "small",
                        mode:{ minRows: 8, maxRows:12},
                        // rules:[{ required: true }],
                        type: "Textarea",
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
        const { editEmp } = this.props
        Promise.all([ getStates(), edit ? this.getRecord(editEmp) : getOrgPersons(1) ])
        .then(res => {
            const { BasicFields } = this.state
            console.log('usernmae', res[1].username);
            BasicFields.fields[15].data = res[0].data;
                this.setState({
                    BasicFields,
                    sUsername: edit ? res[1].username: null,
                    CONTACT: !edit ? res[1].data: [],
                })
        })
        .catch(e => {
            console.log(e);
        })
    }

    setBankReq = () =>{
        const { bank } = this.bankRef.current.refs.bank_form.getFieldsValue() // const
        const { bankAccountNo, bankBsb, bankName, tfn } = bank
        const { BankFields } = this.state
        const { fields } = BankFields
        if(bankAccountNo|| bankBsb|| bankName|| tfn) {
            fields[0].rangeMin= true
            fields[1].rangeMin= true
            fields[4].rangeMin= true
            fields[5].rangeMin= true

            fields[2].rules= [ { required: true, message: "Account Name is required", }, ]
            fields[3].rules= [ { required: true, message: "Account Number is required", }, ]
            fields[6].rules= [ { required: true, message: "BSB Number is required", }, ]
            fields[7].rules= [ { required: true, message: "Tax File Number is required", }, ]

        }else{
            fields[0].rangeMin= false
            fields[1].rangeMin= false
            fields[4].rangeMin= false
            fields[5].rangeMin= false

            fields[2].rules = [{required: false, message: ''}]
            fields[3].rules = [{required: false, message: ''}]
            fields[6].rules = [{required: false, message: ''}]
            fields[7].rules = [{required: false, message: ''}]
        }

        this.setState({
            BankFields: {...BankFields, fields:[...fields]}
        })
    }

    submit = () => {
        this.emailRef.current.submit();
        this.basicRef.current && this.basicRef.current.refs.basic_form.submit();
        this.detailRef.current && this.detailRef.current.refs.detail_form.submit();
        this.kinRef.current && this.kinRef.current.refs.kin_form.submit();
        this.bankRef.current && this.bankRef.current.refs.bank_form.submit();
        this.billingRef.current && this.billingRef.current.refs.billing_form.submit();
        this.trainRef.current && this.trainRef.current.refs.train_form.submit();
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
            }, () => this.validateForm()
        );
    };

    BillingCall = (vake) => {
        // this will work after  getting the Object from level form
        console.log(vake);
        // cnecking if type is selected
        if (vake.billing.type ){
            vake.billing.type === 1 ? vake.billing.remunerationAmountPer = 1 : vake.billing.remunerationAmountPer = 7
        }
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    latestEmploymentContract: vake.billing,
                },
                billingSubmitted: true, // level form submitted
            },() => this.validateForm()
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
            }, () => this.validateForm()
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
            },() => this.validateForm()
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
                        bankName: bank.bankName ?? '',
                        bankAccountNo: bank.bankAccountNo?? '',
                        bankBsb: bank.bankBsb?? '',
                        tfn: bank.tfn ?? '',
                        taxFreeThreshold: bank.taxFreeThreshold,
                        helpHECS: bank.helpHECS,
                    },
                },
                bankSubmitted: true, // level form submitted
            },() => this.validateForm()
        );
    };

    TrainCall = (vake) => {
        // this will work after I get the Object from the form
        const { train } = vake
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    ...{ // to send the defaut value
                        training: train.training? train.training: '', 
                    },
                },
                trainSubmitted: true, // level form submitted
            }, () => this.validateForm()
        );
    };


    EmailCall = (vake) => {
        console.log('Email submit', vake);
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    username: vake.username,
                    // username: this.state.sUsername
                },
                emailSubmitted: true, // skill form submitted
            },()=> this.validateForm()
            
        );
    }


    validateForm = () => {
        const { basicSubmitted, kinSubmitted, bankSubmitted, detailSubmitted, billingSubmitted, emailSubmitted, trainSubmitted,  mergeObj } = this.state
        if ( basicSubmitted && kinSubmitted && bankSubmitted && detailSubmitted && billingSubmitted && trainSubmitted && emailSubmitted) {
            //check if both form is submittef
            if (!this.props.editEmp) {
                console.log("emes");
                this.addEmployee(mergeObj); //add skill
            } else {
                console.log("edit");
                this.editRecord(mergeObj); //edit skill
            }
        }
    }
        

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
            trainSubmitted: false,
            loading: true
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
        return getRecord(id).then(res=>{
            if (res.success){
                this.basicRef.current.refs.basic_form.setFieldsValue({ basic: res.basic, });

                this.detailRef.current.refs.detail_form.setFieldsValue({ detail: res.detail, });
                
                this.kinRef.current.refs.kin_form.setFieldsValue({ kin: res.kin, });
                
                this.bankRef.current.refs.bank_form.setFieldsValue({ bank: res.bank, });
                
                this.billingRef.current.refs.billing_form.setFieldsValue({ billing: res.billing, })

                this.trainRef.current.refs.train_form.setFieldsValue({ train: res.train, })
                this.onFundType(res.detail&& res.detail)
                return {username: res.basic.username}
            }
        })
    };

    editRecord = (value) => {
        const { editEmp, callBack } = this.props;
        console.log(value);
        this.setState({
            basicSubmitted: false,
            kinSubmitted: false,
            bankSubmitted: false,
            detailSubmitted: false,
            billingSubmitted: false,
            trainSubmitted: false,
            loading: true
        })
        editList(editEmp, value).then((res) => {
            if(res.success){
                console.log('hereh');
                callBack()
            }
        });
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
            this.basicRef.current.refs.basic_form.resetFields();
        })
    }

    onFundType = (value)=>{
        const superannuation = [
            {
                Placeholder: "Membership / Account",
                rangeMin: true,
                fieldCol: 12,
                size: "small",
                type: "Text",
                labelAlign: "right",
            },
            {
                Placeholder: "USI Number",
                rangeMin: true,
                fieldCol: 12,
                size: "small",
                type: "Text",
                labelAlign: "right",
            },
            {
                object: "detail",
                fieldCol: 12,
                key: "superannuationBankAccountOrMembershipNumber",
                size: "small",
                type: "Input",
                rules: [ { required: true, message: "Membership / Account is required", }, ],
                itemStyle: { marginBottom: 10 },
            },
            {
                object: "detail",
                fieldCol: 12,
                key: "superannuationAbnOrUsi",
                size: "small",
                type: "Input",
                rules: [ { required: true, message: "USI Number is required", }, ],
                itemStyle: { marginBottom: 10 },
            },
        ]

        const smsf = [
            {
                Placeholder: "SMSF ABN",
                rangeMin: true,
                fieldCol: 12,
                size: "small",
                type: "Text",
                labelAlign: "right",
            },
            {
                Placeholder: "ESA Address",
                rangeMin: true,
                fieldCol: 12,
                size: "small",
                type: "Text",
                labelAlign: "right",
            },
            {
                object: "detail",
                
                fieldCol: 12,
                key: "superannuationAbnOrUsi",
                size: "small",
                type: "Input",
                rules: [ { required: true, message: "SMSF ABN is required", }, ],
                itemStyle: { marginBottom: 10 },
            },
            {
                object: "detail",
                fieldCol: 12,
                key: "superannuationAddress",
                size: "small",
                type: "Input",
                rules: [ { required: true, message: "ESA Address is required", }, ],
                itemStyle: { marginBottom: 10 },
            },
            {
                Placeholder: "Bank Account Name",
                rangeMin: true,
                fieldCol: 12,
                size: "small",
                type: "Text",
                labelAlign: "right",
            },
            {
                Placeholder: "BSB Number",
                rangeMin: true,
                fieldCol: 12,
                size: "small",
                type: "Text",
                labelAlign: "right",
            },
            {
                object: "detail",
                fieldCol: 12,
                key: "superannuationBankName",
                size: "small",
                type: "Input",
                rules: [ { required: true, message: "Account Name is required", }, ],
                itemStyle: { marginBottom: 10 },
            },
            {
                object: "detail",
                fieldCol: 12,
                key: "superannuationBankBsb",
                size: "small",
                type: "Input",
                rules: [ { required: true, message: "BSB Number is required", }, ],
                itemStyle: { marginBottom: 10 },
            },
            {
                Placeholder: "Bank Account Number",
                rangeMin: true,
                fieldCol: 24,
                size: "small",
                type: "Text",
                labelAlign: "right",
            },
            {
                object: "detail",
                fieldCol: 12,
                key: "superannuationBankAccountOrMembershipNumber",
                size: "small",
                type: "Input",
                rules: [ { required: true, message: "Account Number is required", }, ],
                itemStyle: { marginBottom: "10px" },
            },
        ]
        let { fields } = this.state.DetailFields
        const { detail } = this.detailRef.current.refs.detail_form.getFieldsValue(); // get the values from from data
        const { superAnnuationName, superannuationType } = detail
        if (superannuationType === 'P'){
            fields.splice(4, fields.length)
            fields = fields.concat(superannuation)
        }else if (superannuationType === 'S'){
            fields.splice(4, fields.length)
            fields = fields.concat(smsf)
        }else{
            fields.splice(4, fields.length)
        }
        const details = { superAnnuationName: superAnnuationName, superannuationType: superannuationType }
        this.detailRef.current.refs.detail_form.setFieldsValue({ detail: details })
        this.setState({
            DetailFields: {...this.state.DetailFields, fields,}
        })
    }



    render() {
        const { editEmp, visible, close } = this.props;
        const { BasicFields, DetailFields, KinFields, BankFields, BillingFields, TrainFields,  CONTACT, sContact, sUsername, loading } = this.state;
        return (
            <Modal
                title={editEmp ? "Edit Employee" : "Add Employee"}
                maskClosable={false}
                centered
                visible={visible}
                onOk={() => { this.submit(); }}
                okButtonProps={{ disabled: loading }}
                okText={loading ?<LoadingOutlined /> :"Save"}
                onCancel={()=> close()}
                width={900}
            >
                <Row style={{marginBottom:"1em"}} justify="space-between">
                    {!editEmp && <Col span={8} >
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
                            style={{width:"100%"}}
                        />
                       
                    </Col> }
                    <Col span={8}> 

                    <AntForm
                    size={'small'}
                    ref={this.emailRef}
                    onFinish={this.EmailCall}
                    >
                        <AntForm.Item
                        name={['username']}
                        rules={[{required: true, type: 'email', message: 'Email is Required'}]}
                        >
                            <Input
                                placeholder="Email"
                                size="small"
                                // prefix={<UserOutlined />} 
                                
                                style={{width:"100%"}}
                                /> 
                        </AntForm.Item>
                    </AntForm>
                    </Col>
                </Row>
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
                    <TabPane tab="Banking/Tax Details" key="bank" forceRender>
                        <Form
                            ref={this.bankRef}
                            Callback={this.BankCall}
                            FormFields={BankFields}
                        />
                    </TabPane>
                    <TabPane tab="Training Detail" key="train" forceRender>
                        <Form
                            ref={this.trainRef}
                            Callback={this.TrainCall}
                            FormFields={TrainFields}
                        />
                    </TabPane>
                </Tabs>
            </Modal>
        );
    }
}

export default InfoModal;
