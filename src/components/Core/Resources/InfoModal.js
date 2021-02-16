import React, { Component } from "react";
import { Modal, Tabs } from "antd";
import { CloseOutlined, PlusSquareOutlined } from "@ant-design/icons"; //Icons
import moment from "moment";
import Form from "../Form";

// import { addList, getOrgRecord, editList } from "../../../service/Organizations";
import { getStandardLevels } from "../../../service/constant-Apis";

const { TabPane } = Tabs;

class InfoModal extends Component {
    constructor() {
        super();
        this.resourceRef = React.createRef();
        this.state = {
            editLead: false,
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
                        key: 'skillId',
                        size: "small",
                        // rules:[{ required: true }],
                        data: [],
                        type: "Select",
                        onChange: function func(e, value) {
                            const { ResourceFields } = this.state
                            ResourceFields.fields[3].data = value? value.levels: []
                            const { obj } = this.resourceRef.current.refs.resource_form.getFieldsValue() // const
                            delete obj['levelId'];
                            this.resourceRef.current.refs.resource_form.setFieldsValue({ obj, })
                            this.setState({ResourceFields})
                        }.bind(this),
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: 'levelId',
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
                        key: 'name',
                        size: "small",
                        // rules:[{ required: true }],
                        data: [],
                        type: "Select",
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: 'b_hour',
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
                        key: 'b_hour',
                        size: "small",
                        // rules:[{ required: true }],
                        type: "InputNumber",
                        fieldStyle: { width: "100%" },
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: 'b_hour',
                        size: "small",
                        // rules:[{ required: true }],
                        type: "InputNumber",
                        fieldStyle: { width: "100%" },
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
        const { editLead } = this.props
        console.log('sameer');
        this.fetchAll()
    }

    fetchAll = () =>{
        const { editLead }= this.props;                                             // either call this or call that
        Promise.all([ getStandardLevels()])
        .then(res => {
            console.log(res);
            const {  ResourceFields } = this.state;
                ResourceFields.fields[2].data = res[0].success? res[0].data : [];
            this.setState({
                ResourceFields,
            })
        })
        .catch(e => {
            console.log(e);
        })
    }

    submit = () => {
        //submit button click
        this.resourceRef.current && this.resourceRef.current.refs.dates_form.submit();
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
                if ( this.state.resourceSubmitted ) {
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

    getRecord = (id) => {
        // const { editLead } = this.props;
        // getOrgRecord(id).then((res) => {
        //     if (res.success){
            let resource ={}
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
        const { ResourceFields } = this.state
        return (
            <Modal
                title={editLead? "Edit opportunity" : "Add Resource"}
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
