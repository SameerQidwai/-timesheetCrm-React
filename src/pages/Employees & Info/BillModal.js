import React, { Component } from "react";
import { Modal, Tabs, Row, Col, Button, Input } from "antd";
import { UploadOutlined, PlusSquareFilled, CloseOutlined, } from "@ant-design/icons"; //Icons

import Form from "../../components/Core/Form";
import moment from "moment";

class BillModal extends Component {
    constructor() {
        super();
        this.billingRef = React.createRef();

        this.state = {
            editEmp: false,
            basicSubmitted: false,
            billingSubmitted: false,
            detailSubmitted: false,
            kinSubmitted: false,
            skillSubmitted: false,
            data: {
                pay_email: "Trigger.payme@oneLm.com",
                h_rate: "90",
                mem_ac: "98098",
                b_ac: "CPAL98304829101",
                pay_f: "Weekly",
                s_date: moment("12 26 2020"),
            },
            BillingFields: {
                formId: "billing_form",
                FormCol: 24,
                FieldSpace: 24,
                justifyField: "center",
                FormLayout: "inline",
                layout: { labelCol: { span: 9 }, wrapperCol: { span: 0 } },
                size: "middle",
                fields: [
                    {
                        Placeholder: "Payslip Email",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Membership A/c no",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "billing",
                        fieldCol: 12,
                        key: "pay_email",
                        size: "small",
                        type: "input",
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: "Payment Email is required",
                        //     },
                        // ],
                        itemStyle: { marginBottom: 1 },
                    },
                    {
                        object: "billing",
                        fieldCol: 12,
                        key: "mem_ac",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "input",
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: "Member Ship is required",
                        //     },
                        // ],
                        itemStyle: { marginBottom: 1 },
                    },
                    
                    {
                        Placeholder: "Bank Account No",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Bank Account Title",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "billing",
                        fieldCol: 12,
                        key: "b_ac_No",
                        size: "small",
                        type: "input",
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: "Account Number",
                        //     },
                        // ],
                        itemStyle: { marginBottom: 1 },
                    },
                    {
                        object: "billing",
                        fieldCol: 12,
                        key: "b_ac_Title",
                        size: "small",
                        type: "input",
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: "Account Number",
                        //     },
                        // ],
                        itemStyle: { marginBottom: 1 },
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
                        object: "billing",
                        fieldCol: 12,
                        key: "s_date",
                        size: "small",
                        type: "DatePicker",
                        fieldStyle: { width: "-webkit-fill-available" },
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: "Start Date is required",
                        //     },
                        // ],
                        itemStyle: { marginBottom: 1 },
                    },
                    {
                        object: "billing",
                        fieldCol: 12,
                        key: "e_date",
                        size: "small",
                        type: "DatePicker",
                        fieldStyle: { width: "-webkit-fill-available" },
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: "Start Date is required",
                        //     },
                        // ],
                        itemStyle: { marginBottom: 1 },
                    },
                    {
                        Placeholder: "Job Type",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Work In A Day",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "billing",
                        fieldCol: 12,
                        key: "job_type",
                        size: "small",
                        data: [
                            { label: "Casual", value: "casual" },
                            { label: "Part Time", value: "parttime" },
                            { label: "Full Time", value: "fulltime" },
                        ],
                        type: "Select",
                        itemStyle: { marginBottom: 1 },
                    },
                    {
                        object: "billing",
                        fieldCol: 12,
                        key: "h_day",
                        size: "small",
                        type: "InputNumber",
                        fieldStyle: { width: "-webkit-fill-available" },
                        itemStyle: { marginBottom: 1 },
                    },
                    {
                        Placeholder: "Rate",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Rate Duration",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    
                    {
                        object: "billing",
                        fieldCol: 12,
                        key: "rate",
                        size: "small",
                        type: "InputNumber",
                        shape: "$",
                        fieldStyle: { width: "-webkit-fill-available" },
                        itemStyle: { marginBottom: 1 },
                    },
                    {
                        object: "billing",
                        fieldCol: 12,
                        key: "rate_duration",
                        size: "small",
                        data: [
                            { label: "Hourly", value: "hourly" },
                            { label: "Weekly", value: "weekly" },
                            { label: "Monthly", value: "monthly" },
                            { label: "Yearly", value: "yearly" },
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
                        Placeholder: "Pay Frequence",
                        fieldCol: 24,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "billing",
                        fieldCol: 12,
                        key: "pay_f",
                        size: "small",
                        data: [
                            { label: "Daily", value: "daily" },
                            { label: "Weekly", value: "weekly" },
                            { label: "Fortnightly", value: "fortnightly" },
                            { label: "Monthly", value: "monthly" },
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
                    
                ],
            },
        };
    }

    componentDidMount = () => {
        const { editEmp } = this.props
        if (editEmp) {
            this.getRecord(editEmp);
        }
    };

    submit = () => {
        this.billingRef.current && this.billingRef.current.refs.billing_form.submit();
    };

    BillingCall = (vake) => {
        // this will work after  getting the Object from level form
        const {editEmp} = this.props
        const { billing } = vake
        if (!editEmp) {
            console.log("emes");
            this.addEmployee(billing); //add skill
        } else {
            console.log("edit");
            this.editRecord(billing); //edit skill
        }
    };

    addEmployee = (value) => {
        console.log("addEmployee", value);
        const { rows, callBack } = this.props;
        value.key = rows; // get new key
        value.s_date = value.s_date && moment(value.s_date).format( "ddd MMM DD YYYY" )
        value.e_date = value.e_date && moment(value.e_date).format( "ddd MMM DD YYYY" )
        callBack(value,false);
    };

    getRecord = (data) => {
        // console.log(data);
        console.log(data);
        data.s_date = data.s_date && moment(data.s_date)
        data.e_date = data.e_date && moment(data.e_date)
        this.billingRef.current.refs.billing_form.setFieldsValue({ billing: data, });
    };

    editRecord = (value) => {
        const { editEmp, callBack } = this.props;
        value.key = editEmp.key;
        console.log(value);
        value.s_date = value.s_date && moment(value.s_date).format( "ddd MMM DD YYYY" )
        value.e_date = value.e_date && moment(value.e_date).format( "ddd MMM DD YYYY" )
        callBack(value, editEmp.key);
    };

    render() {
        const { editEmp, visible, close } = this.props;
        const { BillingFields } = this.state;

        return (
            <Modal
                title={editEmp ? "Edit Billing" : "Add Billing"}
                centered
                visible={visible}
                onOk={() => { this.submit(); }}
                okText={"Save"}
                onCancel={close}
                width={700}
            >
                <Form
                    ref={this.billingRef}
                    Callback={this.BillingCall}
                    FormFields={BillingFields}
                />
            </Modal>
        );
    }
}

export default BillModal;
