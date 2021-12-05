import React, { Component } from "react";
import { Modal, Tabs, Row, Col, Select, Input, Form as AntForm, Upload } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons"; //Icons
import Form from "../../../components/Core/Form";
import moment from "moment";

import { addList, getRecord, editList } from "../../../service/contractors";
import { getContactRecord } from "../../../service/conatct-person";
import { getOrganizations, getOrgPersons, getRoles, getStates } from "../../../service/constant-Apis";
import { addFiles } from "../../../service/Attachment-Apis";

const { TabPane } = Tabs;

class InfoModal extends Component {
    constructor() {
        super();
        this.basicRef = React.createRef();
        this.billingRef = React.createRef();
        this.kinRef = React.createRef();
        this.emailRef = React.createRef();
        this.state = {
            editCont: false,
            basicSubmitted: false,
            billingSubmitted: false,
            kinSubmitted: false,
            emailSubmitted: false,
            CONTACTS:[],
            sContact: null,
            ORGS: [],
            sOrg: null,
            sUsername: null,
            loading: false,

            fileIds: null,
            fileList: [],

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
                         rules: [
                            {
                                required: true,
                                message: "Code is Required",
                            },
                        ],
                    
                        // rules:[{ required: true }],
                        type: "Input",
                        readOnly: true,
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
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: "First Name is required",
                        //     },
                        // ],
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
                            { label: "Others", value: "O" },
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
                        size: "small",
                        rules:[{ required: true, message: 'Role is required!!' }],
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
                        Placeholder: "Relationship to Contractor",
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
                            {label: 'Spouse', value: 'Spouse' },
                            {label: 'Partner', value: 'Partner' },
                            {label: 'Sibling', value: 'Sibling' },
                            {label: 'Parent', value: 'Parent' },
                            {label: 'Child', value: 'Child' },
                            {label: 'Friend', value: 'Friend' },
                        ],
                        type: "Select",
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
                        Placeholder: "Contract Start Date",
                        rangeMin: true,
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Contract End Date",
                        fieldCol: 12,
                        size: "small",
                        rangeMin: true,
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "billing",
                        fieldCol: 12,
                        key: "startDate",
                        size: "small",
                        type: "DatePicker",

                        fieldStyle: { width: "100%" },
                        rules: [
                            {
                                required: true,
                                message: "Start Date is Required",
                            },
                        ],
                        itemStyle: { marginBottom: 1 },
                    },
                    {
                        object: "billing",
                        fieldCol: 12,
                        key: "endDate",
                        size: "small",
                        type: "DatePicker",
                        fieldStyle: { width: "100%" },
                        rules: [
                            {
                                required: true,
                                message: "End Date is Required",
                            },
                        ],
                        itemStyle: { marginBottom: 1 },
                    },

                    {
                        Placeholder: "Contract Payment Basis",
                        fieldCol: 12,
                        rangeMin: true,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    // {
                    //     Placeholder: `Total Contract ${'here'}`,
                    //     fieldCol: 12,
                    //     size: "small",
                    //     type: "Text",
                    //     labelAlign: "right",
                    //     // itemStyle:{marginBottom:'10px'},
                    // },
                    {
                        Placeholder: `Total Fee`,
                        fieldCol: 12,
                        size: "small",
                        rangeMin: true,
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
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
                        ],
                        type: "Select",
                        rules: [
                            {
                                required: true,
                                message: "Payment Frequncy is Required",
                            },
                        ],
                        onChange: function onChange(value, option) {
                            const { BillingFields } = this.state
                            BillingFields.fields[5].Placeholder = `Total Fee ${value ?option.label: ''}`
                            this.setState({BillingFields})
                        }.bind(this),
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
                        rules: [
                            {
                                required: true,
                                message: "Total Fee is Required",
                            },
                        ],
                        itemStyle: { marginBottom: 1 },
                    },
                    {
                        Placeholder: "Full Work Hours",
                        fieldCol: 24,
                        size: "small",
                        rangeMin: true,
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
                        rules: [
                            {
                                required: true,
                                message: "Work Hour is Reqired",
                            },
                        ],
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
                        rules: [
                            {
                                required: true,
                                message: "Work Frequency is Required",
                            },
                        ],
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
        };
    }

    componentDidMount = () => {
        const { editCont } = this.state
        if (editCont) {
            this.getRecord(editCont);
        }

        getOrganizations().then(res=>{
            if (res.success){
                this.setState({
                    ORGS: res.data.filter((item) => item.value !== 1)
                })
            }
        })
    };

    componentDidMount = () => {
        const { editCont } = this.props
        this.fetchAll(editCont)
    };

    fetchAll = (edit) =>{
        Promise.all([ getStates(), getRoles(), edit ? this.getRecord(edit) : getOrganizations()])
        .then(res => {
            const { BasicFields } = this.state
            BasicFields.fields[15].data = res[0].data;
            BasicFields.fields[17].data = res[1].data;
                this.setState({
                    BasicFields,
                    sUsername: edit ? res[2].username: null,
                    ORGS: !edit ? res[2].data.filter((item) => item.value !== 1): [],
                })
        })
        .catch(e => {
            console.log(e);
        })
    }




    submit = () => {
        //submit button click
        this.emailRef.current.submit();
        this.basicRef.current && this.basicRef.current.refs.basic_form.submit();
        this.billingRef.current && this.billingRef.current.refs.billing_form.submit();
        this.kinRef.current && this.kinRef.current.refs.kin_form.submit();
    };



    ValidateForm  = () => {
        const {editCont} = this.props;
        const {billingSubmitted,basicSubmitted, kinSubmitted, emailSubmitted, mergeObj} = this.state;
            if ( basicSubmitted && billingSubmitted && kinSubmitted && emailSubmitted) {
                //check if both form is submittef
                if (!editCont) {
                    this.addContactor(mergeObj); //add skill
                } else {
                    this.editRecord(mergeObj); //edit skill
                }
            }
    }

    EmailCall = (vake) => {
        const { editCont } = this.props
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    ...vake,
                    // username: this.state.sUsername
                },
                emailSubmitted: true, // skill form submitted
            },()=> this.ValidateForm() 
            
        );
    }

    BasicCall = (vake) => {
        // this will work after  got  Object from the skill from
        const { editCont } = this.props
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    ...vake.basic,
                    // username: this.state.sUsername
                },
                basicSubmitted: true, // skill form submitted
            },
            () => this.ValidateForm()
        );
    };

    BillingCall = (vake) => {
        // this will work after  getting the Object from level form
        const { editCont } = this.props
        const { fileIds } = this.state
        vake.billing.fileId = fileIds
        // vake.billing.noOfHoursPer = 1; 
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    latestContract: vake.billing,
                },
                billingSubmitted: true, // level form submitted
            },
            () => this.ValidateForm()
        );
    };

    KinCall = (vake) => {
        // this will work after I get the Object from the form
        const { editCont } = this.props 
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    ...vake.kin,
                },
                kinSubmitted: true, // level form submitted
            },
            () => this.ValidateForm()
        );
    };

    addContactor = (data) => {
        const { callBack } = this.props;
        const { sContact, sOrg } = this.state
        data.contactPersonId = sContact
        data.organizationId = sOrg
        this.setState({
            basicSubmitted: false,
            kinSubmitted: false,
            billingSubmitted: false,
            loading: true,
        })
        addList(data).then(res=>{
            if(res.success){
                callBack();
            }
        })
    };

    getRecord = (id) => {
        return getRecord(id).then(res=>{
            if (res.success){
                this.basicRef.current.refs.basic_form.setFieldsValue({ basic: res.basic, });
                this.kinRef.current.refs.kin_form.setFieldsValue({ kin: res.kin, });
                this.billingRef.current.refs.billing_form.setFieldsValue({ billing: res.billing, })
                this.emailRef.current.setFieldsValue({ username: res.basic.username })
                this.setState({
                    fileIds: res.billing.fileId,
                    fileList: res.billing.file
                })
                return {username: res.basic.username}
            }
        })
    };

    editRecord = (value) => {
        const { editCont, callBack } = this.props;
        this.setState({
            basicSubmitted: false,
            kinSubmitted: false,
            billingSubmitted: false,
            loading: true,
            
        })
        editList(editCont, value).then((res) => {
            if(res.success){
                callBack()
            }
        });
    };

    onCancel = () => {
        const { BasicFields, BillingFields } = this.state;

        delete BasicFields.initialValues; // delete initialValues of fields on close
        delete BillingFields.initialValues;
        
        this.setState(
            {
                basicSubmitted: false,
                billingSubmitted: false,
                BasicFields: { ...BasicFields }, //delete Formfields on Close
                BillingFields: { ...BillingFields },
                mergeObj: {},
            },
            () => {
                this.props.close();
            }
        );
    };

    onOrg = (value) => {
        const customUrl = `helpers/contact-persons?organizationId=${value}&active=0&associated=1`
        getOrgPersons(customUrl).then(res=>{
            if(res.success){
                this.setState({
                    sOrg: value,
                    CONTACTS: res.data
                })
            }
        })
    };

    onPerson = (value) => {
        getContactRecord(value).then(res=>{
            if(res.success){
                res.data.cpCode = `Con-00${res.data.id}`
                res.data.dateOfBirth = res.data.dateOfBirth && moment(res.data.dateOfBirth) 
                this.basicRef.current.refs.basic_form.setFieldsValue({ basic: res.data, });
                this.setState({sContact: value})
            }
        })
    };

    onClear = (org, person) =>{
        this.setState({
            sContact: person,
            sOrg: org, // if onPerson is select Organization won't get null, but if organizaion get clear both values get null
        },()=>{
            this.basicRef.current.refs.basic_form.resetFields();
        })
    }

    addContrator = (data) => {
        const { callBack } = this.props;
        const { sContact } = this.state
        data.contactPersonId = sContact
        // value.key = rows; // get new key
        addList(data).then(res=>{
            if(res.success){
                callBack(res.data, false);
            }
        })
    };

    //file upload testing

    handleUpload = async option=>{
        const { onSuccess, onError, file, onProgress } = option;
        const formData = new FormData();
        const  config = {
            headers: {"content-type": "multipart/form-data"},
            onUploadProgress: event =>{
                const percent = Math.floor((event.loaded / event.total) * 100);
                this.setState({progress: percent});
                if (percent === 100) {
                  setTimeout(() => this.setState({progres: 0}), 1000);
                }
                onProgress({ percent: (event.loaded / event.total) * 100 });
              }
            }
            formData.append('files', file)
            addFiles(formData, config).then((res,err)=>{
                if (res.success){
                    onSuccess("Ok");
                    this.setState({
                        fileList: [res.file],
                        fileIds: res.file.fileId
                    })
                }else{
                    console.log("Eroor: ", err);
                    const error = new Error("Some error");
                    onError({ err });
                }
            })
    }

    onRemove = (file) => {
        this.setState({
            fileIds: null,
            fileList: []
        })  
    }
    

    //file upload testing

    render() {
        const { editCont, visible } = this.props;
        const { BasicFields, BillingFields, KinFields, sContact, CONTACTS, ORGS, sOrg, fileIds, loading, fileList } = this.state;

        return (
            <Modal
                title={editCont ? "Edit Contractor" : "Add Contractor"}
                maskClosable={false}
                centered
                visible={visible}
                onOk={() => { this.submit(); }}
                okButtonProps={{ disabled: loading }}
                okText={loading ?<LoadingOutlined /> :"Save"}
                onCancel={this.onCancel}
                width={900}
            >
                <Row style={{marginBottom:"1em"}} justify="space-between">
                    {!editCont &&<Col span={7}>
                        <Select
                            value={sOrg}
                            placeholder="Organization"
                            options={ORGS}
                            showArrow
                            showSearch
                            size="small"
                            allowClear
                            onChange={this.onOrg}
                            onClear={()=>this.onClear(null, null)}
                            optionFilterProp="label"
                            filterOption={
                                (input, option) =>
                                    option.label
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                            }
                            style={{width:"100%"}}
                        />
                    </Col>}
                    {!editCont &&<Col span={7}> 
                        <Select
                            value={sContact}
                            placeholder="Contact Person"
                            options={CONTACTS}
                            showArrow
                            showSearch
                            disabled={!sOrg}
                            size="small"
                            allowClear
                            onChange={this.onPerson}
                            onClear={()=>this.onClear(sOrg, null)}
                            optionFilterProp="label"
                            filterOption={
                                (input, option) =>
                                    option.label
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                            }
                            style={{width:"100%"}}
                        />
                    </Col> }
                    <Col span={7}>
                    <AntForm
                    size={'small'}
                    ref={this.emailRef}
                    onFinish={this.EmailCall}
                    // layout={}
                    > 

                    <AntForm.Item
                    name={'username'}
                    rules={[{required: true, type: 'email', message: 'Email is Required'}]}
                    >
                        <Input
                            // value={sUsername}
                            placeholder="Email"
                            size="small"
                            // type="email"
                            // prefix={<UserOutlined />} 
                            // onChange={(e, value)=>{
                            //     this.setState({
                            //         sUsername: e.target.value
                            //     })
                            // }}
                            style={{width:"100%"}}
                        /> 
                    </AntForm.Item>
                    </AntForm>
                    </Col>
                </Row>
                <Tabs type="card">
                    <TabPane tab="Contractor Details" key="Contractor Details" forceRender>
                        <Form
                            ref={this.basicRef}
                            Callback={this.BasicCall}
                            FormFields={BasicFields}
                        />
                    </TabPane>
                    <TabPane tab="Subcontractor Contracts" key="Subcontractor Contracts" forceRender>
                        <Form ref={this.billingRef} Callback={this.BillingCall} FormFields={BillingFields} />
                        <p style={{marginTop: 10, marginBottom: 2}}>Signed Contract</p>
                        <Upload
                            customRequest={this.handleUpload}
                            // listType="picture"
                            listType="picture-card"
                            maxCount={1}
                            fileList={fileList}
                            onRemove= {this.onRemove}
                        >
                            {!fileIds &&
                                <div style={{marginTop: 10}} >
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            }
                            {/* <Button icon={<UploadOutlined />} style={{marginTop: 10}} loading={imgLoading}>Upload Contract</Button> */}
                        </Upload>
                    </TabPane>
                    <TabPane tab="Next of Kin" key="Next of Kin" forceRender>
                        <Form
                            ref={this.kinRef}
                            Callback={this.KinCall}
                            FormFields={KinFields}
                        />
                    </TabPane>
                </Tabs>
            </Modal>
        );
    }
}

export default InfoModal;
