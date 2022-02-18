import React, { useEffect, useState, Form } from 'react'
import FormItems from '../../components/Core/FormItems'
import { getLeavePolicy } from "../../service/constant-Apis";

const PersonalContract = (props)=> {
    const [form] = Form.useForm();
    const [fields, setFields] = useState([
        {
            Placeholder: "Employment Status",
            rangeMin: true,
            fieldCol: 12,
            size: "small",
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
        },
        {
            Placeholder: "Payslip Email",
            fieldCol: 12,
            size: "small",
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
        },
        {
            object: "billing",
            disabled: true,
            fieldCol: 12,
            key: "type",
            size: "small",
            data: [
                { label: "Casual", value: 1 },
                { label: "Part Time", value: 2 },
                { label: "Full Time", value: 3 },
            ],
            type: "Select",
            rules: [ { required: true, message: "Status is Required", }, ],
            itemStyle: { marginBottom: 20 },
        },
        {
            object: "billing",
            disabled: true,
            fieldCol: 12,
            key: "payslipEmail",
            size: "small",
            type: "input",
            // rules: [
            //     {
            //         required: true,
            //         message: "Payment Email is required",
            //     },
            // ],
            itemStyle: { marginBottom: 20 },
        },
        {
            Placeholder: "Full Work Hours",
            rangeMin: true,
            fieldCol: 12,
            size: "small",
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10p20'},
        },
        {
            Placeholder: "Contract Start Date",
            rangeMin: true,
            fieldCol: 12,
            size: "small",
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10p20'},
        },
        
        {
            object: "billing",
            disabled: true,
            fieldCol: 6,
            key: "noOfHours",
            size: "small",
            type: "InputNumber",
            // shape: " Hours",
            fieldStyle: { width: "100%" },
            rules: [ { required: true, message: "Work Hours is Required", }, ],
            itemStyle: { marginBottom: 20 },
        },
        {
            object: "billing",
            disabled: true,
            fieldCol: 6,
            key: "noOfHoursPer",
            size: "small",
            type: "Select",
            // shape: " Hours",
            data: [
                // { label: "Hourly", value: 1 },
                // { label: "Daily", value: 2 },
                { label: "Weekly", value: 3 },
                // { label: "Fortnightly", value: 4 },
                // { label: "Monthly", value: 5 },
            ],
            fieldStyle: { width: "100%" },
            rules: [ { required: true, message: "Work Hours is Required", }, ],
            itemStyle: { marginBottom: 20 },
        },
        {
            object: "billing",
            disabled: true,
            fieldCol: 12,
            key: "startDate",
            size: "small",
            type: "DatePicker",
            fieldStyle: { width: "100%" },
            rules: [ { required: true, message: "Start Date is Required", }, ],
            itemStyle: { marginBottom: 20 },
        },
        {
            Placeholder: "Contract End Date",
            fieldCol: 12,
            size: "small",
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10p20'},
        },
        {
            Placeholder: "Annual Base Salary",
            rangeMin: true,
            fieldCol: 12,
            size: "small",
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10p20'},
        },
        {
            object: "billing",
            disabled: true,
            fieldCol: 12,
            key: "endDate",
            size: "small",
            type: "DatePicker",
            fieldStyle: { width: "100%" },
            itemStyle: { marginBottom: 20 },
        },
        {
            object: "billing",
            disabled: true,
            fieldCol: 12,
            key: "remunerationAmount",
            size: "small",
            type: "InputNumber",
            shape: "$",
            fieldStyle: { width: "100%" },
            rules: [ { required: true, message: "Salary is Required", }, ],
            itemStyle: { marginBottom: 20 },
        },
        {
            Placeholder: "Pay Frequence",
            rangeMin: true,
            fieldCol: 12,
            size: "small",
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10p20'},
        },
        {
            Placeholder: "Leave Policy",
            rangeMin: true,
            fieldCol: 12,
            size: "small",
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
        },
        {
            object: "billing",
            disabled: true,
            fieldCol: 12,
            key: "payFrequency",
            size: "small",
            data: [
                { label: "Hourly", value: 1 },
                { label: "Daily", value: 2 },
                { label: "Weekly", value: 3 },
                { label: "Fortnightly", value: 4 },
                { label: "Monthly", value: 5 },
            ],
            type: "Select",
            rules: [ { required: true, message: "Payment Frequncy is required", }, ],
            itemStyle: { marginBottom: 20 },
        },
        {
            object: "billing",
            fieldCol: 12,
            disabled: true,
            key: "leaveRequestPolicyId",
            size: "small",
            data: [],
            type: "Select",
            rules: [ { required: true, message: "Policy is required", }, ],
            itemStyle: { marginBottom: 10 },
        },
        {
            Placeholder: "Comments",
            fieldCol: 24,
            size: "small",
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10p20'},
        },
        {
            object: "billing",
            disabled: true,
            fieldCol: 24,
            key: "comments",
            size: "small",
            type: "Textarea",
            itemStyle: { marginBottom: 20 },
        },
    ]);
    useEffect(() => {
        setLeavePolicy()
        form.setFieldsValue({billing: props.data})
    }, [])

    
    const setLeavePolicy = () =>{
        getLeavePolicy().then(res=>{
            if(res.success){
                const dummy = fields
                dummy[16].data = res.data
                setFields([...dummy])
            }
        })
    }
    return (
        <Form
            id={'my-form'}
            form={form}
            scrollToFirstError={true}
            size="small"
            layout="inline"
            style={{padding: 50, paddingTop:20}}
        >
            <FormItems FormFields={fields} />
        </Form>
    )
    
}

export default PersonalContract