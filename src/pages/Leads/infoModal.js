import React, { Component } from "react";
import { Button, Modal, Tabs } from "antd";
import { CloseOutlined, PlusSquareOutlined } from "@ant-design/icons"; //Icons
import moment from "moment";
import Form from "../../components/Core/Form";

import { addList, getRecord, editList } from "../../service/opportunities";
import { getOrganizations, getStates, getOrgPersons, getPanels } from "../../service/constant-Apis";

const { TabPane } = Tabs;

class InfoModal extends Component {
    constructor() {
        super();
        this.basicRef = React.createRef(); 
        this.tenderRef = React.createRef();
        this.billingRef = React.createRef();
        this.datesRef = React.createRef();
        this.state = {
            editLead: false,
            basicSubmitted: false,
            tenderSubmitted: false,
            datesSubmitted: false,
            billingSubmitted: false,
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
                        Placeholder: "Organisation",
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
                        key: "organizationId",
                        size: "small",
                        // rules:[{ required: true }],
                        data: [],
                        type: "Select",
                        onChange: function func(value) {
                            if (value){
                                console.log(value);
                                getOrgPersons(value).then(res=>{
                                    console.log(res.data);
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
                        key: "title",
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
                        object: "obj",
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
                        onChange: function name(params, options) {
                            console.log({params}, {options});
                        }
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
                        key: "cmPercentage",
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
                        key: "goPercentage",
                        size: "small",
                        shape: '%',
                        // rules:[{ required: true }],
                        type: "InputNumber",
                        fieldStyle: { width: "100%" },
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "getPercentage",
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

        };
    }
    componentDidMount = () =>{
        this.fetchAll()
    }

    fetchAll = () =>{
        console.log('fetchAll');
        const { editLead }= this.props;                                             // either call this or call that
        Promise.all([ getPanels(), getOrganizations(), getStates(), editLead && this.getRecord(editLead)])
        .then(res => {
            console.log(res[1].data);
            const { BasicFields } = this.state;
                BasicFields.fields[3].data = res[0].success? res[0].data : [];
                BasicFields.fields[6].data = res[1].success? res[1].data : [];
                BasicFields.fields[15].data = res[2].success? res[2].data : [];
                BasicFields.fields[7].data = res[3].success? res[3].data : [];
            this.setState({
                BasicFields,
            })
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
                    this.state.datesSubmitted
                ) {
                    //check if both form is submittef
                    if (!this.props.editLead) {
                        
                        this.addOpportunity(this.state.mergeObj); //add skill
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
                    this.state.datesSubmitted
                ) {
                    //check if both form is submittef
                    if (!this.props.editLead) {
                        
                        this.addOpportunity(this.state.mergeObj); //add skill
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
                    this.state.datesSubmitted
                ) {
                    //check if both form is submittef
                    if (!this.props.editLead) {
                        
                        this.addOpportunity(this.state.mergeObj); //add skill
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
                const { basicSubmitted, tenderSubmitted, billingSubmitted, datesSubmitted, mergeObj } = this.state
                if ( basicSubmitted && tenderSubmitted && billingSubmitted && datesSubmitted ) {
                    //check if both form is submittef
                    if (!this.props.editLead) {
                        
                        this.addOpportunity(mergeObj); //add skill
                    } else {
                        
                        this.editRecord(mergeObj); //edit skill
                    }
                }
            }
        );
    };

    addOpportunity = (value) => {
        const { callBack } = this.props;
        console.log(value);
        addList(value).then((res) => {
            if(res.success){
                callBack()
            }else{
                 this.setState({basicSubmitted: false, tenderSubmitted: false, billingSubmitted: false, datesSubmitted: false})
            }
        });
    };

    getRecord = (id) => {
        return getRecord(id).then((res) => {
            if (res.success){
                const {basic, tender, billing, dates } = res
                const contactPersons = getOrgPersons(basic.organizationId)
                this.basicRef.current.refs.basic_form.setFieldsValue({ obj: basic, });
                this.tenderRef.current.refs.tender_form.setFieldsValue({ obj: tender, });
                this.billingRef.current.refs.billing_form.setFieldsValue({ obj: billing, });
                this.datesRef.current.refs.dates_form.setFieldsValue({ obj: dates, });
                return contactPersons
            }
        })

    };

    editRecord = (data) => {
        const { editLead, callBack } = this.props;
        console.log(this.props);
        data.id = editLead
        editList(data).then((res) => {
            console.log(res);
            if(res.success){
                callBack()
            }else{
                this.setState({basicSubmitted: false, tenderSubmitted: false, billingSubmitted: false, datesSubmitted: false})
            }
        });
    };

    render() {
        const { editLead, visible, close } = this.props;
        const { BasicFields, tenderFields, DatesFields, BillingFields } = this.state
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
                // footer={[
                //         <Button key="1" style={{float:'left'}} type="primary"> Add To Project</Button>,
                //         <Button key="2" onClick={close}>Cancel</Button>,
                //         <Button key="3" type="primary" onClick={() => { this.submit(); }}> Save </Button>
                //   ]}
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
                </Tabs>
            </Modal>
        );
    }
}

export default InfoModal;
