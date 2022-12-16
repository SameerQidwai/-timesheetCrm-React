import React, { Component } from "react";
import { Modal, Tabs } from "antd";
import Draggable from 'react-draggable';

import { LoadingOutlined } from "@ant-design/icons"; //Icons
import Form from "../../../components/Core/Forms/Form";
import { addList, getOrgRecord, editList } from "../../../service/Organizations";
import { getOrganizations, getOrgPersons } from "../../../service/constant-Apis";
import { formatDate, isPhone } from "../../../service/constant";

const { TabPane } = Tabs;

class InfoModal extends Component {
    constructor() {
        super();
        this.basicRef = React.createRef();
        this.billingRef = React.createRef();
        this.bankRef = React.createRef();
        this.insuredRef = React.createRef();
        this.futureRef = React.createRef();
        this.draggleRef = React.createRef();
        this.state = {
            editOrg: false,
            basicSubmitted: false,
            billingSubmitted: false,
            bankSubmitted: false,
            insuredSubmitted: false,
            futureSubmitted: false,
            check: false,
            bounds: { left: 0, top: 0, bottom: 0, right: 0 },
            dragDisable: true,
            BasicFields: {
                //creating Component
                formId: "basic_form",
                FormCol: 24,
                // FieldSpace:24,
                justifyField: "center",
                FormLayout: "inline",
                contactPerson: [],
                layout: { labelCol: { span: 10 }, wrapperCol: { span: 0 } },
                size: "middle",
                fields: [
                    {
                        Placeholder: "Name",
                        rangeMin: true, 
                        fieldCol: 9,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Title",
                        fieldCol: 3,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Parent",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 9,
                        key: "name",
                        size: "small",
                        rules:[{ required: true, message: 'Name is Required' }],
                        type: "Input",
                        itemStyle:{marginBottom: 1},
                    },
                    {
                        object: "obj",
                        fieldCol: 3,
                        key: "title",
                        size: "small",
                        type: "Input",
                        itemStyle:{marginBottom: 1},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "parent",
                        size: "small",
                        // rules:[{ required: true }],
                        data: [],
                        type: "Select",
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
                        Placeholder: "Email",
                        rangeMin: true, 
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "phone",
                        size: "small",
                        // rules:[{ required: true }],
                        rules:[
                            ({ getFieldValue }) => ({
                                validator(rules, value) {
                                    if (value){
                                        if (!isPhone(value)) {
                                            return Promise.reject(new Error('Must contain 11 digits'));
                                        }
                                        return Promise.resolve();
                                    }
                                    return Promise.resolve();
                                },
                            }),
                        ],
                        type: "Input",
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "email",
                        size: "small",
                        rules:[ {
                            type: 'email',
                            message: 'The input is not valid e-mail!',
                          },
                          {
                            required: true,
                            message: 'Please input your E-mail!',
                          }],
                        type: "Input",
                    },
                    {
                        Placeholder: "Business Type",
                        rangeMin: true,
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Delegate Contact person",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "businessType",
                        size: "small",
                        rules:[{ required: true, message: 'Business Type is Required' }],
                        type: "Select",
                        data: [
                            {label: 'Sole Trader', value: 1 },
                            {label: 'Partnership', value: 2 },
                            {label: 'Company', value: 3 },
                            {label: 'Trust', value: 4 },
                        ]
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "delegate_cp",
                        size: "small",
                        // rules:[{ required: true }],
                        data: this.state? this.state.contactPerson : [],
                        type: "Select",
                        itemStyle: { marginBottom: "10px" },
                    },
                    {
                        Placeholder: "Address",
                        fieldCol: 24,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 24,
                        key: "address",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                    },
                    {
                        Placeholder: "Website",
                        fieldCol: 24,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 24,
                        key: "website",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                        itemStyle: { marginBottom: "20px" },
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
                        Placeholder: "ABN",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Tax Code",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "ABN",
                        shape: "ABN",
                        size: "small",
                        type: "InputNumber",
                        rules:[
                            ({ getFieldValue }) => ({
                                validator(rules, value) {
                                    if (value){
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
                                        }
                                    return Promise.resolve();
                                },
                            }),
                        ],
                        fieldStyle: {width: '100%'}
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "tax_Code",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Select",
                        data: [
                            {value:'GST', label: 'GST - Goods & Services Tax Registered'},
                            {value: 'EXP', label: 'EXP - GST Free Exports/Overseas Org'},
                            {value: 'GNR', label: 'GNR - GST Non-Registered'},
                            {value: 'UNG', label: 'UNG - No ABN'}
                        ]
                    },
                    {
                        Placeholder: "Email for Invoices",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Contact Number for Invoices",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "invoice_email",
                        size: "small",
                        rules:[{
                            type: 'email',
                            message: 'The input is not valid e-mail!',
                            }],
                        type: "Input",
                    },
                    
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "invoice_number",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                    },
                ],
            },
            InsuredFields: {
                formId: "insured_form",
                FormCol: 24,
                FieldSpace: 24,
                justifyField: "center",
                FormLayout: "inline",
                size: "middle",
                fields: [
                    {
                        Placeholder: " Professional Indemnity",
                        fieldCol: 24,
                        size: "small",
                        type: "Title",
                        mode: 5,
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Insurer",
                        fieldCol: 6,
                        size: "small",
                        type: "Text",
                        // mode: 5,
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Policy Number",
                        fieldCol: 6,
                        size: "small",
                        type: "Text",
                        // mode: 5,
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Sum Insured",
                        fieldCol: 6,
                        size: "small",
                        type: "Text",
                        // mode: 5,
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Expiry",
                        fieldCol: 6,
                        size: "small",
                        type: "Text",
                        // mode: 5,
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 6,
                        key: "insurer_PI",
                        // label: "Insurer",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                        labelAlign: "left",
                        itemStyle: { marginBottom: "10px" },
                        onChange: (e) =>{
                            const { value } =  e.target
                            const { InsuredFields } = this.state
                            const { fields } = InsuredFields
                            if (value){
                                fields[2].rangeMin = true
                                fields[3].rangeMin = true
                                fields[4].rangeMin = true

                                fields[6].rules = [ { required: true, message: "Policy Number is required", }, ]
                                fields[7].rules = [ { required: true, message: "Sum Insured is required", }, ]
                                fields[8].rules = [ { required: true, message: "Expiry Date is required", }, ]
                            }else{
                                fields[2].rangeMin = false
                                fields[3].rangeMin = false
                                fields[4].rangeMin = false

                                fields[6].rules = [ { required: false, message: "", }, ]
                                fields[7].rules = [ { required: false, message: "", }, ]
                                fields[8].rules = [ { required: false, message: "", }, ]
                            }
                            this.setState({
                                InsuredFields: {...InsuredFields, fields: [...fields]}
                            })
                        }
                    },
                    {
                        object: "obj",
                        fieldCol: 6,
                        key: "policy_PI",
                        // label: "Policy Number",
                        size: "small",
                        type: "Input",
                        labelAlign: "left",
                        itemStyle: { marginBottom: 10 },
                    },
                    {
                        object: "obj",
                        key: "SumIns_PI",
                        fieldCol: 6,
                        // label: "Sum Insured",
                        size: "small",
                        type: "InputNumber",
                        shape: '$',
                        fieldStyle: {width: '100%'},
                        labelAlign: "left",
                        itemStyle: { marginBottom: 10 },
                    },
                    {
                        object: "obj",
                        fieldCol: 6,
                        key: "expiry_PI",
                        // label: "Expiry",
                        size: "small",
                        type: "DatePicker",
                        labelAlign: "left",
                        itemStyle: { marginBottom: "10px" },
                    },
                    {
                        Placeholder: "Public Liability", //9
                        fieldCol: 24,
                        size: "small",
                        type: "Title",
                        mode: 5,
                        labelAlign: "right",
                        itemStyle: { marginTop: 20 },
                    },
                    {
                        Placeholder: "Insurer",
                        fieldCol: 6,
                        size: "small",
                        type: "Text",
                        // mode: 5,
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Policy Number",
                        fieldCol: 6,
                        size: "small",
                        type: "Text",
                        // mode: 5,
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Sum Insured",
                        fieldCol: 6,
                        size: "small",
                        type: "Text",
                        // mode: 5,
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Expiry",
                        fieldCol: 6,
                        size: "small",
                        type: "Text",
                        // mode: 5,
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 6,
                        key: "insurer_PL",
                        // label: "Insurer",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                        labelAlign: "left",
                        itemStyle: { marginBottom: 10 },
                        onChange: (e) =>{
                            const { value } =  e.target
                            const { InsuredFields } = this.state
                            const { fields } = InsuredFields
                            if (value){
                                fields[11].rangeMin = true
                                fields[12].rangeMin = true
                                fields[13].rangeMin = true

                                fields[15].rules = [ { required: true, message: "Policy Number is required", }, ]
                                fields[16].rules = [ { required: true, message: "Sum Insured is required", }, ]
                                fields[17].rules = [ { required: true, message: "Expiry Date is required", }, ]
                            }else{
                                fields[11].rangeMin = false
                                fields[12].rangeMin = false
                                fields[13].rangeMin = false

                                fields[15].rules = [ { required: false, message: "", }, ]
                                fields[16].rules = [ { required: false, message: "", }, ]
                                fields[17].rules = [ { required: false, message: "", }, ]
                            }
                            this.setState({
                                InsuredFields: {...InsuredFields, fields: [...fields]}
                            })
                        }
                    },
                    {
                        object: "obj",
                        fieldCol: 6,
                        key: "policy_PL",
                        // label: "Policy Number",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                        labelAlign: "left",
                        itemStyle: { marginBottom: 10 },
                    },
                    {
                        object: "obj",
                        fieldCol: 6,
                        key: "SumIns_PL",
                        // label: "Sum Insured",
                        size: "small",
                        shape: '$',
                        // rules:[{ required: true }],
                        type: "InputNumber",
                        fieldStyle: {width: '100%'},
                        labelAlign: "left",
                        itemStyle: { marginBottom: 10 },
                    },
                    {
                        object: "obj",
                        fieldCol: 6,
                        key: "expiry_PL",
                        // label: "Expiry",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "DatePicker",
                        labelAlign: "left",
                        itemStyle: { marginBottom: "10px" },
                    },
                    {
                        Placeholder: "Worker’s Compensation", //18
                        fieldCol: 24,
                        size: "small",
                        type: "Title",
                        mode: 5,
                        labelAlign: "right",
                        itemStyle: { marginTop: 20 },
                    },
                    {
                        Placeholder: "Insurer",
                        fieldCol: 6,
                        size: "small",
                        type: "Text",
                        // mode: 5,
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Policy Number",
                        fieldCol: 6,
                        size: "small",
                        type: "Text",
                        // mode: 5,
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Sum Insured",
                        fieldCol: 6,
                        size: "small",
                        type: "Text",
                        // mode: 5,
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Expiry",
                        fieldCol: 6,
                        size: "small",
                        type: "Text",
                        // mode: 5,
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 6,
                        key: "insurer_WC",
                        // label: "Insurer",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                        labelAlign: "left",
                        itemStyle: { marginBottom: 10 },
                        onChange: (e) =>{
                            const { value } =  e.target
                            const { InsuredFields } = this.state
                            const { fields } = InsuredFields
                            if (value){
                                fields[20].rangeMin = true
                                fields[21].rangeMin = true
                                fields[22].rangeMin = true

                                fields[24].rules = [ { required: true, message: "Policy Number is required", }, ]
                                fields[25].rules = [ { required: true, message: "Sum Insured is required", }, ]
                                fields[26].rules = [ { required: true, message: "Expiry Date is required", }, ]
                            }else{
                                fields[20].rangeMin = false
                                fields[21].rangeMin = false
                                fields[22].rangeMin = false
                                
                                fields[24].rules = [ { required: false, message: "", }, ]
                                fields[25].rules = [ { required: false, message: "", }, ]
                                fields[26].rules = [ { required: false, message: "", }, ]
                            }
                            this.setState({
                                InsuredFields: {...InsuredFields, fields: [...fields]}
                            })
                        }
                    },
                    {
                        object: "obj",
                        fieldCol: 6,
                        key: "policy_WC",
                        // label: "Policy Number",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                        labelAlign: "left",
                        itemStyle: { marginBottom: "10px" },
                    },
                    {
                        object: "obj",
                        fieldCol: 6,
                        key: "SumIns_WC",
                        // label: "Sum Insured",
                        size: "small",
                        shape: '$',
                        // rules:[{ required: true }],
                        type: "InputNumber",
                        fieldStyle: {width: '100%'},
                        labelAlign: "left",
                        itemStyle: { marginBottom: 10 },
                    },
                    {
                        object: "obj",
                        fieldCol: 6,
                        key: "expiry_WC",
                        // label: "Expiry",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "DatePicker",
                        labelAlign: "left",
                        itemStyle: { marginBottom: "10px" },
                    },
                ],
            },
            BankFields: {
                formId: "bank_form",
                FormCol: 24,
                FieldSpace: 24,
                justifyField: "center",
                FormLayout: "inline",
                layout: { labelCol: { span: 9 }, wrapperCol: { span: 0 } },
                size: "middle",
                fields: [
                    {
                        Placeholder: "Bank Account Name",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "BSB Number",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "bankName",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "bankBsb",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                    },
                    {
                        Placeholder: "Bank Account Number",
                        fieldCol: 24,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "bankAccountNo",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                    },
                ],
            },
            FutureFields: {
                //creating Component
                formId: "future_form",
                FormCol: 24,
                // FieldSpace:24,
                justifyField: "center",
                FormLayout: "inline",
                contactPerson: [],
                size: "middle",
                fields: [
                    {
                        Placeholder: "Current Financial Year Total Forecast",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Next Financial Year Total Forecast",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "currentForecast",
                        size: "small",
                        type: "Input",
                        shape: '$',
                        // rules:[{ required: true }],
                        type: "InputNumber",
                        fieldStyle: { width: "100%" },
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "nextForecast",
                        size: "small",
                        type: "Input",
                        shape: '$',
                        // rules:[{ required: true }],
                        type: "InputNumber",
                        fieldStyle: { width: "100%" },
                    },
                ],
            },
        };
    }
    componentDidMount = () =>{
        const { editOrg } = this.props
        if (!editOrg){
            this.getOrgs(editOrg)
            this.callAdd_Edit()
        }else{
            this.fetchAll()
        }
    }

    fetchAll = () =>{
        const {editOrg}= this.props;
        const customUrl = `helpers/contact-persons?organizationId=${editOrg}&associated=1`
        // , getContactPersons() 
        Promise.all([ getOrganizations(editOrg), getOrgPersons(customUrl)])
        .then(res => {
            const { BasicFields } = this.state;
            BasicFields.fields[5].data = res[0].data;
            BasicFields.fields[13].data = res[1].data;
            this.setState({ BasicFields, })
            this.getRecord(editOrg)
        })
        .catch(e => {
            console.log(e);
        })
    }

    getOrgs = (id) => {
        getOrganizations(id).then((res) => {
            if (res.success) {
                const { BasicFields } = this.state;
                BasicFields.fields[5].data = res.data;
                this.setState({ BasicFields });
            }
        });
    };

    callAdd_Edit = ()=>{
        const { BasicFields } = this.state
        this.setState({
            BasicFields: {
                ...BasicFields,
                fields: BasicFields.fields.filter(el =>{
                    if (el.Placeholder === 'Business Type'){
                        el.fieldCol = 24
                        return el
                    }else 
                    if (el.Placeholder !=='Delegate Contact person' && el.key !== "delegate_cp"){
                        return el
                    }
                })
            }
        })
    }

    submit = () => {
        //submit button click
        this.basicRef.current.refs.basic_form.submit();
        this.billingRef.current && this.billingRef.current.refs.billing_form.submit();
        this.insuredRef.current && this.insuredRef.current.refs.insured_form.submit();
        this.bankRef.current && this.bankRef.current.refs.bank_form.submit()
        this.futureRef.current && this.futureRef.current.refs.future_form.submit()
    };

    BasicCall = (vake) => {
        // this will work after  got  Object from the skill from
        ;
        vake = vake.obj
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    name: vake.name? vake.name : '',
                    title: vake.title ?? '',
                    parentOrganizationId: vake.parent? vake.parent : null,
                    phoneNumber: vake.phone? vake.phone : '',
                    delegateContactPersonId: vake.delegate_cp? vake.delegate_cp: null,
                    email: vake.email? vake.email : '',
                    expectedBusinessAmount: vake.EBA? vake.EBA : 0,
                    address: vake.address? vake.address : '',
                    website: vake.website? vake.website: '',
                    businessType: vake.businessType? vake.businessType: undefined,
                },
                basicSubmitted: true, // skill form submitted
            },
            () => {
                if ( this.state.basicSubmitted && this.state.billingSubmitted && this.state.insuredSubmitted && this.state.bankSubmitted && this.state.futureSubmitted ) {
                    //check if both form is submittef
                    if (!this.props.editOrg) {
                        
                        this.addOrganization(this.state.mergeObj); //add skill
                    } else {
                        
                        this.editRecord(this.state.mergeObj); //edit skill
                    }
                }
            }
        );
    };

    BillingCall = (vake) => {
        // this will work after  getting the Object from level form
        ;
        vake = vake.obj
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    abn: vake.ABN? vake.ABN : '',
                    taxCode: vake.tax_Code? vake.tax_Code : '',
                    invoiceEmail: vake.invoice_email? vake.invoice_email: '',
                    invoiceContactNumber: vake.invoice_number? vake.invoice_number: '',
                    // businessType: vake.businessType? vake.businessType: undefined,
                    cti: vake.CTI? vake.CTI : '',
                },
                billingSubmitted: true, // level form submitted
            },
            () => {
                if ( this.state.basicSubmitted && this.state.billingSubmitted && this.state.insuredSubmitted && this.state.bankSubmitted && this.state.futureSubmitted ) {
                    //check if both form is submittef
                    if (!this.props.editOrg) {
                        
                        this.addOrganization(this.state.mergeObj); //add skill
                    } else {
                        
                        this.editRecord(this.state.mergeObj); //edit skill
                    }
                }
            }
        );
    };

    InsuredCall = (vake) => {
        // this will work after I get the Object from the form
        ;
        vake = vake.obj
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                        piInsurer: vake.insurer_PI? vake.insurer_PI : '',
                        plInsurer: vake.insurer_PL? vake.insurer_PL : '',
                        wcInsurer: vake.insurer_WC? vake.insurer_WC : '',
                        piPolicyNumber: vake.policy_PI? vake.policy_PI : '',
                        plPolicyNumber: vake.policy_PL? vake.policy_PL : '',
                        wcPolicyNumber: vake.policy_WC? vake.policy_WC : '',
                        piSumInsured: vake.SumIns_PI? vake.SumIns_PI : 0,
                        plSumInsured: vake.SumIns_PL? vake.SumIns_PL : 0,
                        wcSumInsured: vake.SumIns_WC? vake.SumIns_WC : 0,
                        piInsuranceExpiry: formatDate(vake.expiry_PI, true),
                        plInsuranceExpiry: formatDate(vake.expiry_PL, true),
                        wcInsuranceExpiry: formatDate(vake.expiry_WC, true),
                },
                insuredSubmitted: true, // level form submitted
            },
            () => {
                if ( this.state.basicSubmitted && this.state.billingSubmitted && this.state.insuredSubmitted && this.state.bankSubmitted && this.state.futureSubmitted ) {
                    //check if both form is submittef
                    if (!this.props.editOrg) {
                        
                        this.addOrganization(this.state.mergeObj); //add skill
                    } else {
                        
                        this.editRecord(this.state.mergeObj); //edit skill
                    }
                }
            }
        );
    };

    BankCall = (vake) => {
        // this will work after I get the Object from the form
        vake = vake.obj
                this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    ...{
                        bankName: vake.bankName? vake.bankName : '',
                        bankAccountNo: vake.bankAccountNo? vake.bankAccountNo : '',
                        bankBsb: vake.bankBsb? vake.bankBsb: '',
                    },
                },
                bankSubmitted: true, // level form submitted
            },
            () => {
                if ( this.state.basicSubmitted && this.state.billingSubmitted && this.state.insuredSubmitted && this.state.bankSubmitted && this.state.futureSubmitted ) {
                    //check if both form is submittef
                    if (!this.props.editOrg) {
                        
                        this.addOrganization(this.state.mergeObj); //add skill
                    } else {
                        
                        this.editRecord(this.state.mergeObj); //edit skill
                    }
                }
            }
        );
    };

    FutureCall = (vake) => {
        // this will work after I get the Object from the form
        vake = vake.obj
        console.log(vake);
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    ...{
                        currentFinancialYearTotalForecast: vake.currentForecast ? vake.currentForecast : 0,
                        nextFinancialYearTotalForecast: vake.nextForecast ? vake.nextForecast: 0,
                    },
                },
                futureSubmitted: true, // level form submitted
            },
            () => {
                if ( this.state.basicSubmitted && this.state.billingSubmitted && this.state.insuredSubmitted && this.state.bankSubmitted && this.state.futureSubmitted ) {
                    //check if both form is submittef
                    if (!this.props.editOrg) {
                        
                        this.addOrganization(this.state.mergeObj); //add skill
                    } else {
                        
                        this.editRecord(this.state.mergeObj); //edit skill
                    }
                }
            }
        );
    };

    addOrganization = (value) => {
        const { callBack } = this.props;
        console.log(value);
        this.setState({ 
            basicSubmitted: false, 
            billingSubmitted:false, 
            insuredSubmitted:false, 
            bankSubmitted:false, 
            futureSubmitted:false,
            loading: true
        })
        addList(value).then((res) => {
            if(res.success){
                callBack()
            }else{
                this.setState({loading:false})
            }
        });
    };

    getRecord = (id) => {
        // const { editOrg } = this.props;
        getOrgRecord(id).then((res) => {
            if (res.success){
               const  { basic, billing, insured, bank, future, data} = res
                this.basicRef.current.refs.basic_form.setFieldsValue({ obj: basic, });
        
                this.billingRef.current.refs.billing_form.setFieldsValue({ obj: billing, });
        
                this.insuredRef.current.refs.insured_form.setFieldsValue({ obj: insured, });

                this.bankRef.current.refs.bank_form.setFieldsValue({ obj: bank, });
                
                this.futureRef.current.refs.future_form.setFieldsValue({ obj: future, });
            }
        })

    };

    editRecord = (value) => {
        const { editOrg, callBack } = this.props;
        value.id = editOrg
        console.log(value);
        this.setState({ 
            basicSubmitted: false, 
            billingSubmitted:false, 
            insuredSubmitted:false, 
            bankSubmitted:false, 
            futureSubmitted:false,
            loading: false
        })
        editList(value).then((res) => {
            if(res.success){
                callBack(res)
            }else{
                this.setState({loading:false})
            }
        });
    };

    onDrag = (event, uiData) => {
        const { clientWidth, clientHeight } = window?.document?.documentElement;
        const targetRect = this.draggleRef?.current?.getBoundingClientRect();
        this.setState({
          bounds: {
            left: -targetRect?.left + uiData?.x,
            right: clientWidth - (targetRect?.right - uiData?.x),
            top: -targetRect?.top + uiData?.y,
            bottom: clientHeight - (targetRect?.bottom - uiData?.y),
          },
        });
    };
    render() {
        const { editOrg, visible } = this.props;
        const { bounds, dragDisable, BasicFields, BillingFields, InsuredFields, BankFields, FutureFields, loading } = this.state
        return (
            <Modal
                title={
                    <div 
                        style={{ width: '100%', cursor: 'move', }} 
                        onMouseOver={() => { if (dragDisable) { this.setState({ dragDisable: false, }); } }}
                        onMouseOut={() => { this.setState({ dragDisable: true, });}}
                    >
                        {editOrg? "Edit Organisation" : "Add Organisation"}
                    </div>
                    }
                maskClosable={false}
                centered
                visible={visible}
                onOk={() => {
                    this.submit();
                }}
                okButtonProps={{ disabled: loading }}
                okText={loading ?<LoadingOutlined /> :"Save"}
                onCancel={this.props.close}
                width={900}
                destroyOnClose={true}
                modalRender={modal => (
                    <Draggable
                      bounds={bounds}
                      disabled={dragDisable}
                      onStart={(event, uiData) => this.onDrag(event, uiData)}
                    >
                      <div ref={this.draggleRef}>{modal}</div>
                    </Draggable>
                  )}
            >
                <Tabs type="card">
                    <TabPane tab="General Details" key="general_details" forceRender>
                        <Form
                            ref={this.basicRef}
                            Callback={this.BasicCall}
                            FormFields={BasicFields}
                        />
                    </TabPane>
                    <TabPane tab="Billing Details" key="billing_details" forceRender>
                        <Form
                            ref={this.billingRef}
                            Callback={this.BillingCall}
                            FormFields={BillingFields}
                        />
                    </TabPane>
                    <TabPane tab="Insurance Details" key="insurance_detail" forceRender>
                        <Form
                            ref={this.insuredRef}
                            Callback={this.InsuredCall}
                            FormFields={InsuredFields}
                        />
                    </TabPane>
                    <TabPane tab="Bank Details" key="bank_detail" forceRender>
                        <Form
                            ref={this.bankRef}
                            Callback={this.BankCall}
                            FormFields={BankFields}
                        />
                    </TabPane>

                    <TabPane tab="Work In Future" key="future" forceRender>
                        <Form
                            ref={this.futureRef}
                            Callback={this.FutureCall}
                            FormFields={FutureFields}
                        />
                    </TabPane>
                </Tabs>
            </Modal>
        );
    }
}

export default InfoModal;

