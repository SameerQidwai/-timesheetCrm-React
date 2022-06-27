import React, { Component } from "react";
import { Modal, Tabs } from "antd";
import { LoadingOutlined } from "@ant-design/icons"; //Icons
import Form from "../../../components/Core/Forms/Form";

import { addLeadSkill, getLeadSkills, editLeadSkill } from "../../../service/opportunities";
import { getPanelSkills, getStandardLevels, getContactPersons  } from "../../../service/constant-Apis";
import { formatDate } from "../../../service/constant";


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
                        Placeholder: "Bill Hours",
                        fieldCol:12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },

                    {
                        Placeholder: "Buy Rate (Hourly)",
                        fieldCol: 12,
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
                        Placeholder: "Sell Rate (Hourly)",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
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
                        object: "obj",
                        fieldCol: 12,
                        key: 'sellingRate',
                        size: "small",
                        // rules:[{ required: true }],
                        type: "InputNumber",
                        fieldStyle: { width: "100%" },
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "s_date",
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
                        Placeholder: "End Date",
                        fieldCol: 24,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                   
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "e_date",
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
        let { obj } = vake
        obj = {
            ...obj,
            s_date: formatDate(obj.s_date, true),
            e_date: formatDate(obj.e_date, true)
        }
        if (editRex){
            this.editRecord(obj)

        }else{
            this.addRecord(obj)
        }
    };

    addRecord = (data) =>{
        this.setState({loading: true})
        const { proId, callBack } = this.props
        console.log(proId);
        addLeadSkill(proId, data).then(res=>{
            if(res.success){
                callBack()
            }
        })
    }
    
    
    getRecord = (skills) => {
        const { proId, editRex } = this.props;
        getLeadSkills(proId, editRex).then((resR) => {
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
        this.setState({loading: true})
        const { editRex, proId, callBack } = this.props;
        data.id = editRex
        editLeadSkill(editRex, proId, data).then((res) => {
            if(res.success){
                callBack()
            }
        });
    };
    
    render() {
        const { editRex, visible, close } = this.props;
        const { ResourceFields, loading } = this.state
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
                width={900}
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
