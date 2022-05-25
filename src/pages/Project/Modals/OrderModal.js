import React, { Component } from "react";
import { Modal, Tabs } from "antd";
import { LoadingOutlined } from "@ant-design/icons"; //Icons
import moment from "moment";
import Form from "../../../components/Core/Forms/Form";

import { addOrder, getOrder, editOrder } from "../../../service/projects";
import { getPanelSkills, getStandardLevels  } from "../../../service/constant-Apis";


const { TabPane } = Tabs;

class OrderModal extends Component {
    constructor() {
        super();
        this.orderRef = React.createRef();
        this.state = {
            editRex: false,
            orderSubmitted: false,
            check: false,
            loading: false,
            SKILLS: [],
            STATES: [],
            ORGS: [],

            OrderFields: {
                formId: "order_form",
                FormCol: 24,
                FieldSpace: 24,
                justifyField: "center",
                FormLayout: "inline",
                size: "middle",
                fields: [
                    {
                        Placeholder: "Order Number",
                        fieldCol: 12,
                        size: "small",
                        rangeMin: true,
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Issue Date",
                        fieldCol: 12,
                        size: "small",
                        rangeMin: true,
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: 'orderNo',
                        size: "small",
                        rules:[{ required: true, message: 'Order Number is Required' }],
                        type: "Input",
                    }, 
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: 'issueDate',
                        size: "small",
                        rules:[{ required: true, message: 'Issue Date is Required' }],
                        type: "DatePicker",
                        fieldStyle: { width: "100%" },
                    }, 
                    {
                        Placeholder: "Expiry Date",
                        fieldCol: 12,
                        rangeMin: true,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Value",
                        fieldCol: 12,
                        size: "small",
                        rangeMin: true,
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: 'expiryDate',
                        size: "small",
                        rules:[{ required: true, message: 'Expiry Date is Required' }],
                        type: "DatePicker",
                        fieldStyle: { width: "100%" },
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: 'value',
                        size: "small",
                        rules:[{ required: true, message: 'Value is Required' }],
                        shape:"$",
                        type: "InputNumber",
                        fieldStyle: { width: "100%" },
                    }, 
                    {
                        Placeholder: "Expense",
                        fieldCol: 24,
                        size: "small",
                        rangeMin: true,
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: 'expense',
                        size: "small",
                        rules:[{ required: true, message: 'Expense is Required' }],
                        shape:"$",
                        type: "InputNumber",
                        fieldStyle: { width: "100%" },
                    },
                    {
                        Placeholder: "Description",
                        fieldCol: 24,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 24,
                        key: "description",
                        size: "small",
                        type: "Textarea",
                        itemStyle: { marginBottom: 1 },
                    },
                    {
                        Placeholder: "Comments",
                        fieldCol: 24,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 24,
                        key: "comment",
                        size: "small",
                        type: "Textarea",
                        itemStyle: { marginBottom: 1 },
                    },
                    
                ],
            },
        };
    }
    componentDidMount = () =>{
        const { editRex, panelId } = this.props
        console.log({...this.props});
        if (editRex){
            this.getRecord(editRex)
        }
    }
    
    submit = () => {
        //submit button click
        this.orderRef.current && this.orderRef.current.refs.order_form.submit();
    };

    OrderCall = (vake) => {
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
        this.setState({loading: true})
        const { ProId, callBack } = this.props
        console.log(ProId, data);
        addOrder(ProId, data).then(res=>{
            console.log(res);
            if(res.success){
                callBack()
            }
        })
    }
    
    
    getRecord = (skills) => {
        const { ProId, editRex } = this.props;
        console.log(ProId, editRex);
        getOrder(ProId, editRex).then((resR) => {
            console.log(resR);
            if (resR.success){
                this.orderRef.current.refs.order_form.setFieldsValue({ obj: resR.data })
                // this.setState({OrderFields})
            }
        })

    };

    editRecord = (data) => {
        this.setState({loading: true})
        const { editRex, ProId, callBack } = this.props;
        data.id = editRex
        editOrder(ProId, editRex, data).then((res) => {
            if(res.success){
                callBack()
            }
        });
    };
    
    render() {
        const { editRex, visible, close } = this.props;
        const { OrderFields, loading } = this.state
        return (
            <Modal
                title={editRex? "Edit Purchase Order" : "Add Purchase Order"}
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
                    ref={this.orderRef}
                    Callback={this.OrderCall}
                    FormFields={OrderFields}
                />
            </Modal>
        );
    }
}

export default OrderModal;
