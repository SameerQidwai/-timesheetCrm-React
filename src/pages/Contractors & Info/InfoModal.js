import React, { Component } from "react";
import { Modal, Tabs, Row, Col, Select } from "antd";

import Form from "../../components/Core/Form";
import moment from "moment";

import { addList, getRecord, editList } from "../../service/contractors";
import { getContactRecord } from "../../service/conatct-person";
import { getOrganisations, getOrgPersons, getStates } from "../../service/constant-Apis";

const { TabPane } = Tabs;

class InfoModal extends Component {
    constructor() {
        super();
        this.basicRef = React.createRef();
        this.billingRef = React.createRef();

        this.state = {
            editCont: false,
            basicSubmitted: false,
            billingSubmitted: false,
            CONTACTS:[],
            sContact: null,
            ORGS: [],
            sOrg: null,
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

            BillingFields: {
                formId: "billing_form",
                FormCol: 24,
                FieldSpace: 24,
                justifyField: "center",
                FormLayout: "inline",
                layout: { labelCol: { span: 9 }, wrapperCol: { span: 0 } },
                size: "middle",
                fields: [
                    // {
                    //     Placeholder: "Payslip Email",
                    //     fieldCol: 12,
                    //     size: "small",
                    //     type: "Text",
                    //     labelAlign: "right",
                    //     // itemStyle:{marginBottom:'10px'},
                    // },
                    // {
                    //     Placeholder: "Work Hours In a Day",
                    //     fieldCol: 12,
                    //     size: "small",
                    //     type: "Text",
                    //     labelAlign: "right",
                    //     // itemStyle:{marginBottom:'10px'},
                    // },
                    // {
                    //     object: "billing",
                    //     fieldCol: 12,
                    //     key: "payslipEmail",
                    //     size: "small",
                    //     type: "input",
                    //     // rules: [
                    //     //     {
                    //     //         required: true,
                    //     //         message: "Payment Email is required",
                    //     //     },
                    //     // ],
                    //     itemStyle: { marginBottom: 1 },
                    // },
                    // {
                    //     object: "billing",
                    //     fieldCol: 12,
                    //     key: "noOfHours",
                    //     size: "small",
                    //     type: "InputNumber",
                    //     // shape: " Hours",
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
                        Placeholder: "Remuneration Frequancy",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
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
                        Placeholder: "Start Date",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "End Date",
                        fieldCol: 12,
                        size: "small",
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
        const { editCont } = this.state
        if (editCont) {
            this.getRecord(editCont);
        }

        getOrganisations().then(res=>{
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
        Promise.all([ getStates(), edit ? this.getRecord(edit) : getOrganisations()])
        .then(res => {
            const { BasicFields } = this.state
            BasicFields.fields[15].data = res[0].data;
                this.setState({
                    BasicFields,
                    ORGS: !edit ? res[1].data.filter((item) => item.value !== 1): [],
                })
        })
        .catch(e => {
            console.log(e);
        })
    }

    submit = () => {
        //submit button click
        this.basicRef.current && this.basicRef.current.refs.basic_form.submit();
        this.billingRef.current && this.billingRef.current.refs.billing_form.submit();
    };

    BasicCall = (vake) => {
        // this will work after  got  Object from the skill from
        const { editCont } = this.props
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    ...vake.basic,
                },
                basicSubmitted: true, // skill form submitted
            },
            () => {
                if ( this.state.basicSubmitted && this.state.billingSubmitted ) {
                    //check if both form is submittef
                    if (!editCont) {
                        console.log("emes");
                        this.addContactor(this.state.mergeObj); //add skill
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
        const { editCont } = this.props
        vake.billing.noOfHoursPer = 1; 
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    latestContract: vake.billing,
                },
                billingSubmitted: true, // level form submitted
            },
            () => {
                if ( this.state.basicSubmitted && this.state.billingSubmitted ) {
                    //check if both form is submittef
                    if (!editCont) {
                        console.log("emes");
                        this.addContactor(this.state.mergeObj); //add skill
                    } else {
                        console.log("edit");
                        this.editRecord(this.state.mergeObj); //edit skill
                    }
                }
            }
        );
    };

    addContactor = (data) => {
        const { callBack } = this.props;
        const { sContact, sOrg } = this.state
        data.contactPersonId = sContact
        data.organisationId = sOrg
        addList(data).then(res=>{
            if(res.success){
                callBack();
            }else{
                this.setState({
                    basicSubmitted: false,
                    billingSubmitted: false
                })
            }
        })
    };

    getRecord = (id) => {
        getRecord(id).then(res=>{
            if (res.success){
                this.basicRef.current.refs.basic_form.setFieldsValue({ basic: res.basic, });
                this.billingRef.current.refs.billing_form.setFieldsValue({ billing: res.billing, })
            }
        })
    };

    editRecord = (value) => {
        const { editCont, callBack } = this.props;
        editList(editCont, value).then((res) => {
            if(res.success){
                console.log('editRecord');
                callBack()
            }else{
                this.setState({
                    basicSubmitted: false,
                    billingSubmitted: false
                })
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
        getOrgPersons(value).then(res=>{
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
                res.data.cpCode = `Emp-00${res.data.id}`
                res.data.dateOfBirth = res.data.dateOfBirth && moment(res.data.dateOfBirth) 
                this.basicRef.current.refs.basic_form.setFieldsValue({ basic: res.data, });
                this.setState({sContact: value})
            }
        })
    };

    onClear = (org, person) =>{
        this.setState({
            sContact: person,
            sOrg: org, // if onPerson is select Organisation won't get null, but if organizaion get clear both values get null
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

    render() {
        const { editCont, visible } = this.props;
        const { BasicFields, BillingFields, sContact, CONTACTS, ORGS, sOrg } = this.state;

        return (
            <Modal
                title={editCont ? "Edit Contactor" : "Add Contactor"}
                centered
                visible={visible}
                onOk={() => {
                    this.submit();
                }}
                okText={"Save"}
                onCancel={this.onCancel}
                width={700}
            >
                {!editCont &&<Row style={{marginBottom:"1em"}} justify="space-between">
                    <Col>
                        <Select
                            value={sOrg}
                            placeholder="Organisation"
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
                            style={{width:"20em"}}
                        />
                    </Col>
                    <Col>
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
                            style={{width:"20em"}}
                        />
                    </Col>
                </Row>}
                <Tabs type="card">
                    <TabPane tab="Basic" key="1" forceRender>
                        <Form
                            ref={this.basicRef}
                            Callback={this.BasicCall}
                            FormFields={BasicFields}
                        />
                    </TabPane>
                    <TabPane tab="Contaract" key="4" forceRender>
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
