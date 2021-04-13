import React, { Component } from "react";
import { Modal, Tabs } from "antd";
import { LoadingOutlined } from "@ant-design/icons"; //Icons
import moment from "moment";
import Form from "../../../components/Core/Form";

import { addLeadSkill, getLeadSkill, editLeadSkill, addLeadSkillResource, editLeadSkillResource } from "../../../service/opportunities";
import { getPanelSkills, getStandardLevels, getEmployees, getSubContractors  } from "../../../service/constant-Apis";


const { TabPane } = Tabs;

class InfoModal extends Component {
    constructor() {
        super();
        this.resourceRef = React.createRef();
        this.state = {
            editRex: false,
            resourceSubmitted: false,
            check: false,
            loading: false,

            SKILLS: [],
            STATES: [],
            ORGS: [],

            ResourceFields: {
                formId: "resource_form",
                FormCol: 24,
                FieldSpace: 24,
                justifyField: "center",
                FormLayout: "inline",
                size: "middle",
                fields: [
                    {
                        Placeholder: "Resource",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Buy Cost",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: 'contactPersonId',
                        size: "small",
                        // rules:[{ required: true }],
                        data: [],
                        type: "Select",
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: 'buyingRate',
                        size: "small",
                        // rules:[{ required: true }],
                        type: "InputNumber",
                        fieldStyle: { width: "100%" },
                    },                   
                    {
                        Placeholder: "Sale Cost",
                        fieldCol: 24,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: 'sellingRate',
                        size: "small",
                        // rules:[{ required: true }],
                        type: "InputNumber",
                        fieldStyle: { width: "100%" },
                    },
                ],
            },

            SkillFields: {
                formId: "resource_form",
                FormCol: 24,
                FieldSpace: 24,
                justifyField: "center",
                FormLayout: "inline",
                size: "middle",
                fields: [
                    {
                        Placeholder: "Skill",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Level",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: 'panelSkillId',
                        size: "small",
                        // rules:[{ required: true }],
                        data: [],
                        type: "Select",
                        onChange: function func(e, value) {
                            const { SkillFields } = this.state
                            SkillFields.fields[3].data = value? value.levels: []
                            const  { obj } = this.resourceRef.current.refs.resource_form.getFieldsValue() // const
                            obj['panelSkillStandardLevelId'] = undefined
                            this.resourceRef.current.refs.resource_form.setFieldsValue({ obj, })
                            this.setState({SkillFields})
                        }.bind(this),
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: 'panelSkillStandardLevelId',
                        size: "small",
                        // rules:[{ required: true }],
                        data: [],
                        type: "Select",
                        onChange: function func(e, value) {
                            this.fetchRes()
                            
                        }.bind(this),
                    },
                    {
                        Placeholder: "Work Hours",
                        fieldCol:24,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: 'billableHours',
                        size: "small",
                        // rules:[{ required: true }],
                        type: "InputNumber",
                        fieldStyle: { width: "100%" },
                    },

                ],
            },
        };
    }
    componentDidMount = () =>{
        const { skillId } = this.props
        if (skillId){
            this.fetchRes()
        }else{
            this.skillModal()
        }
    }

    fetchRes = () =>{
        Promise.all([ getEmployees(),  getSubContractors()])
        .then(res => {
            console.log(res[0]);
            const data = res[0].success ? res[0].data.concat(res[1].success ? res[1].data: []): res[1].success ? res[1].data: []
            const { ResourceFields } = this.state
            const { editRex } = this.props
            if(editRex){
                const obj = {
                    contactPersonId: editRex.contactPersonId,
                    billableHours: editRex.billableHours,
                    buyingRate: editRex.buyingRate,
                    sellingRate: editRex.sellingRate,
                }
                this.resourceRef.current.refs.resource_form.setFieldsValue({ obj, })
            }
            ResourceFields.fields[2].data = data
            this.setState({ResourceFields})

        })
        .catch(e => {
            console.log(e);
        })
    }

    skillModal = () =>{
        const { editRex, panelId, leadId } = this.props
        getPanelSkills(panelId).then(res => {
            const {  SkillFields } = this.state;
            SkillFields.fields[2].data = res.success? res.data : [];
            console.log(panelId, res.data);

            if(editRex){ // repopulate the fields to edit them to resolve multiple api calling might be do this on every Modal Compenent
                const skillIndex = SkillFields.fields[2].data.findIndex(skill =>skill.value === editRex.panelSkillId)
                SkillFields.fields[3].data = SkillFields.fields[2].data ? SkillFields.fields[2].data[skillIndex].levels : []
                const obj = {
                    panelSkillId: editRex.panelSkillId,
                    panelSkillStandardLevelId: editRex.panelSkillStandardLevelId,
                    billableHours: editRex.billableHours
                }
                this.resourceRef.current.refs.resource_form.setFieldsValue({ obj, })
            }

            this.setState({SkillFields})
        })
        .catch(e => {
            console.log(e);
        })
    }
    
    submit = () => {
        //submit button click
        this.setState({loading: true})
        this.resourceRef.current && this.resourceRef.current.refs.resource_form.submit();
    };

    ResourceCall = (vake) => {
        // this will work after I get the Object from the form
        const { editRex,skillId } = this.props
        if (editRex){
            console.log('edit');
            if(skillId){
                this.editResource(vake.obj)
            }else{
                this.editSkill(vake.obj)
            }

        }else{
            if (skillId){
                this.addResourse(vake.obj)
            }else{
                this.addSkill(vake.obj)
            }
        }
    };

    addSkill = (data) =>{
        const { leadId, callBack } = this.props
        console.log(leadId);
        addLeadSkill(leadId, data).then(res=>{
            if(res.success){
                console.log(res.data);
                callBack(res.data)
            }
        })
    }

    addResourse = ( data) =>{
        const {callBack, leadId, skillId } = this.props
        addLeadSkillResource(leadId, skillId, data).then(res=>{
            if(res.success){
                callBack(res.data)
            }
        })
    }

    editSkill = (data) => {
        const { editRex, leadId, callBack } = this.props;
        data.id = editRex
        editLeadSkill(leadId, editRex, data).then((res) => {
            if(res.success){
                callBack(res.data)
            }
        });
    };

    editResource = (data) => {
        const { editRex, leadId, skillId, callBack } = this.props;
        data.id = editRex
        editLeadSkillResource(leadId, skillId , editRex.id, data).then((res) => {
            if(res.success){
                callBack(res.data)
            }
        });
    };
    
    render() {
        const { editRex, visible, close, resource, skillId } = this.props;
        const { ResourceFields, SkillFields, loading } = this.state
        return (
            <Modal
                title={editRex? "Edit opportunity" : "Add Resource"}
                maskClosable={false}
                centered
                visible={visible}
                onOk={() => { this.submit(); }}
                okButtonProps={{ disabled: loading }}
                okText={loading ?<LoadingOutlined /> :"Save"}
                onCancel={close}
                width={750}
            >
                <Form
                    ref={this.resourceRef}
                    Callback={this.ResourceCall}
                    FormFields={skillId? ResourceFields : SkillFields}
                />
            </Modal>
        );
    }
}

export default InfoModal;