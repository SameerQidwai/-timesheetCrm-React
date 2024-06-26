import React, { Component } from "react";
import { Modal, Tabs, Row, Col, Button, Input, Select, Form  } from "antd";
import { LoadingOutlined } from "@ant-design/icons"; //Icons

import FormItems from "../../../components/Core/FormItems";
import moment from "moment";

import { getEmpPersons, getOrgPersons, getRoles, getStates } from "../../../service/constant-Apis";
import { getContactRecord } from "../../../service/conatct-person";
import { addList, getRecord, editList } from "../../../service/Employees";
const { TabPane } = Tabs;

class InfoModal extends Component {
    constructor() {
        super()
        this.formRef = React.createRef();

        this.state = {
            editEmp: false,
            loading: false,
            CONTACT:[],
            data: {},

            BasicFields: [
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
                    Placeholder: "Role",
                    rangeMin: true,
                    fieldCol: 24,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                },
                {
                    object: "basic",
                    fieldCol: 12,
                    key: "roleId",
                    rules:[{ required: true, message: 'Role is required!!' }],
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

            DetailFields:[
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
            ],

            KinFields: [
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
                    itemStyle: { marginBottom: 10 },
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
                    itemStyle: { marginBottom: 10},
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

            BankFields: [
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
            ],

            BillingFields: [
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
                            BillingFields[10].Placeholder = "Hourly Base Salary"
                            this.setState({BillingFields})
                        }else{
                            BillingFields[10].Placeholder = "Annual Base Salary"
                            this.setState({BillingFields})
                        }
                    }.bind(this),
                    rules: [ { required: true, message: "Status is Required", }, ],
                    itemStyle: { marginBottom: 10 },
                },
                {
                    object: "billing",
                    fieldCol: 12,
                    key: "payslipEmail",
                    size: "small",
                    type: "input",
                    itemStyle: { marginBottom: 10 },
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
                    itemStyle: { marginBottom: 10 },
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
                    itemStyle: { marginBottom: 10 },
                },
                {
                    object: "billing",
                    fieldCol: 12,
                    key: "startDate",
                    size: "small",
                    type: "DatePicker",
                    fieldStyle: { width: "100%" },
                    rules: [ { required: true, message: "Start Date is Required", }, ],
                    itemStyle: { marginBottom: 10 },
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
                    itemStyle: { marginBottom: 10 },
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
                    itemStyle: { marginBottom: 10 },
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

            TrainFields: [
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
        };
    }

    componentDidMount = () => {
        // console.log(this.props);
        const { editEmp } = this.props
        this.fetchAll(editEmp)
    };

    fetchAll = (edit) =>{
        const { editEmp } = this.props
        const customUrl = `helpers/contact-persons?organizationId=1&active=0&associated=1`
        Promise.all([ getStates(), getRoles() , edit ? this.getRecord(editEmp) : getOrgPersons(customUrl) ])
        .then(res => {
            const { BasicFields } = this.state
            BasicFields[15].data = res[0].data;
            BasicFields[17].data = res[1].data;
                this.setState({
                    BasicFields,
                    CONTACT: !edit ? res[2].data: [],
                })
        })
        .catch(e => {
            console.log(e);
        })
    }

    setBankReq = () =>{
        const { bank } = this.formRef.current.getFieldsValue() // const
        const { bankAccountNo, bankBsb, bankName, tfn } = bank
        const { BankFields } = this.state
        if(bankAccountNo|| bankBsb|| bankName|| tfn) {
            BankFields[0].rangeMin= true
            BankFields[1].rangeMin= true
            BankFields[4].rangeMin= true
            BankFields[5].rangeMin= true

            BankFields[2].rules= [ { required: true, message: "Account Name is required", }, ]
            BankFields[3].rules= [ { required: true, message: "Account Number is required", }, ]
            BankFields[6].rules= [ { required: true, message: "BSB Number is required", }, ]
            BankFields[7].rules= [ { required: true, message: "Tax File Number is required", }, ]

        }else{
            BankFields[0].rangeMin= false
            BankFields[1].rangeMin= false
            BankFields[4].rangeMin= false
            BankFields[5].rangeMin= false

            BankFields[2].rules = [{required: false, message: ''}]
            BankFields[3].rules = [{required: false, message: ''}]
            BankFields[6].rules = [{required: false, message: ''}]
            BankFields[7].rules = [{required: false, message: ''}]
        }

        this.setState({
            BankFields: [...BankFields]
        })
    }

    addEmployee = (data) => {
        console.log("addEmployee", data);
        const { callBack } = this.props;
        const { sContact } = this.state
        data.contactPersonId = sContact
        // value.key = rows; // get new key
        this.setState({ loading: true })
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
                this.formRef.current.setFieldsValue({ basic: res.basic, detail: res.detail, bank: res.bank, kin: res.kin, billing: res.billing, train: res.train,});
                this.onFundType(res.detail&& res.detail)
                return true
            }
        })
    };

    editRecord = (value) => {
        const { editEmp, callBack } = this.props;
        console.log(value);
        this.setState({ loading: true })
        editList(editEmp, value).then((res) => {
            if(res.success){
                console.log('hereh');
                callBack()
            }
        });
    };

    onContact = (value) => {
        if(value){
            getContactRecord(value).then(res=>{
                if(res.success){
                    console.log(res.data);
                    res.data.cpCode = `Emp-00${res.data.id}`
                    res.data.dateOfBirth = res.data.dateOfBirth && moment(res.data.dateOfBirth) 
                    this.formRef.current.setFieldsValue({ basic: res.data, });
                    this.setState({sContact: value})
                }
            })
        }else{
            this.formRef.current.resetFields();
        }
    };
    
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
                shape: "ABN",
                size: "small",
                type: "Input",
                rules: [ 
                    { required: true, message: "SMSF ABN is required", },
                    ({ getFieldValue }) => ({
                        validator(rules, value) {
                            let val = value.toString()
                            let weights = new Array(10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19);
                            if (val.length === 11) { 
                                let sum = 0;
                                weights.forEach(function(weight, position) {
                                    let digit = val[position] - (position ? 0 : 1);
                                    sum += weight * digit;
                                });
                                console.log(sum % 89);
                                if (sum % 89 === 0){
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('ABN is not valid'));
                            }
                            return Promise.reject(new Error('Must contain 11 digits'));
                        },
                    }),
                ],
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
        let { DetailFields } = this.state
        const { detail } = this.formRef.current.getFieldsValue(); // get the values from from data
        const { superAnnuationName, superannuationType } = detail
        if (superannuationType === 'P'){
            DetailFields.splice(4, DetailFields.length)
            DetailFields = DetailFields.concat(superannuation)
        }else if (superannuationType === 'S'){
            DetailFields.splice(4, DetailFields.length)
            DetailFields = DetailFields.concat(smsf)
        }else{
            DetailFields.splice(4, DetailFields.length)
        }
        const details = { superAnnuationName: superAnnuationName, superannuationType: superannuationType }
        this.formRef.current.setFieldsValue({ detail: details })
        this.setState({
            DetailFields: [...DetailFields]
        })
    }

    onFinish = (formValues) =>{
        console.log(formValues);
        this.setState({loading: true})
        if (formValues.billing.type ){
            formValues.billing.type === 1 ? formValues.billing.remunerationAmountPer = 1 : formValues.billing.remunerationAmountPer = 7
        }
        const values  = {
            ...formValues.basic, 
            ...formValues.detail,
            ...formValues.kin, 
            ...{
                bankName: formValues.bank.bankName ?? '',
                bankAccountNo: formValues.bank.bankAccountNo?? '',
                bankBsb: formValues.bank.bankBsb?? '',
                tfn: formValues.bank.tfn ?? '',
                taxFreeThreshold: formValues.bank.taxFreeThreshold,
                helpHECS: formValues.bank.helpHECS,
            },
            latestEmploymentContract: formValues.billing,  
        } 
        if (!this.props.editEmp) {
            console.log("emes");
            this.addEmployee(values); //add skill
        } else {
            console.log("edit");
            this.editRecord(values); //edit skill
        }
    }

    render() {
        const { editEmp, visible, close } = this.props;
        const { BasicFields, DetailFields, KinFields, BankFields, BillingFields, TrainFields,  CONTACT, loading } = this.state;
        return (
            <Modal
                title={editEmp ? "Edit Employee" : "Add Employee"}
                maskClosable={false}
                centered
                visible={visible}
                okButtonProps={{ disabled: loading, htmlType: 'submit', form: 'my-form' }}
                okText={loading ?<LoadingOutlined /> :"Save"}
                onCancel={()=> close()}
                width={900}
            >
                <Form
                    id={'my-form'}
                    ref={this.formRef}
                    onFinish={this.onFinish}
                    scrollToFirstError={true}
                    size="small"
                    layout="inline"
                >
                        {!editEmp && <Col span={8} style={{marginBottom: 10}}>
                            <Form.Item
                                name={['basic', 'contactPersonId']}
                            >
                                <Select
                                    placeholder="Contact Person"
                                    options={CONTACT}
                                    showArrow
                                    showSearch
                                    size="small"
                                    allowClear
                                    onClear={this.onContact}
                                    onChange={this.onContact}
                                    optionFilterProp="label"
                                    filterOption={
                                        (input, option) =>
                                            option.label
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                    }
                                    style={{width:"100%"}}
                                />
                            </Form.Item>
                        </Col> }
                        <Col span={8} style={{marginLeft: 'auto', marginBottom: 10}}>
                            <Form.Item name={['basic', 'username']}  rules={[{required: true, message: 'Email/Username is requrired'}]} >
                                <Input
                                    placeholder="Email"
                                    size="small"
                                    type="email"
                                    style={{width:"100%"}}
                                /> 
                            </Form.Item>
                        </Col>
                    <Tabs type="card">
                        <TabPane tab="Personal Details" key="details" forceRender className="ant-form ant-form-inline ant-form-small" >
                            <FormItems FormFields={BasicFields} />
                        </TabPane>
                        <TabPane tab=" Employment Contracts" key="contract" forceRender className="ant-form ant-form-inline ant-form-small"  >
                            <FormItems FormFields={BillingFields}  />
                        </TabPane>
                        <TabPane tab="Superannuation" key="superannuation" forceRender className="ant-form ant-form-inline ant-form-small">
                            <FormItems FormFields={DetailFields} />
                        </TabPane>
                        <TabPane tab="Next of Kin" key="kin" forceRender className="ant-form ant-form-inline ant-form-small">
                            <FormItems FormFields={KinFields} />
                        </TabPane>
                        <TabPane tab="Banking/Tax Details" key="bank" forceRender className="ant-form ant-form-inline ant-form-small">
                            <FormItems FormFields={BankFields} />
                        </TabPane>
                        <TabPane tab="Training Detail" key="train" forceRender className="ant-form ant-form-inline ant-form-small">
                            <FormItems FormFields={TrainFields} />
                        </TabPane>
                    </Tabs>
                </Form>
            </Modal>
        );
    }
}

export default InfoModal;
