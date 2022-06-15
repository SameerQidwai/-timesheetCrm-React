import React, { Component } from "react";
import { Modal, Form } from "antd";
import { LoadingOutlined } from "@ant-design/icons"; //Icons

import FormItems from "../../../components/Core/Forms/FormItems";

import { addList, editList, getRecord } from "../../../service/employee-leases";
import { formatDate } from "../../../service/constant";

class LeaseModal extends Component {
    constructor() {
        super();
        this.leaseRef = React.createRef();

        this.state = {
            leaseSubmitted: false,
            loading: false,
            LeaseFields: [
                {
                    Placeholder: "Leasing Company Name",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    Placeholder: "Lease Start Date",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    object: "obj", //this is field 3
                    fieldCol: 12,
                    key: "companyName",
                    size: "small",
                    
                    // rules:[{ required: true }],
                    type: "Input",
                    labelAlign: "left",
                    itemStyle: { marginBottom: 10 },
                },
                {
                    object: "obj",
                    fieldCol: 12,
                    key: "startDate",
                    size: "small",
                    // rules:[{ required: true }],
                    type: "DatePicker",
                    fieldStyle: { width: "100%" },
                    itemStyle: { marginBottom: 10 },
                    rangeMin: (current)=>{
                    const { obj } = this.leaseRef.current.refs.lease_form.getFieldValue();
                    return  obj.endDate && current > obj.endDate
                }
                },
                {
                    Placeholder: "Lease End Date",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    Placeholder: "Vehicle Registration Number",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    object: "obj",
                    fieldCol: 12,
                    key: "endDate",
                    size: "small",
                    // rules:[{ required: true }],
                    type: "DatePicker",
                    fieldStyle: { width: "100%" },
                    itemStyle: { marginBottom: 10 },
                    rangeMax: (current)=>{
                    const { obj } = this.leaseRef.current.refs.lease_form.getFieldValue();
                    return  obj.startDate && current < obj.startDate
                }
                },
                {
                    object: "obj", //this is field 3
                    fieldCol: 12,
                    key: "vehicleRegistrationNo",
                    size: "small",
                    
                    // rules:[{ required: true }],
                    type: "Input",
                    labelAlign: "left",
                    itemStyle: { marginBottom: 10 },
                },
                {
                    Placeholder: "Vehicle Make And Model",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    Placeholder: "Financer Name",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    // itemStyle:{marginBottom:'10px'},
                },
                
                {
                    object: "obj", //this is field 3
                    fieldCol: 12,
                    key: "vehicleMakeModel",
                    size: "small",
                    
                    // rules:[{ required: true }],
                    type: "Input",
                    labelAlign: "left",
                    itemStyle: { marginBottom: 10 },
                },
                {
                    object: "obj", //this is field 3
                    fieldCol: 12,
                    key: "financerName",
                    size: "small",
                    
                    // rules:[{ required: true }],
                    type: "Input",
                    labelAlign: "left",
                    itemStyle: { marginBottom: 10 },
                },
                {
                    Placeholder: "Amount Financed",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    Placeholder: "Installment Frequency",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    object: "obj", //this is field 3
                    fieldCol: 12,
                    key: "financedAmount",
                    size: "small",
                    
                    // rules:[{ required: true }],
                    type: "InputNumber",
                    labelAlign: "left",
                    fieldStyle: {width: '100%'},
                    itemStyle: { marginBottom: 10 },
                },
                {
                    object: "obj",
                    fieldCol: 12,
                    key: "installmentFrequency",
                    size: "small",
                    data: [
                        { label: "Weekly", value: 3 },
                        { label: "Fortnightly", value: 4 },
                        { label: "Monthly", value: 5 },
                        { label: "Quarterly", value: 6 },
                    ],
                    type: "Select",
                    // rules: [
                    //     {
                    //         required: true,
                    //         message: "Payment Frequncy is required",
                    //     },
                    // ],
                    itemStyle: { marginBottom: 1 },
                },
                {
                    Placeholder: "Pre Tax Deduction",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    Placeholder: "Post Tax Deduction",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    object: "obj", //this is field 3
                    fieldCol: 12,
                    key: "preTaxDeductionAmount",
                    size: "small",
                    
                    // rules:[{ required: true }],
                    type: "InputNumber",
                    labelAlign: "left",
                    fieldStyle: {width: '100%'},
                    itemStyle: { marginBottom: 10 },
                    onChange: ()=> {
                        const { obj } =  this.leaseRef.current.refs.lease_form.getFieldsValue();
                        obj.totalDeduction = (obj.preTaxDeductionAmount ? obj.preTaxDeductionAmount : 0) + (obj.postTaxDeductionAmount ? obj.postTaxDeductionAmount : 0)
                        this.leaseRef.current.refs.lease_form.setFieldsValue({ obj: obj, });                            
                    }
                },
                {
                    object: "obj", //this is field 3
                    fieldCol: 12,
                    key: "postTaxDeductionAmount",
                    size: "small",
                    
                    // rules:[{ required: true }],
                    type: "InputNumber",
                    labelAlign: "left",
                    fieldStyle: {width: '100%'},
                    itemStyle: { marginBottom: 10 },
                    onChange: ()=> {
                        const { obj } =  this.leaseRef.current.refs.lease_form.getFieldsValue();
                        obj.totalDeduction = (obj.preTaxDeductionAmount ? obj.preTaxDeductionAmount : 0) + (obj.postTaxDeductionAmount ? obj.postTaxDeductionAmount : 0)
                        this.leaseRef.current.refs.lease_form.setFieldsValue({ obj: obj, });
                    }
                },
                {
                    Placeholder: "Total Deduction",
                    fieldCol: 24,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    object: "obj", //this is field 3
                    fieldCol: 12,
                    key: "totalDeduction",
                    size: "small",
                    
                    // rules:[{ required: true }],
                    type: "InputNumber",
                    labelAlign: "left",
                    fieldStyle: {width: '100%'},
                    itemStyle: { marginBottom: 10 },
                },
            ],
        };
    }

    componentDidMount = () => {
        const { editLease, empId } = this.props
        if (editLease) {
            this.getRecord(empId, editLease);
        }
    };


    onFinish = (vake) => {
        // this will work after  getting the Object from level form
        const {editLease, empId} = this.props
        let { obj } = vake;
        obj.employeeId = empId;
        obj = {
            ...obj,
            employeeId: empId,
            startDate: formatDate(obj.startDate, true),
            endDate: formatDate(obj.endDate, true)
        }
        if (!editLease) {
            console.log("emes");
            this.addContract(obj); //add skill
        } else {
            console.log("edit");
            this.editRecord(obj); //edit skill
        }
    };

    addContract = (data) => {
        this.setState({loading: true})
        const { callBack, empId } = this.props;
        addList(empId, data).then(res=>{
            console.log(res);
            if(res.success){
                callBack();
            }
        });
    };

    getRecord = (empId, id) => {
        getRecord(empId, id).then(res=>{
            const {success, data} = res
            if (success){
                this.leaseRef.current.refs.lease_form.setFieldsValue({ obj: data, });
            }
        })        
    };

    editRecord = (data) => {
        this.setState({loading: true})
        const { editLease, callBack, empId } = this.props;
        editList(empId, editLease, data).then((res) => {
            if(res.success){
                callBack()
            }
        });
    };

    render() {
        const { editLease, visible, close } = this.props;
        const { LeaseFields, loading } = this.state;

        return (
            <Modal
                title={editLease ? "Edit Novated Lease" : "Add Novated Lease"}
                maskClosable={false}
                centered
                visible={visible}
                okButtonProps={{ disabled: loading, htmlType: 'submit', form: 'my-form'  }}
                okText={loading ? <LoadingOutlined /> : "Save"}
                onCancel={close}
                width={900}
            >
                <Form
                    id={'my-form'}
                    ref={this.formRef}
                    onFinish={this.onFinish}
                    scrollToFirstError={true}
                    size="small"
                    layout="inline"
                    >
                        <FormItems FormFields={LeaseFields} />
                    </Form>
            </Modal>
        );
    }
}

export default LeaseModal;
