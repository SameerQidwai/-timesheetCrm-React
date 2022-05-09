import React, { Component } from "react";
import { Modal, Tabs, Row, Col, Button, Input } from "antd";
import { LoadingOutlined } from "@ant-design/icons"; //Icons

import Form from "../../../components/Core/Forms/Form";

import moment from "moment";
import { addList, editList, getRecord } from "../../../service/employee-leases";

class LeaseModal extends Component {
    constructor() {
        super();
        this.leaseRef = React.createRef();

        this.state = {
            leaseSubmitted: false,
            loading: false,
            LeaseFields: {
                formId: "lease_form",
                FormCol: 24,
                FieldSpace: 24,
                justifyField: "center",
                FormLayout: "inline",
                layout: { labelCol: { span: 9 }, wrapperCol: { span: 0 } },
                size: "small",
                fields: [
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
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: "Date of Birth is required",
                        //     },
                        // ],
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
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: "Date of Birth is required",
                        //     },
                        // ],
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
            },
        };
    }

    componentDidMount = () => {
        const { editLease, empId } = this.props
        if (editLease) {
            this.getRecord(empId, editLease);
        }
    };

    submit = () => {
        this.leaseRef.current && this.leaseRef.current.refs.lease_form.submit();
    }

    LeaseCall = (vake) => {
        // this will work after  getting the Object from level form
        const {editLease, empId} = this.props
        const { obj } = vake;
        obj.employeeId = empId;
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
                // data.startDate = data.startDate && moment(data.startDate)
                // data.endDate = data.endDate && moment(data.endDate)
                this.leaseRef.current.refs.lease_form.setFieldsValue({ obj: data, });
                console.log(data);
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
                onOk={() => { this.submit(); }}
                okButtonProps={{ disabled: loading }}
                okText={loading ?<LoadingOutlined /> :"Save"}
                onCancel={close}
                width={900}
            >
                <Form
                    ref={this.leaseRef}
                    Callback={this.LeaseCall}
                    FormFields={LeaseFields}
                />
            </Modal>
        );
    }
}

export default LeaseModal;
