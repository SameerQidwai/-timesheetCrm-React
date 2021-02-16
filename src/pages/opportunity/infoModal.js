import React, { Component } from "react";
import { Modal, Tabs } from "antd";
import { CloseOutlined, PlusSquareOutlined } from "@ant-design/icons"; //Icons
import moment from "moment";
import Form from "../../components/Core/Form";

// import { addList, getOrgRecord, editList } from "../../../service/Organizations";
import { getOrganizations, getStates, getStandardLevels, getOrgPersons, getPanels } from "../../service/constant-Apis";

const { TabPane } = Tabs;

class InfoModal extends Component {
    constructor() {
        super();
        this.basicRef = React.createRef(); 
        this.tenderRef = React.createRef();
        this.billingRef = React.createRef();
        this.datesRef = React.createRef();
        this.resourceRef = React.createRef();
        this.state = {
            editLead: false,
            basicSubmitted: false,
            tenderSubmitted: false,
            datesSubmitted: false,
            billingSubmitted: false,
            resourceSubmitted: false,
            check: false,

            SKILLS: [],
            STATES: [],
            ORGS: [],

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
                        Placeholder: "Lead ID",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Panel",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "id",
                        size: "small",
                        disabled: true,
                        type: "Input",
                        itemStyle:{marginBottom: 1},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "panelId",
                        size: "small",
                        // rules:[{ required: true }],
                        data: [],
                        type: "Select",
                    },
                    {
                        Placeholder: "Organization",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
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
                        object: "obj",
                        fieldCol: 12,
                        key: "OrganizationId",
                        size: "small",
                        // rules:[{ required: true }],
                        data: [],
                        type: "Select",
                        onChange: function func(value) {
                            if (value){
                                getOrgPersons(value).then(res=>{
                                    if(res.success){
                                        const { BasicFields } = this.state
                                        BasicFields.fields[7].data = res.data
                                        this.setState({ BasicFields })
                                    }
                                })
                            }else{
                                const { BasicFields } = this.state
                                BasicFields.fields[7].data = []
                                this.setState({ BasicFields })
                            }
                        }.bind(this)
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
                        Placeholder: "Name",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Value",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "name",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "value",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
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
                        // rules:[{ required: true }],
                        data: [],
                        type: "Select",
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "state",
                        size: "small",
                        // rules:[{ required: true }],
                        data: [],
                        type: "Select",
                        itemStyle: { marginBottom: "10px" },
                    },    
                    {
                        object: "kin",
                        fieldCol: 12,
                        key: "qualifiedOps",
                        label: "Qualified Ops",
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
                        type: "Radio",
                        mode: "button",
                        shape: "solid",
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
                        Placeholder: "Tender",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Tender Number",
                        size: "small",
                        fieldCol: 12,
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "tenderName",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "tenderContact",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                    },
                    {
                        Placeholder: "Tender Value",
                        size: "small",
                        fieldCol: 24,
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        layout:  { wrapperCol: 12 },
                        key: "tenderValue",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                    },
                    
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
                        Placeholder: "CM",
                        size: "small",
                        fieldCol: 12,
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
                        key: "cm%",
                        size: "small",
                        shape: '%',
                        // rules:[{ required: true }],
                        type: "InputNumber",
                        fieldStyle: { width: "100%" },
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "cm$",
                        size: "small",
                        shape: '$',
                        // rules:[{ required: true }],
                        type: "InputNumber",
                        fieldStyle: { width: "100%" },
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
                        Placeholder: "Get",
                        size: "small",
                        fieldCol: 12,
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "go%",
                        size: "small",
                        shape: '%',
                        // rules:[{ required: true }],
                        type: "InputNumber",
                        fieldStyle: { width: "100%" },
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "get%",
                        size: "small",
                        shape: '%',
                        // rules:[{ required: true }],
                        type: "InputNumber",
                        fieldStyle: { width: "100%" },
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
                        Placeholder: "Discounted Value",
                        size: "small",
                        fieldCol: 12,
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "goget%",
                        size: "small",
                        shape: '%',
                        // rules:[{ required: true }],
                        type: "InputNumber",
                        fieldStyle: { width: "100%" },
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "discount",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "InputNumber",
                        fieldStyle: { width: "100%" },
                    },
                    {
                        Placeholder: "Upside Value",
                        size: "small",
                        fieldCol: 24,
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "upside",
                        size: "small",
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
                        Placeholder: "Total Months",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
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
                        object: "obj",
                        fieldCol: 12,
                        key: "months",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "InputNumber",
                        fieldStyle: { width: "100%" },
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "d_hours",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "InputNumber",
                        fieldStyle: { width: "100%" },
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
                        Placeholder: "Entry Date",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
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

            ResourceFields: {
                formId: "resource_form",
                FormCol: 24,
                FieldSpace: 24,
                justifyField: "center",
                FormLayout: "inline",
                size: "middle",
                fields: [
                    {
                        Placeholder: "Project Manager",
                        fieldCol: 20,
                        size: "small",
                        type: "Text",
                        mode: 'strong',
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: `Add Employee`,
                        fieldCol: 4,
                        size: "small",
                        type: "Button",
                        mode: 'strong',
                        labelAlign: "right",
                        onClick: function func(value, e) {
                            this.insertSkill()
                        }.bind(this),
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Skill",
                        fieldCol: 7,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Level",
                        fieldCol: 7,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Employee",
                        fieldCol: 8,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "p_obj",
                        fieldCol: 7,
                        layout: { wrapperCol: { span: 23 } },
                        key: 'pSkill',
                        size: "small",
                        // rules:[{ required: true }],
                        data: this.state? this.state.SKILLS: [],
                        type: "Select",
                        onChange: function func(e, value) {
                           const { ResourceFields } = this.state
                            ResourceFields.fields.map(el=>{
                                if (el.key === 'pLevel'){
                                    el.data = value? value.levels: []
                                    return el
                               }else{
                                   return el
                               }
                           })
                            const {obj} = this.resourceRef.current.refs.resource_form.getFieldsValue() // const
                            delete obj['pLevel'];
                            this.resourceRef.current.refs.resource_form.setFieldsValue({ obj, })
                           this.setState({ResourceFields})
                        }.bind(this),
                    },
                    {
                        object: "p_obj",
                        fieldCol: 7,
                        layout: { wrapperCol: { span: 23 } },
                        key: 'pLevel',
                        size: "small",
                        // rules:[{ required: true }],
                        data: [],
                        type: "Select",
                        // onChange: function func(e, value) {
                        //    const { ResourceFields } = this.state
                        //     ResourceFields.fields.map(el=>{
                        //         if (el.key === 'p_name'){
                        //             el.data = value? value.levels: []
                        //             return el
                        //        }else{
                        //            return el
                        //        }
                        //    })
                        //     const {obj} = this.resourceRef.current.refs.resource_form.getFieldsValue() // const
                        //     delete obj['p_name'];
                        //     this.resourceRef.current.refs.resource_form.setFieldsValue({ obj, })
                        //    this.setState({ResourceFields})
                        // }.bind(this),
                    },
                    {
                        object: "p_obj",
                        fieldCol: 8,
                        layout: { wrapperCol: { span: 23 } },
                        key: 'p_name',
                        size: "small",
                        // rules:[{ required: true }],
                        data: [],
                        type: "Select",
                    },
                    // {
                    //     Placeholder: <CloseOutlined />,
                    //     fieldCol: 2,
                    //     size: "small",
                    //     type: "Text",
                    //     labelAlign: "right",
                    //     style: { textAlign: "right", },
                    //     fieldStyle: { cursor: "pointer", },
                    //     onClick: function func(value, e) {
                    //         const p_obj= {pSkill: "", pLevel: "", p_name:""}
                    //         this.resourceRef.current.refs.resource_form.setFieldsValue({p_obj})
                    //     }.bind(this),
                        
                    //     // itemStyle:{marginBottom:'10px'},
                    // },
                    {
                        Placeholder: "Employee",
                        fieldCol: 24,
                        size: "small",
                        type: "Text",
                        mode: 'strong',
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Skill",
                        fieldCol: 7,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Level",
                        fieldCol: 7,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Employee",
                        fieldCol: 8,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                ],
            },
        };
    }
    componentDidMount = () =>{
        const { editLead } = this.props
        this.fetchAll()
    }

    fetchAll = () =>{
        const { editLead }= this.props;                                             // either call this or call that
        Promise.all([ getPanels(), getOrganizations(), getStates(), getStandardLevels()])
        .then(res => {
            console.log(res);
            const { BasicFields, ResourceFields } = this.state;
                BasicFields.fields[3].data = res[0].success? res[0].data : [];
                BasicFields.fields[6].data = res[1].success? res[1].data : [];
                BasicFields.fields[15].data = res[2].success? res[2].data : [];
                ResourceFields.fields[5].data = res[3].success? res[3].data : [];
            this.setState({
                BasicFields,
                ResourceFields,
                SKILLS: res[2].success? res[2].data : []
            },()=>{
                if (editLead){
                    this.getRecord(editLead)
                }else{
                    this.insertSkill(0)
                }
            })
        })
        .catch(e => {
            console.log(e);
        })
    }

    insertSkill = () => {
        const { ResourceFields } = this.state;
        let obj = ResourceFields.fields[ResourceFields.fields.length - 1]; // get the inster number for keys
        const item_no = (parseInt(obj.key) || obj.key===0 )? parseInt(obj.key) + 1 : 0;
        ResourceFields.fields = ResourceFields.fields.concat( ...this.newResourceField(item_no) );
        this.setState({ ResourceFields, });
    };

    newResourceField = (item_no, level_data) => {
        //inserting new fields in modals
        const {SKILLS} = this.state
        const splice_key = [`skill${item_no}`, `level${item_no}`, `name${item_no}`, item_no];
        return [
            {
                object: "obj",
                fieldCol: 7,
                layout: { wrapperCol: { span: 23 } },
                key: splice_key[0],
                size: "small",
                // rules:[{ required: true }],
                data: SKILLS? SKILLS:[],
                type: "Select",
                onChange: function func(e, value) {
                   const { ResourceFields } = this.state
                    ResourceFields.fields.map(el=>{
                        if (el.key ===splice_key[1]){
                            el.data = value? value.levels: []
                            return el
                       }else{
                           return el
                       }
                   })
                    const { obj } = this.resourceRef.current.refs.resource_form.getFieldsValue() // const
                    delete obj[splice_key[1]];
                    this.resourceRef.current.refs.resource_form.setFieldsValue({ obj, })
                   this.setState({ResourceFields})
                }.bind(this),
            },
            {
                object: "obj",
                fieldCol: 7,
                layout: { wrapperCol: { span: 20 } },
                key: splice_key[1],
                size: "small",
                // rules:[{ required: true }],
                data: level_data? level_data: [],
                type: "Select",
                labelAlign: "left",
                itemStyle: { marginBottom: "5px" },
                // rules: [
                //     {
                //         required: true,
                //         message: "obj is required",
                //     },
                // ],
            },
            {
                object: "obj",
                fieldCol: 8,
                layout: { wrapperCol: { span: 20 } },
                key: splice_key[2],
                size: "small",
                // rules:[{ required: true }],
                data: [],
                type: "Select",
                labelAlign: "left",
                itemStyle: { marginBottom: "5px" },
                // rules: [
                //     {
                //         required: true,
                //         message: "obj is required",
                //     },
                // ],
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
                onClick: function func(value, e) {
                    const { ResourceFields } = this.state;
                    ResourceFields.fields = ResourceFields.fields.filter((obj) => {
                        return (
                            obj.key !== splice_key[0] &&
                            obj.key !== splice_key[1] &&
                            obj.key !== splice_key[2] &&
                            obj.key !== splice_key[3]
                        );
                    });
                    const {obj} = this.resourceRef.current.refs.resource_form.getFieldsValue() // const
                    delete obj[splice_key[0]];
                    delete obj[splice_key[1]];
                    delete obj[splice_key[2]];
                    delete obj[splice_key[3]];
                    this.resourceRef.current.refs.resource_form.setFieldsValue({ obj, })
                    this.setState({ ResourceFields, });
                }.bind(this),
            },
        ];
    };

    submit = () => {
        //submit button click
        this.basicRef.current.refs.basic_form.submit();
        this.tenderRef.current.refs.tender_form.submit();
        this.billingRef.current && this.billingRef.current.refs.billing_form.submit();
        this.datesRef.current && this.datesRef.current.refs.dates_form.submit();
        this.resourceRef.current && this.resourceRef.current.refs.dates_form.submit();
    };

    BasicCall = (vake) => { 
        // this will work after  got  Object from the skill from
        ;
        vake = vake.obj
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    ...vake,
                },
                basicSubmitted: true, // skill form submitted
            },
            () => {
                if (
                    this.state.basicSubmitted &&
                    this.state.tenderSubmitted &&
                    this.state.billingSubmitted &&
                    this.state.resourceSubmitted &&
                    this.state.datesSubmitted
                ) {
                    //check if both form is submittef
                    if (!this.props.editLead) {
                        
                        this.addOrganization(this.state.mergeObj); //add skill
                    } else {
                        
                        this.editRecord(this.state.mergeObj); //edit skill
                    }
                }
            }
        );
    };

    tenderCall = (vake) => {
        // this will work after  got  Object from the skill from
        ;
        vake = vake.obj
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    ...vake,
                },
                tenderSubmitted: true, // skill form submitted
            },
            () => {
                if (
                    this.state.basicSubmitted &&
                    this.state.tenderSubmitted &&
                    this.state.billingSubmitted &&
                    this.state.resourceSubmitted &&
                    this.state.datesSubmitted
                ) {
                    //check if both form is submittef
                    if (!this.props.editLead) {
                        
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
                    ...vake,
                },
                billingSubmitted: true, // level form submitted
            },
            () => {
                if (
                    this.state.basicSubmitted &&
                    this.state.tenderSubmitted &&
                    this.state.billingSubmitted &&
                    this.state.resourceSubmitted &&
                    this.state.datesSubmitted
                ) {
                    //check if both form is submittef
                    if (!this.props.editLead) {
                        
                        this.addOrganization(this.state.mergeObj); //add skill
                    } else {
                        
                        this.editRecord(this.state.mergeObj); //edit skill
                    }
                }
            }
        );
    };

    DatesCall = (vake) => {
        // this will work after I get the Object from the form
        ;
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
                if (
                    this.state.basicSubmitted &&
                    this.state.tenderSubmitted &&
                    this.state.billingSubmitted &&
                    this.state.resourceSubmitted &&
                    this.state.datesSubmitted
                ) {
                    //check if both form is submittef
                    if (!this.props.editLead) {
                        
                        this.addOrganization(this.state.mergeObj); //add skill
                    } else {
                        
                        this.editRecord(this.state.mergeObj); //edit skill
                    }
                }
            }
        );
    };

    ResourceCall = (vake) => {
        // this will work after I get the Object from the form
        ;
        vake = vake.obj
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    ...vake,
                },
                resourceSubmitted: true, // level form submitted
            },
            () => {
                if (
                    this.state.basicSubmitted &&
                    this.state.tenderSubmitted &&
                    this.state.billingSubmitted &&
                    this.state.resourceSubmitted &&
                    this.state.datesSubmitted
                ) {
                    //check if both form is submittef
                    if (!this.props.editLead) {
                        
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
        // addList(value).then((res) => {
        //     if(res.success){
        //         callBack()
        //     }
        // });
    };

    getRecord = (id) => {
        // const { editLead } = this.props;
        // getOrgRecord(id).then((res) => {
        //     if (res.success){
                const vake = {}
                ;
                let basic = { }
                let billing = { }
                let dates = { }
                let resource = { }

                this.basicRef.current.refs.basic_form.setFieldsValue({ obj: basic, });
                this.tenderRef.current.refs.tender_form.setFieldsValue({ obj: basic, });
                this.billingRef.current.refs.billing_form.setFieldsValue({ obj: billing, });
                this.datesRef.current.refs.dates_form.setFieldsValue({ obj: dates, });
                this.resourceRef.current.refs.resource_form.setFieldsValue({ obj: resource, });
        //     }
        // })

    };

    editRecord = (value) => {
        const { editLead, callBack } = this.props;
        value.id = editLead
        // editList(value).then((res) => {
        //     console.log(res);
        //     if(res.success){
                console.log('hereh');
                callBack()
        //     }
        // });
    };

    render() {
        const { editLead, visible, close } = this.props;
        const { BasicFields, tenderFields, DatesFields, BillingFields, ResourceFields } = this.state
        return (
            <Modal
                title={editLead? "Edit opportunity" : "Add New opportunity"}
                centered
                visible={visible}
                onOk={() => {
                    this.submit();
                }}
                okText={"Save"}
                onCancel={close}
                width={750}
            >
                <Tabs type="card">
                    <TabPane tab="Project Info" key="basic" forceRender>
                        <Form
                            ref={this.basicRef}
                            Callback={this.BasicCall}
                            FormFields={BasicFields}
                        />
                    </TabPane>
                    <TabPane tab="Tender Info" key="tender" forceRender>
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
                    <TabPane tab="Billing Info" key="billing" forceRender>
                        <Form
                            ref={this.billingRef}
                            Callback={this.BillingCall}
                            FormFields={BillingFields}
                        />
                    </TabPane>
                    <TabPane tab="Resource Info" key="resource" forceRender>
                        <Form
                            ref={this.resourceRef}
                            Callback={this.ResourceCall}
                            FormFields={ResourceFields}
                        />
                    </TabPane>
                    
                </Tabs>
            </Modal>
        );
    }
}

export default InfoModal;
