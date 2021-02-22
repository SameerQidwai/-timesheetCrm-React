import React, { Component } from "react";
import { Modal, Tabs } from "antd";
import { CloseOutlined, PlusSquareOutlined } from "@ant-design/icons"; //Icons
import moment from "moment";
import Form from "../../components/Core/Form";

import { addResource, getResource, editResource } from "../../service/opportunities";
import { getPanelSkills, getStandardLevels, getContactPersons  } from "../../service/constant-Apis";


const { TabPane } = Tabs;

class InfoModal extends Component {
    constructor() {
        super();
        this.resourceRef = React.createRef();
        this.state = {
            editRex: false,
            resourceSubmitted: false,
            check: false,

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
                            const { ResourceFields } = this.state
                            ResourceFields.fields[3].data = value? value.levels: []
                            const  { obj } = this.resourceRef.current.refs.resource_form.getFieldsValue() // const
                            obj['panelSkillStandardLevelId'] = undefined
                            obj['userId'] = undefined;
                            this.resourceRef.current.refs.resource_form.setFieldsValue({ obj, })
                            this.setState({ResourceFields})
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
                            const { ResourceFields } = this.state
                            getContactPersons().then(res=>{
                                ResourceFields.fields[6].data = res.success? res.data: []
                                const { obj } = this.resourceRef.current.refs.resource_form.getFieldsValue() // const
                                console.log(obj);
                                obj['userId'] = undefined;
                                this.resourceRef.current.refs.resource_form.setFieldsValue({ obj, })
                                this.setState({ResourceFields})
                            })
                            
                        }.bind(this),
                    },


                    {
                        Placeholder: "Employee",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Bill Hours",
                        fieldCol:12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: 'userId',
                        size: "small",
                        // rules:[{ required: true }],
                        data: [],
                        type: "Select",
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

                    {
                        Placeholder: "Buy Cost",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Sale Cost",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
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
        };
    }
    componentDidMount = () =>{
        const { editRex, panelId } = this.props
        console.log({editRex}, {panelId});
        this.openModal()
    }

    openModal = () =>{
        const { editRex, panelId } = this.props
        getPanelSkills(panelId).then(res=>{
            const {  ResourceFields } = this.state;
            ResourceFields.fields[2].data = res.success? res.data : [];
            this.setState({
                ResourceFields,
            },()=>{
                if (editRex){
                    this.getRecord(res.data)
                }
            })
        })
    }
    
    submit = () => {
        //submit button click
        this.resourceRef.current && this.resourceRef.current.refs.resource_form.submit();
    };

    ResourceCall = (vake) => {
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
        const { ProId, callBack } = this.props
        console.log(ProId);
        addResource(ProId, data).then(res=>{
            if(res.success){
                callBack()
            }
        })
    }
    
    
    getRecord = (skills) => {
        const { ProId, editRex } = this.props;
        console.log(ProId, editRex);
        getResource(ProId, editRex).then((resR) => {
            console.log(resR.data);
            if (resR.success){
                const skillIndex = skills.findIndex(skill =>skill.value === resR.data.panelSkillId)
                getContactPersons().then(resP=>{
                    const { ResourceFields } = this.state
                    ResourceFields.fields[3].data = skills[skillIndex] ? skills[skillIndex].levels : []
                    ResourceFields.fields[6].data = resP.success? resP.data: []
                    this.resourceRef.current.refs.resource_form.setFieldsValue({ obj: resR.data })
                    this.setState({ResourceFields})
                })
            }
        })

    };

    editRecord = (data) => {
        const { editRex, ProId, callBack } = this.props;
        data.id = editRex
        editResource(editRex, ProId, data).then((res) => {
            if(res.success){
                callBack()
            }
        });
    };
    
    render() {
        const { editRex, visible, close } = this.props;
        const { ResourceFields } = this.state
        return (
            <Modal
                title={editRex? "Edit opportunity" : "Add Resource"}
                centered
                visible={visible}
                onOk={() => { this.submit(); }}
                okText={"Save"}
                onCancel={close}
                width={700}
            >
                <Form
                    ref={this.resourceRef}
                    Callback={this.ResourceCall}
                    FormFields={ResourceFields}
                />
            </Modal>
        );
    }
}

export default InfoModal;
