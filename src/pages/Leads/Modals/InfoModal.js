import React, { Component } from "react";
import { Modal, Tabs, Form } from "antd";
import { LoadingOutlined } from "@ant-design/icons"; //Icons
import moment from "moment";
import FormItems from "../../../components/Core/Forms/FormItems";

import { addList, getRecord, editList, workWon } from "../../../service/opportunities";
import { getOrganizations, getStates, getOrgPersons, getPanels, getProjects } from "../../../service/constant-Apis";

const { TabPane } = Tabs;

class InfoModal extends Component {
    constructor() {
        super();
        this.formRef = React.createRef(); 

        this.state = {
            editLead: false,
            formSubmitted: false,
            check: false,
            leadValue: 0,
            SKILLS: [],
            STATES: [],
            ORGS: [],
            loading: false,

            BasicFields: [
                {
                    Placeholder: "Panel",
                    rangeMin: true,
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    Placeholder: "Organisation",
                    rangeMin: true,
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    object: "basic",
                    fieldCol: 12,
                    key: "panelId",
                    size: "small",  
                    rules:[{ required: true, message: 'Panel is Required' }],
                    data: [],
                    type: "Select",
                },
                {
                    object: "basic",
                    fieldCol: 12,
                    key: "organizationId",
                    size: "small",
                    rules:[{ required: true, message: 'Organisation is Required' }],
                    data: [],
                    type: "Select",
                    onChange: (value)=> {
                        if (value){
                            const customUrl = `helpers/contact-persons?organizationId=${value}&associated=1`
                            getOrgPersons(customUrl).then(res=>{
                                if(res.success){
                                    const { BasicFields } = this.state
                                    BasicFields[6].data = res.data
                                    this.setState({ BasicFields })
                                }
                            })
                        }else{
                            const { BasicFields } = this.state
                            BasicFields[6].data = []
                            const { basic } = this.formRef.current.getFieldsValue();
                            basic.contactPersonId = undefined
                            this.formRef.current.setFieldsValue({ basic: basic, });
                            this.setState({ BasicFields })
                        }
                    }
                },
                {
                    Placeholder: "Delegate Contact Person",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    Placeholder: "Name",
                    rangeMin: true,
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    object: "basic",
                    fieldCol: 12,
                    key: "contactPersonId",
                    size: "small",
                    // rules:[{ required: true }],
                    data: [],
                    type: "Select",
                },
                {
                    object: "basic",
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
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    Placeholder: "State",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    object: "basic",
                    fieldCol: 12,
                    key: "type",
                    size: "small",
                    rules:[{ required: true, message: 'Type is Required' }],
                    data: [{label: 'Milestone', value: 1},
                        {label: 'Time & Materials', value: 2}],
                    type: "Select",
                },
                {
                    object: "basic",
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
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    Placeholder: "Stage",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    object: "basic",
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
                    type: "Select",
                },       
                {
                    object: "basic",
                    fieldCol: 12,
                    key: "stage",
                    size: "small",
                    data: [
                        { label: "Lead", value: 'L' },
                        { label: "Tender Released", value: 'TR' },
                        { label: "Bid Development", value: 'BD' },
                        { label: "Bid Submitted", value: 'BS' },
                    ],
                    // rules: [
                    //     {
                    //         required: true,
                    //         message: "Gender is Obviously required",
                    //     },
                    // ],
                    itemStyle: { marginBottom: 1 },
                    type: "Select",
                },       
                {
                    Placeholder: "Linked Project",
                    fieldCol: 24,
                    size: "small",
                    type: "Text",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    object: "basic",
                    fieldCol: 12,
                    key: "linkedWorkId",
                    // label: "Qualified Ops",
                    size: "small",
                    data: [ ],
                    // rules: [
                    //     {
                    //         required: true,
                    //         message: "Gender is Obviously required",
                    //     },
                    // ],
                    itemStyle: { marginBottom: 1 },
                    type: "Select",
                },            
            ],

            tenderFields: [
                {
                    Placeholder: "Tender Title",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    Placeholder: "Tender Number",
                    size: "small",
                    fieldCol: 12,
                    type: "Text",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    object: "tender",
                    fieldCol: 12,
                    key: "tender",
                    size: "small",
                    // rules:[{ required: true }],
                    type: "Input",
                },
                {
                    object: "tender",
                    fieldCol: 12,
                    key: "tenderNumber",
                    size: "small",
                    // rules:[{ required: true }],
                    type: "Input",
                },
                
            ],

            BillingFields: [
                {
                    Placeholder: "Estimated Value",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    Placeholder: "Contribution Margin as a %",
                    size: "small",
                    fieldCol: 12,
                    type: "Text",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    object: "billing",
                    fieldCol: 12,
                    key: "value",
                    size: "small",
                    shape: "$",
                    // rules:[{ required: true }],
                    type: "InputNumber",
                    onChange: (value)=> {
                        const {billing} = this.formRef.current.getFieldsValue();
                        billing.cm$ =  billing.cmPercentage? (value * billing.cmPercentage) /100 : 0
                        billing.discount =  billing.goget? (value * billing.goget) /100 : 0
                        billing.upside =  billing.discount? (value - billing.discount) : 0
                        this.formRef.current.setFieldsValue({ billing: billing, });
            
                    },
                    fieldStyle: { width: "100%" },
                },
                {
                    object: "billing",
                    fieldCol: 12,
                    key: "cmPercentage",
                    size: "small",
                    shape: '%',
                    // rules:[{ required: true }],
                    type: "InputNumber",
                    rangeMin: 0,
                    rangeMax: 100,
                    fieldStyle: { width: "100%" },
                    onChange: (value)=> {
                        const {billing} = this.formRef.current.getFieldsValue();
                        billing.cm$ =  billing.value? (billing.value * value) /100 : 0
                        this.formRef.current.setFieldsValue({ billing: billing, });
                    }
                },
                
                {
                    Placeholder: "Contribution Margin",
                    size: "small",
                    fieldCol: 12,
                    type: "Text",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    fieldCol: 12,
                    Placeholder: "Go:",
                    type: "Text",
                    size: "small",
                    tooltip: true,
                    tooltipTitle: "Likelihood Of Opportunity Going Live",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    object: "billing",
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
                    object: "billing",
                    fieldCol: 12,
                    key: "goPercentage",
                    size: "small",
                    shape: '%',
                    // rules:[{ required: true }],
                    type: "InputNumber",
                    fieldStyle: { width: "100%" },
                    rangeMin: 0,
                    rangeMax: 100,
                    onChange: (value)=> {
                        const { billing } = this.formRef.current.getFieldsValue();
                        billing.goget =  billing.getPercentage? (billing.getPercentage * value) /100 : 0
                        billing.discount =  (billing.goget && billing.value)? (billing.value * billing.goget) /100 : 0
                        billing.upside =  billing.discount? (billing.value - billing.discount) : 0
                        this.formRef.current.setFieldsValue({ billing: billing, });
                    }
                },
                {
                    fieldCol: 12,
                    Placeholder: "Get: ",
                    size: "small",
                    type: "Text",
                    tooltip: true,
                    tooltipTitle: "Likelihood Of Winning Opportunity",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    Placeholder: "GO/Get",
                    size: "small",
                    fieldCol: 12,
                    type: "Text",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    object: "billing",
                    fieldCol: 12,
                    key: "getPercentage",
                    size: "small",
                    shape: '%',
                    // rules:[{ required: true }],
                    type: "InputNumber",
                    rangeMin: 0,
                    rangeMax: 100,
                    fieldStyle: { width: "100%" },
                    onChange: (value)=> {
                        const { billing } = this.formRef.current.getFieldsValue();
                        billing.goget =  billing.goPercentage? (billing.goPercentage * value) /100 : 0
                        billing.discount =  (billing.goget && billing.value)? (billing.value * billing.goget) /100 : 0
                        billing.upside =  billing.discount? (billing.value - billing.discount) : 0
                        this.formRef.current.setFieldsValue({ billing: billing, });
                    }
                },
                {
                    object: "billing",
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
                    Placeholder: "Discounted Value (Forecast Amount)",
                    size: "small",
                    fieldCol: 12,
                    type: "Text",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    Placeholder: "Upside Value",
                    size: "small",
                    fieldCol: 12,
                    type: "Text",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    object: "billing",
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
                    object: "billing",
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

            DatesFields: [
                {
                    Placeholder: "Expected Project Start Date",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    Placeholder: "Expected Project End Date",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    object: "dates",
                    fieldCol: 12,
                    key: "startDate",
                    size: "small",
                    type: "DatePicker",
                    fieldStyle: { width: "100%" },
                    rangeMin: (current)=>{
                        const { dates } = this.formRef.current.getFieldValue();
                        return  dates.endDate  && current > dates.endDate 
                    }
                    // rules: [
                    //     {
                    //         required: true,
                    //         message: "Start Date is required",
                    //     },
                    // ],
                },
                {
                    object: "dates",
                    fieldCol: 12,
                    key: "endDate",
                    size: "small",
                    type: "DatePicker",
                    fieldStyle: { width: "100%" },
                    rangeMax: (current)=>{
                        const { dates } = this.formRef.current.getFieldValue();
                        return  dates.startDate && current < dates.startDate
                    }
                    // rules: [
                    //     {
                    //         required: true,
                    //         message: "Start Date is required",
                    //     },
                    // ],
                },
            
                {
                    Placeholder: "Work Hours Per Day",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    Placeholder: "Bid Due Date",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    // itemStyle:{marginBottom:'10px'},
                },
                
                {
                    object: "dates",
                    fieldCol: 12,
                    key: "hoursPerDay",
                    size: "small",
                    rangeMin: 0,
                    rangeMax: 24,
                    // rules:[{ required: true }],
                    type: "InputNumber",
                    fieldStyle: { width: "100%" },
                },
                {
                    object: "dates",
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
                    // itemStyle:{marginBottom:'10px'},
                },
                
                {
                    object: "dates",
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

            ManageFields: [
                {
                    Placeholder: "Account Director",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                },
                {
                    Placeholder: "Account Manager",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                },
                {
                    object: "manage",
                    fieldCol: 12,
                    key: "accountDirectorId",
                    size: "small",
                    data: [],
                    type: "Select",
                },
                {
                    object: "manage",
                    fieldCol: 12,
                    key: "accountManagerId",
                    size: "small",
                    data: [],
                    type: "Select",
                },
                {
                    Placeholder: "Opportunity Manager",
                    fieldCol: 24,
                    size: "small",
                    type: "Text",
                },
                {
                    object: "manage",
                    fieldCol: 12,
                    key: "opportunityManagerId",
                    size: "small",
                    data: [],
                    type: "Select",
                },
            ]
        };
    }
    componentDidMount = () =>{
        this.fetchAll()
    }

    fetchAll = () =>{
        const { editLead, project }= this.props;  
        const { ManageFields, DatesFields, BasicFields } = this.state;
        // const dates = {entryDate: moment(new Date())}
        // this.formRef.current.setFieldsValue({ dates: dates, }); 
        // to set the Default entryDate for new Oppurtunity  

        // For now doing it for quick insertion
        if (project){ // will have to open Project Add Modal when optimizing the code
            ManageFields[4].Placeholder = "Project Manager"
            ManageFields[5].key = "projectManagerId"
            // making some fields required when lead is won
                DatesFields[0]['rangeMin'] = true            
                DatesFields[2]['rules'] = [{ required: true, message: "Start Date is Required" }]       
                DatesFields[1]['rangeMin'] = true            
                DatesFields[3]['rules'] = [{ required: true, message: "End Date is Required" }]     
                DatesFields[4]['rangeMin'] = true            
                DatesFields[6]['rules'] = [{ required: true, message: "Dailty Hours is Required" }]  
                //Disable Leave type on edit          
            // this.setState ({ManageFields})
        }
        if(editLead){
            BasicFields[10]['disabled'] = true  
        }

        // either call this or call that
        const customUrl = `helpers/contact-persons?active=1&employee=1&associated=1&label=1`
        Promise.all([ getPanels(), getOrganizations(), getStates(), getOrgPersons(customUrl), editLead && this.getRecord(editLead), getProjects()])
        .then(res => {
            const { BasicFields, ManageFields } = this.state;
            if (res[1].success) {res[1].data[0].disabled = true}
            BasicFields[2].data = res[0].success? res[0].data : [];
            BasicFields[3].data = res[1].success? res[1].data : [];
            BasicFields[11].data = res[2].success? res[2].data : [];
            BasicFields[6].data = res[4].success? res[4].data : [];
            BasicFields[17].data = res[5].success? res[5].data : [];
    
            ManageFields[2].data = res[3].success ? res[3].data: [];
            ManageFields[3].data = res[3].success ? res[3].data: [];
            ManageFields[5].data = res[3].success ? res[3].data: [];
            // ManageFields[7].data = res[4].success ? res[4].data: [];
            
            this.setState({ BasicFields, ManageFields, DatesFields })
        })
        .catch(e => {
            console.log(e);
        })
    }

    onFinish = (vake) => { 
        // this will work after  got  Object from the skill from
        this.setState({ loading: true })
        const { basic, tender, dates, billing, manage } = vake
        const { editLead } = this.props
        const form_value = {
            panelId: basic.panelId ?? null,
            organizationId: basic.organizationId ?? null,
            contactPersonId: basic.contactPersonId ?? null,
            title: basic.title ?? '',
            type: basic.type ?? '',
            stateId: basic.stateId ?? null,
            qualifiedOps: basic.qualifiedOps ?? false,
            stage: basic.stage?? null,
            linkedWorkId: basic.linkedWorkId?? null,

            tender: tender.tender ?? '',
            tenderNumber: tender.tenderNumber ?? '',

            value: billing.value ?? 0,
            cmPercentage: billing.cmPercentage ?? 0,
            goPercentage: billing.goPercentage ?? 0,
            getPercentage: billing.getPercentage ?? 0,

            accountDirectorId: manage.accountDirectorId ?? null,
            accountManagerId: manage.accountManagerId ?? null,
            opportunityManagerId: manage.opportunityManagerId ?? null,
            projectManagerId: manage.projectManagerId ?? null,

            ...dates
        }

        if (!editLead) {
                
            this.addOpportunity(form_value); //add skill
        } else {
            
            this.editProject(form_value); //edit skill
        }
    };

    addOpportunity = (values) => {
        const { callBack } = this.props;
        addList(values).then((res) => {
            if(res.success){
                callBack()
            }else{
                this.setState({ loading: false })
            }
        });
    };

    editProject = (values) =>{
        const { project } = this.props
        if (project){
            this.workWon(values)
        }else{
            this.editRecord(values)
        }
    }

    getRecord = (id) => {
        return getRecord(id).then((res) => {
            if (res.success){
                const { basic, tender, billing, dates, manage } = res
                this.formRef.current.setFieldsValue({ basic: basic, tender: tender, billing: billing, dates: dates, manage: manage });

                const customUrl = `helpers/contact-persons?organizationId=${basic.organizationId}&associated=1` 
                return getOrgPersons(customUrl).then(resp=>{
                    return {success: resp.success, data: resp.data}
                })
            }
        })

    };

    editRecord = (values) => {
        const { editLead, callBack } = this.props;
        values.id = editLead
        editList(values).then((res) => {
            if(res.success){
                callBack()
            }else{
                this.setState({ loading: false })
            }
        });
    };

    workWon = (values) =>{
        const { editLead, callBack } = this.props;
        console.log('workWon');
        workWon(editLead, values).then((res) => {
            if(res.success){
                callBack()
            }else{
                this.setState({ loading: false })
            }
        });
    }

    render() {
        const { editLead, visible, close } = this.props;
        const { BasicFields, tenderFields, DatesFields, BillingFields, ManageFields, loading } = this.state
        return (
            <Modal
                title={editLead? "Edit opportunity" : "Add opportunity"}
                maskClosable={false}
                centered
                visible={visible}
                okButtonProps={{ disabled: loading, htmlType: 'submit', form: 'my-form' }}
                okText={loading ?<LoadingOutlined /> :"Save"}
                onCancel={close}
                width={750}
            >
                <Form
                    id={'my-form'}
                    ref={this.formRef}
                    onFinish={this.onFinish}
                    scrollToFirstError={true}
                    size="small"
                    layout="inline"
                    initialValues={ { dates:{ entryDate: moment(new Date()) } } }
                >
                    <Tabs type="card" >
                        <TabPane tab="Opportunity Info" key="basic" forceRender className="ant-form ant-form-inline ant-form-small" >
                            <FormItems FormFields={BasicFields} />
                        </TabPane>
                        <TabPane tab="Tender Info" key="tender" forceRender className="ant-form ant-form-inline ant-form-small" >
                            <FormItems FormFields={tenderFields} />
                        </TabPane>
                        <TabPane tab="Key Dates" key="dates" forceRender className="ant-form ant-form-inline ant-form-small" >
                            <FormItems FormFields={DatesFields} />
                        </TabPane>
                        <TabPane tab="Forecast" key="billing" forceRender className="ant-form ant-form-inline ant-form-small" >
                            <FormItems FormFields={BillingFields} />
                        </TabPane>                    
                        <TabPane tab="Manage" key="manage" forceRender className="ant-form ant-form-inline ant-form-small" >
                            <FormItems FormFields={ManageFields} />
                        </TabPane>                    
                    </Tabs>
                </Form>
            </Modal>
        );
    }
}

export default InfoModal;
