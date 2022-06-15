import React, { Component } from "react";
import { Modal, Tabs, Form } from "antd";
import { LoadingOutlined } from "@ant-design/icons"; //Icons
import FormItems from "../../../components/Core/Forms/FormItems";

import { workIsLost } from "../../../service/opportunities";
import { getOrganizations } from "../../../service/constant-Apis";

const { TabPane } = Tabs;

class LostModal extends Component {
    constructor() {
        super();
        this.formRef = React.createRef(); 

        this.state = {
            editLead: false,
            check: false,
            leadValue: 0,
            loading: false,
            Fields: [],

            Lost: [
                {
                    Placeholder: "Successful Tenderder",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    Placeholder: "Wining Price",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    object: "lost",
                    fieldCol: 12,
                    key: "wonById",
                    size: "small",
                    // mode: 'multiple',
                    data: [],
                    type: "Select",
                },
                {
                    object: "lost",
                    fieldCol: 12,
                    key: "winingPrice",
                    size: "small",
                    shape: '$',
                    // rules:[{ required: true }],
                    type: "InputNumber",
                    fieldStyle: { width: "100%" },
                },
                {
                    Placeholder: "Reason",
                    fieldCol: 24,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    object: "lost",
                    fieldCol: 12,
                    key: "reason",
                    size: "small",
                    mode: 'tags',
                    data: [
                        {label: 'Price', value: 'Price'},
                        {label: 'Resources', value: 'Resources'},
                        {label: 'Approach', value: 'Approach'},
                    ],
                    type: "Select",
                },
                {
                    Placeholder: "Customer Feedback",
                    fieldCol: 24,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    object: "lost",
                    fieldCol: 24,
                    key: "feedback",
                    size: "small",
                    mode:{ minRows: 2, maxRows:12},
                    // rules:[{ required: true }],
                    type: "Textarea",
                },
            ],

            NotBid: [
                {
                    Placeholder: "Reason",
                    fieldCol: 24,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    object: "lost",
                    fieldCol: 24,
                    key: "reason",
                    size: "small",
                    mode: 'tags',
                    data: [
                        {label: 'Insufficient ', value: 'Insufficient '},
                        {label: 'Resources', value: 'Resources'},
                        {label: 'Not Competitive', value: 'Not Competitive'},
                        {label: 'Not Financially viable', value: 'Not Financially viable'},
                        {label: 'Outside Scope of Services', value: 'Outside Scope of Services'},
                    ],
                    type: "Select",
                },
            ],

            NotProceed: [
                {
                    Placeholder: "Reason",
                    fieldCol: 24,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    object: "lost",
                    fieldCol: 24,
                    key: "reason",
                    size: "small",
                    mode:{ minRows: 5, maxRows:12},
                    // rules:[{ required: true }],
                    type: "Textarea",
                },
            ],

        };
    }
    componentDidMount = () =>{
        this.fetchAll()
    }
    setFields = () =>{
        const { api } = this.props.reason
        this.setState((pre)=>({
            Fields: pre[api]
        }))
        return true
    }

    fetchAll = (id) =>{
        Promise.all([getOrganizations(), this.setFields()])
        .then(res => {
            const { Fields } = this.state
            if(res[0].success){
                Fields[2].data = res[0].data
                this.setState({ Fields })
            }
        })
        .catch(e => {
            console.log(e);
        })
    }

    onFinish = (vake) => { 
        let { lost } = vake
        let { editLead, close } = this.props
        let { key } = this.props.reason
        lost.status = key
        workIsLost(editLead, lost).then(res=>{
            if(res.success){
                close()
            }
        })
    };

    workWon = (values) =>{
    }

    render() {
        const { visible, reason, close } = this.props;
        const { Fields, loading } = this.state
        return (
            <Modal
                title={reason.msg}
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
                >
                    <FormItems FormFields={Fields} />
                </Form>
            </Modal>
        );
    }
}

export default LostModal;
