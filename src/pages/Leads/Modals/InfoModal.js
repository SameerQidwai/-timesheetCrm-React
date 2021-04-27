import React, { Component } from "react";
import { Modal, Tabs } from "antd";
import { LoadingOutlined } from "@ant-design/icons"; //Icons
import moment from "moment";
import Form from "../../../components/Core/Form";

import { addList, getRecord, editList, workWon } from "../../../service/opportunities";
import { getOrganizations, getStates, getOrgPersons, getPanels, getEmployees } from "../../../service/constant-Apis";

const { TabPane } = Tabs;

class InfoModal extends Component {
    constructor() {
        super();
        this.basicRef = React.createRef(); 
        this.tenderRef = React.createRef();
        this.billingRef = React.createRef();
        this.datesRef = React.createRef();
        this.manageRef = React.createRef();
        this.state = {
            editLead: false,
            basicSubmitted: false,
            tenderSubmitted: false,
            datesSubmitted: false,
            billingSubmitted: false,
            manageSubmitted: false,
            check: false,
            leadValue: 0,
            SKILLS: [],
            STATES: [],
            ORGS: [],
            loading: false,

            BasicFields: {
                //creating Component
                formId: "basic_form",
                FormCol: 24,
                // FieldSpace:24,
                justifyField: "center",
                FormLayout: "inline",
                contactPerson: [],
                size: "middle",
                fields: [
                    {
                        Placeholder: "Panel",
                        rangeMin: true,
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Organisation",
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
                        key: "panelId",
                        size: "small",
                        rules:[{ required: true, message: 'Panel is Required' }],
                        data: [],
                        type: "Select",
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "organizationId",
                        size: "small",
                        rules:[{ required: true, message: 'Organisation is Required' }],
                        data: [],
                        type: "Select",
                        onChange: function func(value) {
                            if (value){
                                console.log(value);
                                getOrgPersons(value).then(res=>{
                                    console.log(res.data);
                                    if(res.success){
                                        const { BasicFields } = this.state
                                        BasicFields.fields[6].data = res.data
                                        this.setState({ BasicFields })
                                    }
                                })
                            }else{
                                const { BasicFields } = this.state
                                BasicFields.fields[6].data = []
                                const { obj } = this.basicRef.current.refs.basic_form.getFieldsValue();
                                obj.contactPersonId = undefined
                                this.basicRef.current.refs.basic_form.setFieldsValue({ obj: obj, });
                                this.setState({ BasicFields })
                            }
                        }.bind(this)
                    },
                    {
                        Placeholder: "Delegate Contact Person",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Name",
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
                        key: "contactPersonId",
                        size: "small",
                        // rules:[{ required: true }],
                        data: [],
                        type: "Select",
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "title",
                        size: "small",
                        rules:[{ required: true, message: 'Name is Required' }],
                        type: "Input",
                    },
                    {
                        Placeholder: "Type",
                        rangeMin: true,
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
                        object: "obj",
                        fieldCol: 12,
                        key: "type",
                        size: "small",
                        rules:[{ required: true, message: 'Type is Required' }],
                        data: [{label: 'MILESTONE BASE', value: 1},
                            {label: 'TIME BASE', value: 2}],
                        type: "Select",
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "stateId",
                        size: "small",
                        // rules:[{ required: true }],
                        data: [],
                        type: "Select",
                        itemStyle: { marginBottom: "10px" },
                    },
                    {
                        Placeholder: "Qualified Ops",
                        fieldCol: 24,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "qualifiedOps",
                        // label: "Qualified Ops",
                        size: "small",
                        data: [
                            { label: "True", value: true },
                            { label: "False", value: false },
                        ],
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: "Gender is Obviously required",
                        //     },
                        // ],
                        itemStyle: { marginBottom: 1 },
                        // rules:[{ required: true }],
                        type: "Select",
                    },       
                                   
                ],
            },

            tenderFields: {
                //creating Component
                formId: "tender_form",
                FormCol: 24,
                // FieldSpace:24,
                justifyField: "center",
                FormLayout: "inline",
                contactPerson: [],
                size: "middle",
                fields: [
                    {
                        Placeholder: "Tender/RFQTS Title",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Tender/RFQTS Number",
                        size: "small",
                        fieldCol: 12,
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "tender",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "tenderNumber",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                    },
                    // {
                    //     Placeholder: "Tender Value",
                    //     size: "small",
                    //     fieldCol: 24,
                    //     type: "Text",
                    //     labelAlign: "right",
                    //     // itemStyle:{marginBottom:'10px'},
                    // },
                    // {
                    //     object: "obj",
                    //     fieldCol: 12,
                    //     layout:  { wrapperCol: 12 },
                    //     key: "tenderValue",
                    //     size: "small",
                    //     // rules:[{ required: true }],
                    //     type: "Input",
                    // },
                    
                ],
            },

            BillingFields: {
                formId: "billing_form",
                FormCol: 24,
                FieldSpace: 24,
                justifyField: "center",
                FormLayout: "inline",
                size: "middle",
                fields: [
                    {
                        Placeholder: "Estimated Value",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "CM",
                        size: "small",
                        fieldCol: 12,
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "value",
                        size: "small",
                        shape: "$",
                        // rules:[{ required: true }],
                        type: "InputNumber",
                        onChange: function setValue(value) {
                            const {obj} = this.billingRef.current.refs.billing_form.getFieldsValue();
                            obj.cm$ =  obj.cmPercentage? (value * obj.cmPercentage) /100 : 0
                            obj.discount =  obj.goget? (value * obj.goget) /100 : 0
                            obj.upside =  obj.discount? (value - obj.discount) : 0
                            this.billingRef.current.refs.billing_form.setFieldsValue({ obj: obj, });

                        }.bind(this),
                        fieldStyle: { width: "100%" },
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "cmPercentage",
                        size: "small",
                        shape: '%',
                        // rules:[{ required: true }],
                        type: "InputNumber",
                        rangeMin: 0,
                        rangeMax: 100,
                        fieldStyle: { width: "100%" },
                        onChange: function name(value) {
                            const {obj} = this.billingRef.current.refs.billing_form.getFieldsValue();
                            console.log(obj);
                            obj.cm$ =  obj.value? (obj.value * value) /100 : 0
                            this.billingRef.current.refs.billing_form.setFieldsValue({ obj: obj, });
                        }.bind(this)
                    },
                    
                    {
                        Placeholder: "CM",
                        size: "small",
                        fieldCol: 12,
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "GO",
                        size: "small",
                        fieldCol: 12,
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "cm$",
                        size: "small",
                        shape: '$',
                        disabled: true,
                        // rules:[{ required: true }],
                        type: "InputNumber",
                        fieldStyle: { width: "100%" },
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "goPercentage",
                        size: "small",
                        shape: '%',
                        // rules:[{ required: true }],
                        type: "InputNumber",
                        fieldStyle: { width: "100%" },
                        rangeMin: 0,
                        rangeMax: 100,
                        onChange: function name(value) {
                            const { obj } = this.billingRef.current.refs.billing_form.getFieldsValue();
                            obj.goget =  obj.getPercentage? (obj.getPercentage * value) /100 : 0
                            obj.discount =  (obj.goget && obj.value)? (obj.value * obj.goget) /100 : 0
                            obj.upside =  obj.discount? (obj.value - obj.discount) : 0
                            this.billingRef.current.refs.billing_form.setFieldsValue({ obj: obj, });
                        }.bind(this)
                    },
                    {
                        Placeholder: "Get",
                        size: "small",
                        fieldCol: 12,
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "GO/Get",
                        size: "small",
                        fieldCol: 12,
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "getPercentage",
                        size: "small",
                        shape: '%',
                        // rules:[{ required: true }],
                        type: "InputNumber",
                        rangeMin: 0,
                        rangeMax: 100,
                        fieldStyle: { width: "100%" },
                        onChange: function name(value) {
                            const { obj } = this.billingRef.current.refs.billing_form.getFieldsValue();
                            obj.goget =  obj.goPercentage? (obj.goPercentage * value) /100 : 0
                            obj.discount =  (obj.goget && obj.value)? (obj.value * obj.goget) /100 : 0
                            obj.upside =  obj.discount? (obj.value - obj.discount) : 0
                            this.billingRef.current.refs.billing_form.setFieldsValue({ obj: obj, });
                        }.bind(this)
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "goget",
                        size: "small",
                        shape: '%',
                        disabled: true,
                        // rules:[{ required: true }],
                        type: "InputNumber",
                        fieldStyle: { width: "100%" },
                    },
                    {
                        Placeholder: "Discounted Value",
                        size: "small",
                        fieldCol: 12,
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Upside Value",
                        size: "small",
                        fieldCol: 12,
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "discount",
                        size: "small",
                        disabled: true,
                        shape: '$',
                        // rules:[{ required: true }],
                        type: "InputNumber",
                        fieldStyle: { width: "100%" },
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "upside",
                        size: "small",
                        disabled: true,
                        shape: '$',
                        // rules:[{ required: true }],
                        type: "InputNumber",
                        fieldStyle: { width: "100%" },
                    },
                ],
            },

            DatesFields: {
                formId: "dates_form",
                FormCol: 24,
                FieldSpace: 24,
                justifyField: "center",
                FormLayout: "inline",
                size: "middle",
                initialValues: {entryDate: moment(new Date())},
                fields: [
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
                        object: "obj",
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
                    },
                    {
                        object: "obj",
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
                    },
 
                    {
                        Placeholder: "Daily Hours",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Bid Date",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                  
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "hoursPerDay",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "InputNumber",
                        fieldStyle: { width: "100%" },
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "bidDate",
                        size: "small",
                        type: "DatePicker",
                        fieldStyle: { width: "100%" },
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: "Start Date is required",
                        //     },
                        // ],
                    },
                    
                    {
                        Placeholder: "Entry Date",
                        fieldCol: 24,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "entryDate",
                        size: "small",
                        type: "DatePicker",
                        fieldStyle: { width: "100%" },
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: "Start Date is required",
                        //     },
                        // ],
                    },
                ],
            },

            ManageFields: {
                formId: "manage_form",
                FormCol: 24,
                FieldSpace: 24,
                justifyField: "center",
                FormLayout: "inline",
                size: "middle",
                fields: [
                    {
                        Placeholder: "Account Director",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                    },
                    {
                        Placeholder: "Account Manager",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "accountDirectorId",
                        size: "small",
                        data: [],
                        type: "Select",
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "accountManagerId",
                        size: "small",
                        data: [],
                        type: "Select",
                    },
                    // {
                    //     Placeholder: "Project Manager",
                    //     fieldCol: 12,
                    //     size: "small",
                    //     type: "Text",
                    //     labelAlign: "right",
                    // },
                    {
                        Placeholder: "Opportunity Manager",
                        fieldCol: 24,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                    },
                    // {
                    //     object: "obj",
                    //     fieldCol: 12,
                    //     key: "proM",
                    //     size: "small",
                    //     data: [],
                    //     type: "Select",
                    // },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "opportunityManagerId",
                        size: "small",
                        data: [],
                        type: "Select",
                    },
                ]
            }
        };
    }
    componentDidMount = () =>{
        this.fetchAll()
    }

    fetchAll = () =>{
        console.log('fetchAll');
        const { editLead, project }= this.props;  
        const { ManageFields } = this.state
        const dates = {entryDate: moment(new Date())}
        this.datesRef.current.refs.dates_form.setFieldsValue({ obj: dates, }); 
        // to set the Default entryDate for new Oppurtunity                              
        if (project){
            ManageFields.fields[4].Placeholder = "Project Manager"
            ManageFields.fields[5].key = "projectManagerId"
            // this.setState ({ManageFields})
        }
                                                 // either call this or call that
        Promise.all([ getPanels(), getOrganizations(), getStates(), editLead && this.getRecord(editLead), getEmployees()])
        .then(res => {
            if (res[1].success) {res[1].data[0].disabled = true}
            const { BasicFields, ManageFields } = this.state;
            BasicFields.fields[2].data = res[0].success? res[0].data : [];
            BasicFields.fields[3].data = res[1].success? res[1].data : [];
            BasicFields.fields[11].data = res[2].success? res[2].data : [];
            BasicFields.fields[6].data = res[3].success? res[3].data : [];

            ManageFields.fields[2].data = res[4].success ? res[4].data: [];
            ManageFields.fields[3].data = res[4].success ? res[4].data: [];
            ManageFields.fields[5].data = res[4].success ? res[4].data: [];
            // ManageFields.fields[7].data = res[4].success ? res[4].data: [];
            
            this.setState({ BasicFields, ManageFields })
        })
        .catch(e => {
            console.log(e);
        })
    }

    submit = () => {
        //submit button click
        
        this.basicRef.current.refs.basic_form.submit();
        this.tenderRef.current.refs.tender_form.submit();
        this.billingRef.current && this.billingRef.current.refs.billing_form.submit();
        this.datesRef.current && this.datesRef.current.refs.dates_form.submit();
        this.manageRef.current && this.manageRef.current.refs.manage_form.submit();
    };

    BasicCall = (vake) => { 
        // this will work after  got  Object from the skill from
        vake = vake.obj
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    ...{panelId: vake.panelId ?vake.panelId : null,
                        organizationId: vake.organizationId ?vake.organizationId : null,
                        contactPersonId: vake.contactPersonId ?vake.contactPersonId : null,
                        title: vake.title ?vake.title : '',
                        type: vake.type ?vake.type : '',
                        stateId: vake.stateId ?vake.stateId : null,
                        qualifiedOps: vake.qualifiedOps ?vake.qualifiedOps : false,
                    },
                },
                basicSubmitted: true, // skill form submitted
            },
            () => {
                const { basicSubmitted, tenderSubmitted, billingSubmitted, datesSubmitted, manageSubmitted, mergeObj } = this.state
                if ( basicSubmitted && tenderSubmitted && billingSubmitted && datesSubmitted && manageSubmitted) {
                    //check if both form is submittef
                    if (!this.props.editLead) {
                        
                        this.addOpportunity(mergeObj); //add skill
                    } else {
                        
                        this.editProject(mergeObj); //edit skill
                    }
                }
            }
        );
    };

    tenderCall = (vake) => {
        // this will work after  got  Object from the skill from
        vake = vake.obj
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    ...{
                        tender: vake.tender ? vake.tender : '',
                        tenderNumber: vake.tenderNumber ? vake.tenderNumber : '',
                    },
                },
                tenderSubmitted: true, // skill form submitted
            },
            () => {
                const { basicSubmitted, tenderSubmitted, billingSubmitted, datesSubmitted, manageSubmitted, mergeObj } = this.state
                if ( basicSubmitted && tenderSubmitted && billingSubmitted && datesSubmitted && manageSubmitted) {
                    //check if both form is submittef
                    if (!this.props.editLead) {
                        
                        this.addOpportunity(mergeObj); //add skill
                    } else {
                        
                        this.editProject(mergeObj); //edit skill
                    }
                }
            }
        );
    };

    BillingCall = (vake) => {
        // this will work after  getting the Object from level form
        vake = vake.obj
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    ...{
                        value: vake.value ? vake.value : 0,
                        cmPercentage: vake.cmPercentage ? vake.cmPercentage : 0,
                        goPercentage: vake.goPercentage ? vake.goPercentage : 0,
                        getPercentage: vake.getPercentage ? vake.getPercentage : 0,
                    },
                },
                billingSubmitted: true, // level form submitted
            },
            () => {
                const { basicSubmitted, tenderSubmitted, billingSubmitted, datesSubmitted, manageSubmitted, mergeObj } = this.state
                if ( basicSubmitted && tenderSubmitted && billingSubmitted && datesSubmitted && manageSubmitted) {
                    //check if both form is submittef
                    if (!this.props.editLead) {
                        
                        this.addOpportunity(mergeObj); //add skill
                    } else {
                        
                        this.editProject(mergeObj); //edit skill
                    }
                }
            }
        );
    };

    DatesCall = (vake) => {
        // this will work after I get the Object from the form
        vake = vake.obj
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    ...vake,
                },
                datesSubmitted: true, // level form submitted
            },
            () => {
                const { basicSubmitted, tenderSubmitted, billingSubmitted, datesSubmitted, manageSubmitted, mergeObj } = this.state
                if ( basicSubmitted && tenderSubmitted && billingSubmitted && datesSubmitted && manageSubmitted) {
                    //check if both form is submittef
                    if (!this.props.editLead) {
                        
                        this.addOpportunity(mergeObj); //add skill
                    } else {
                        
                        this.editProject(mergeObj); //edit skill
                    }
                }
            }
        );
    };

    ManageCall = (vake) => {
        // this will work after I get the Object from the form
        vake = vake.obj
        
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    ...{
                        accountDirectorId: vake.accountDirectorId ? vake.accountDirectorId : null,
                        accountManagerId: vake.accountManagerId ? vake.accountManagerId : null,
                        opportunityManagerId: vake.opportunityManagerId ? vake.opportunityManagerId : null,
                        projectManagerId: vake.projectManagerId ? vake.projectManagerId : null,
                    },
                },
                manageSubmitted: true, // level form submitted
            },
            () => {
                const { basicSubmitted, tenderSubmitted, billingSubmitted, datesSubmitted, manageSubmitted, mergeObj } = this.state
                if ( basicSubmitted && tenderSubmitted && billingSubmitted && datesSubmitted && manageSubmitted) {
                    //check if both form is submittef
                    if (!this.props.editLead) {
                        
                        this.addOpportunity(mergeObj); //add skill
                    } else {
                        
                        this.editProject(mergeObj); //edit skill
                    }
                }
            }
        );
    };

    addOpportunity = (value) => {
        const { callBack } = this.props;
        this.setState({basicSubmitted: false, tenderSubmitted: false, billingSubmitted: false, datesSubmitted: false, manageSubmitted: false})
        addList(value).then((res) => {
            if(res.success){
                callBack()
            }
        });
    };

    editProject = () =>{
        const { project } = this.props
        if (project){
            this.workWon()
        }else{
            this.editRecord()
        }
    }

    getRecord = (id) => {
        const { ManageFields }= this.state
        console.log(ManageFields.fields[4], ManageFields.fields[5]);
        return getRecord(id).then((res) => {
            if (res.success){
                const { basic, tender, billing, dates, manage } = res

                const contactPersons = getOrgPersons(basic.organizationId)
                this.basicRef.current.refs.basic_form.setFieldsValue({ obj: basic, });
                this.tenderRef.current.refs.tender_form.setFieldsValue({ obj: tender, });
                this.billingRef.current.refs.billing_form.setFieldsValue({ obj: billing, });
                this.datesRef.current.refs.dates_form.setFieldsValue({ obj: dates, });
                this.manageRef.current.refs.manage_form.setFieldsValue({ obj: manage, });
                return contactPersons
            }
        })

    };

    editRecord = () => {
        const { editLead, callBack } = this.props;
        const { mergeObj } = this.state
        mergeObj.id = editLead
        this.setState({
            basicSubmitted: false, 
            tenderSubmitted: false, 
            billingSubmitted: false, 
            datesSubmitted: false, 
            manageSubmitted: false,
            loading: true
        })
        editList(mergeObj).then((res) => {
            console.log(res);
            if(res.success){
                callBack()
            }
        });
    };

    workWon = () =>{
        const { editLead, callBack } = this.props;
        const { mergeObj } = this.state
        console.log('workWon');
        this.setState({
            basicSubmitted: false, 
            tenderSubmitted: false, 
            billingSubmitted: false, 
            datesSubmitted: false, 
            manageSubmitted: false,
            loading: true
        })
        workWon(editLead, mergeObj).then((res) => {
            console.log(res);
            if(res.success){
                callBack()
            }
        });
    }

    render() {
        const { editLead, visible, close } = this.props;
        const { BasicFields, tenderFields, DatesFields, BillingFields, ManageFields, loading } = this.state
        return (
            <Modal
                title={editLead? "Edit opportunity" : "Add New opportunity"}
                maskClosable={false}
                centered
                visible={visible}
                onOk={() => { this.submit(); }}
                okButtonProps={{ disabled: loading }}
                okText={loading ?<LoadingOutlined /> :"Save"}
                onCancel={close}
                width={750}
                // footer={[
                //         <Button key="1" style={{float:'left'}} type="primary"> Add To Project</Button>,
                //         <Button key="2" onClick={close}>Cancel</Button>,
                //         <Button key="3" type="primary" onClick={() => { this.submit(); }}> Save </Button>
                //   ]}
            >
                <Tabs type="card">
                    <TabPane tab="Opportunity Info" key="basic" forceRender>
                        <Form
                            ref={this.basicRef}
                            Callback={this.BasicCall}
                            FormFields={BasicFields}
                        />
                    </TabPane>
                    <TabPane tab="Tender/RFQTS Info" key="tender" forceRender>
                        <Form
                            ref={this.tenderRef}
                            Callback={this.tenderCall}
                            FormFields={tenderFields}
                        />
                    </TabPane>
                    <TabPane tab="Date Info" key="dates" forceRender>
                        <Form
                            ref={this.datesRef}
                            Callback={this.DatesCall}
                            FormFields={DatesFields}
                        />
                    </TabPane>
                    <TabPane tab="Forecast" key="forecast" forceRender>
                        <Form
                            ref={this.billingRef}
                            Callback={this.BillingCall}
                            FormFields={BillingFields}
                        />
                    </TabPane>                    
                    <TabPane tab="Manage" key="manage" forceRender>
                        <Form
                            ref={this.manageRef}
                            Callback={this.ManageCall}
                            FormFields={ManageFields}
                        />
                    </TabPane>                    
                </Tabs>
            </Modal>
        );
    }
}

export default InfoModal;
