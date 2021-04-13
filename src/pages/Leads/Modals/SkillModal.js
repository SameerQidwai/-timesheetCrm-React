import React, { Component } from "react";
import { Modal, Tabs } from "antd";
import { LoadingOutlined } from "@ant-design/icons"; //Icons
import moment from "moment";
import Form from "../../../components/Core/Form";

import { addLeadSkill, editLeadSkill } from "../../../service/opportunities";
import { getPanelSkills } from "../../../service/constant-Apis";

const { TabPane } = Tabs;

class SkillModal extends Component {
    constructor() {
        super();
        this.skillRef = React.createRef();
        this.state = {
            editRex: false,
            skillSubmitted: false,
            check: false,
            loading: false,

            SKILLS: [],
            STATES: [],
            ORGS: [],

            SkillFields: {
                formId: "skill_form",
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
                            const  { obj } = this.skillRef.current.refs.skill_form.getFieldsValue() // const
                            obj['panelSkillStandardLevelId'] = undefined
                            this.skillRef.current.refs.skill_form.setFieldsValue({ obj, })
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
        const { editRex, panelId } = this.props
        this.skillModal()
        // fill select field options and fill fields in case of edit the skill record
    }

    skillModal = () =>{
        const { editRex, panelId, leadId } = this.props
        getPanelSkills(panelId).then(res => {
            const {  SkillFields } = this.state;
            SkillFields.fields[2].data = res.success? res.data : [];

            if(editRex){ // repopulate the fields to edit them to resolve multiple api calling might be do this on every Modal Compenent
                const skillIndex = SkillFields.fields[2].data.findIndex(skill =>skill.value === editRex.panelSkillId)
                SkillFields.fields[3].data = SkillFields.fields[2].data ? SkillFields.fields[2].data[skillIndex].levels : []
                const obj = {
                    panelSkillId: editRex.panelSkillId,
                    panelSkillStandardLevelId: editRex.panelSkillStandardLevelId,
                    billableHours: editRex.billableHours
                }
                this.skillRef.current.refs.skill_form.setFieldsValue({ obj, })
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
        this.skillRef.current && this.skillRef.current.refs.skill_form.submit();
    };

    SkillCall = (vake) => {
        // this will work after I get the Object from the form
        const { editRex } = this.props
        if (editRex){
            console.log('edit');
            this.editRecord(vake.obj)

        }else{
            console.log('add');
            this.addRecord(vake.obj)
        }
    };

    addRecord = (data) =>{
        const { leadId, callBack } = this.props
        console.log(leadId);
        addLeadSkill(leadId, data).then(res=>{
            if(res.success){
                callBack()
            }
        })
    }

    editRecord = (data) => {
        const { editRex, leadId, callBack } = this.props;
        data.id = editRex
        editLeadSkill(leadId, editRex, data).then((res) => {
            if(res.success){
                callBack()
            }
        });
    };
    
    render() {
        const { editRex, visible, close } = this.props;
        const { SkillFields, loading } = this.state
        return (
            <Modal
                title={editRex? "Edit Skill" : "Add Skill"}
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
                    ref={this.skillRef}
                    Callback={this.SkillCall}
                    FormFields={ SkillFields }
                />
            </Modal>
        );
    }
}

export default SkillModal ;
